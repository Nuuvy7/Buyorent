import { useSyncExternalStore } from "react";

export const COD_SPOTS = [
  { id: "kantin", name: "Kantin Gedung Baru Fasilkom UI", jam: "Jam 11:00 – 16:00 WIB" },
  { id: "stasiun", name: "Indomaret Point Stasiun UI", jam: "Jam 17:00 – 19:30 WIB" },
];

export interface CartLine {
  id: string;
  checked: boolean;
  codLoc?: string; // titik temu COD (barang)
  note?: string; // catatan janji temu
  brief?: string; // link draft materi (jasa)
}

const KEY = "buyorent_cart";
const EMPTY: CartLine[] = [];

// ponytail: qty selalu 1 per item & item lokal-* hilang setelah reload
// sebelum Supabase tersambung. Upgrade: quantity + tabel cart server-side.
function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

let state: CartLine[] = typeof window === "undefined" ? EMPTY : load();
const listeners = new Set<() => void>();

function commit(next: CartLine[]) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

export function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
export const getSnapshot = () => state;
export const getServerSnapshot = () => EMPTY;

export function addToCart(id: string) {
  if (state.some((l) => l.id === id)) return;
  commit([...state, { id, checked: true }]);
}
export function removeFromCart(id: string) {
  commit(state.filter((l) => l.id !== id));
}
export function setChecked(id: string, checked: boolean) {
  commit(state.map((l) => (l.id === id ? { ...l, checked } : l)));
}
export function setAllChecked(checked: boolean) {
  commit(state.map((l) => ({ ...l, checked })));
}
export function removeChecked() {
  commit(state.filter((l) => !l.checked));
}
export function updateLine(id: string, patch: Partial<CartLine>) {
  commit(state.map((l) => (l.id === id ? { ...l, ...patch } : l)));
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
