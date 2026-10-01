import { useEffect, useSyncExternalStore } from "react";
import { createClient } from "@/lib/supabase/client";

export const COD_SPOTS = [
  { id: "kantin", name: "Kantin Pusat Universitas Trisakti", jam: "Jam 11:00 – 16:00 WIB" },
  { id: "stasiun", name: "Stasiun Sudirman (Jakarta Pusat)", jam: "Jam 17:00 – 19:30 WIB" },
];

export interface CartLine {
  id: string;
  checked: boolean;
  codLoc?: string; // titik temu COD (barang) → kolom cart.cod_spot
  note?: string; // catatan janji temu
  brief?: string; // link draft materi (jasa)
}

// Sumber data = tabel cart (Tahap D2). `checked` TIDAK ada kolomnya di tabel —
// itu status pilih baris untuk checkout, transien per sesi; selalu mulai true
// (sama dengan perilaku addToCart lama).
// Tamu (belum login) = buffer memori lokal; setelah login/daftar,
// flushGuestCart() menulisnya ke server. Baris tanpa uuid valid (listing
// session-local hasil D1) tidak bisa masuk server — tetap lokal selama sesi.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const canSync = (id: string) => UUID_RE.test(id);
const SERVER_COLS = "item_id, cod_spot, note, brief";

const EMPTY: CartLine[] = [];
let state: CartLine[] = typeof window === "undefined" ? EMPTY : EMPTY;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}
function commit(next: CartLine[]) {
  state = next;
  notify();
}

export function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
export const getSnapshot = () => state;
export const getServerSnapshot = () => EMPTY;

function mapRow(r: {
  item_id: string;
  cod_spot: string | null;
  note: string | null;
  brief: string | null;
}): CartLine {
  return {
    id: r.item_id,
    checked: true,
    codLoc: r.cod_spot ?? undefined,
    note: r.note ?? undefined,
    brief: r.brief ?? undefined,
  };
}

/** Operasi tulis server hanya jika ada sesi; senyap untuk tamu. */
async function withSession(fn: (userId: string) => PromiseLike<unknown>): Promise<void> {
  const { data: { session } } = await createClient().auth.getSession();
  if (!session) return;
  await fn(session.user.id);
}

/** Gabung baris server ke state (union by id; baris lokal non-server dipertahankan). */
function mergeServer(rows: CartLine[]) {
  const ids = new Set(rows.map((r) => r.id));
  commit([...rows, ...state.filter((l) => !ids.has(l.id))]);
}

// Hydrate per sesi: sekali per user, ulang setelah login/logout.
let sessionUserId: string | null = null;
let hydratedOnce = false;

async function hydrateCart(): Promise<void> {
  const { data: { session } } = await createClient().auth.getSession();
  const uid = session?.user.id ?? null;
  if (hydratedOnce && uid === sessionUserId) return;
  sessionUserId = uid;
  hydratedOnce = true;
  if (!uid) return; // tamu: buffer lokal saja
  const { data, error } = await createClient()
    .from("cart")
    .select(SERVER_COLS)
    .order("created_at");
  if (error) {
    console.error("cart hydrate:", error.message);
    hydratedOnce = false; // coba lagi pada mount berikutnya
    return;
  }
  mergeServer(((data ?? []) as unknown as { item_id: string; cod_spot: string | null; note: string | null; brief: string | null }[]).map(mapRow));
}

/**
 * Panggil setelah login/daftar: tulis buffer tamu ke server lalu muat cart
 * milik sesi baru. Baris yang sudah ada di server tidak diduplikasi.
 */
export async function flushGuestCart(): Promise<void> {
  const { data: { session } } = await createClient().auth.getSession();
  if (!session) return;
  const uid = session.user.id;
  sessionUserId = uid;
  hydratedOnce = true;

  const { data, error } = await createClient()
    .from("cart")
    .select(SERVER_COLS)
    .order("created_at");
  if (error) {
    console.error("cart flush:", error.message);
    return;
  }
  const server = ((data ?? []) as unknown as { item_id: string; cod_spot: string | null; note: string | null; brief: string | null }[]).map(mapRow);
  const serverIds = new Set(server.map((r) => r.id));
  const guestNew = state.filter((l) => !serverIds.has(l.id) && canSync(l.id));
  if (guestNew.length) {
    const { error: insErr } = await createClient()
      .from("cart")
      .insert(
        guestNew.map((g) => ({
          user_id: uid,
          item_id: g.id,
          quantity: 1,
          cod_spot: g.codLoc ?? null,
          note: g.note ?? null,
          brief: g.brief ?? null,
        }))
      );
    if (insErr) console.error("cart flush insert:", insErr.message);
  }
  // union: baris server + semua baris lokal yang belum ada di server
  mergeServer(server);
}

/** Panggil saat keluar: buang state lokal supaya cart user berikutnya bersih. */
export function resetCart() {
  state = EMPTY;
  sessionUserId = null;
  hydratedOnce = false;
  notify();
}

export function addToCart(id: string) {
  if (state.some((l) => l.id === id)) return;
  commit([...state, { id, checked: true }]);
  if (canSync(id)) {
    void withSession((uid) =>
      createClient()
        .from("cart")
        .insert({ user_id: uid, item_id: id, quantity: 1 })
        .then(({ error }) => {
          if (error) console.error("cart add:", error.message);
        })
    );
  }
}

export function removeFromCart(id: string) {
  commit(state.filter((l) => l.id !== id));
  if (canSync(id)) {
    void withSession(() =>
      createClient()
        .from("cart")
        .delete()
        .eq("item_id", id)
        .then(({ error }) => {
          if (error) console.error("cart remove:", error.message);
        })
    );
  }
}

// `checked` = pilihan baris untuk checkout — transien, tanpa tulis server.
export function setChecked(id: string, checked: boolean) {
  commit(state.map((l) => (l.id === id ? { ...l, checked } : l)));
}
export function setAllChecked(checked: boolean) {
  commit(state.map((l) => ({ ...l, checked })));
}

export function removeChecked() {
  const gone = state.filter((l) => l.checked).map((l) => l.id);
  commit(state.filter((l) => !l.checked));
  const syncIds = gone.filter(canSync);
  if (syncIds.length) {
    void withSession(() =>
      createClient()
        .from("cart")
        .delete()
        .in("item_id", syncIds)
        .then(({ error }) => {
          if (error) console.error("cart removeChecked:", error.message);
        })
    );
  }
}

export function updateLine(id: string, patch: Partial<CartLine>) {
  commit(state.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const row: Record<string, unknown> = {};
  if ("codLoc" in patch) row.cod_spot = patch.codLoc ?? null;
  if ("note" in patch) row.note = patch.note ?? null;
  if ("brief" in patch) row.brief = patch.brief ?? null;
  if (Object.keys(row).length && canSync(id)) {
    void withSession(() =>
      createClient()
        .from("cart")
        .update(row)
        .eq("item_id", id)
        .then(({ error }) => {
          if (error) console.error("cart updateLine:", error.message);
        })
    );
  }
}

export function useCart() {
  useEffect(() => {
    void hydrateCart();
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
