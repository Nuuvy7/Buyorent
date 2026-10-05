import { emitStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

// Sumber data profil & pengguna = tabel users Supabase (Tahap D3).
// Jembatan localStorage lama sudah dihapus total (nol key tersisa di Tahap D).
// Role: pembacaan dari kolom role — promosi admin hanya lewat SQL
// (supabase/setup-admin.sql), karena RLS WITH CHECK memblokir promosi diri.

export interface AccountRecord {
  name: string;
  email: string;
  phone: string;
  kecamatan: string;
  role: "user" | "admin";
  ktm: boolean;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  kecamatan: string;
  role: "user" | "admin";
  ktm: boolean;
  isBlocked: boolean;
  createdAt: string;
}

interface UserDbRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  kecamatan: string | null;
  ktm: boolean;
  role: "user" | "admin";
  is_blocked?: boolean;
  created_at?: string;
}

const ACC_COLS = "name, email, phone, kecamatan, role, ktm";
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function fmtDate(iso: string | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

function mapAcc(r: {
  name: string;
  email: string;
  phone: string | null;
  kecamatan: string | null;
  role: "user" | "admin";
  ktm: boolean;
}): AccountRecord {
  return {
    name: r.name ?? "",
    email: r.email,
    phone: r.phone ?? "",
    kecamatan: r.kecamatan ?? "",
    role: r.role === "admin" ? "admin" : "user",
    ktm: !!r.ktm,
  };
}

function mapUser(r: UserDbRow): UserRecord {
  return {
    id: r.id,
    name: r.name ?? "",
    email: r.email,
    phone: r.phone ?? "",
    kecamatan: r.kecamatan ?? "",
    role: r.role === "admin" ? "admin" : "user",
    ktm: !!r.ktm,
    isBlocked: !!r.is_blocked,
    createdAt: fmtDate(r.created_at),
  };
}

// Cache profil per-uid: hindari query doang tiap mount; invalidasi lewat uid
// berbeda (ganti sesi) atau clearAccount() saat keluar.
let accCache: { uid: string; acc: AccountRecord } | null = null;

/** Profil sesi berjalan; null bila belum login / baris belum terbentuk. */
export async function getAccount(): Promise<AccountRecord | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;
  if (accCache && accCache.uid === session.user.id) return accCache.acc;
  const { data, error } = await supabase
    .from("users")
    .select(ACC_COLS)
    .eq("id", session.user.id)
    .maybeSingle();
  if (error) {
    console.error("getAccount:", error.message);
    return null;
  }
  if (!data) return null;
  const acc = mapAcc(data as unknown as Parameters<typeof mapAcc>[0]);
  accCache = { uid: session.user.id, acc };
  return acc;
}

/**
 * Simpan profil (name/email/phone/kecamatan). Role TIDAK lewat sini — promosi
 * admin via supabase/setup-admin.sql (RLS WITH CHECK menolak promosi diri).
 */
export async function saveAccount(
  acc: AccountRecord
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { ok: false, error: "Tidak ada sesi — silakan masuk lagi" };
  const { error } = await supabase
    .from("users")
    .update({
      name: acc.name,
      email: acc.email,
      phone: acc.phone,
      kecamatan: acc.kecamatan,
    })
    .eq("id", session.user.id);
  if (error) return { ok: false, error: error.message };
  accCache = { uid: session.user.id, acc: { ...acc } };
  emitStore();
  return { ok: true };
}

/** Dipakai tombol keluar: buang cache profil setelah signOut. */
export function clearAccount() {
  accCache = null;
  emitStore();
}

/**
 * Daftar pengguna (panel admin). RLS: admin melihat semua — selain itu hanya
 * baris sendiri; panel admin sudah di-gate role di layout.
 */
export async function getUsers(): Promise<UserRecord[]> {
  const { data, error } = await createClient()
    .from("users")
    .select("id, name, email, phone, kecamatan, ktm, role, is_blocked, created_at")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("getUsers:", error.message);
    return [];
  }
  return ((data ?? []) as unknown as UserDbRow[]).map(mapUser);
}

/** Blokir / buka blokir akun (admin — RLS update sendiri atau admin). */
export async function setUserBlocked(
  id: string,
  blocked: boolean
): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await createClient()
    .from("users")
    .update({ is_blocked: blocked })
    .eq("id", id)
    .select("id");
  if (error) return { ok: false, error: error.message };
  if (!data?.length) return { ok: false, error: "Tidak ada izin (butuh role admin)" };
  emitStore();
  return { ok: true };
}

/** Hapus permanen akun (butuh policy "users: hapus admin" — setup-admin.sql). */
export async function deleteUser(id: string): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await createClient()
    .from("users")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) return { ok: false, error: error.message };
  if (!data?.length) return { ok: false, error: "Tidak ada izin (butuh role admin)" };
  emitStore();
  return { ok: true };
}
