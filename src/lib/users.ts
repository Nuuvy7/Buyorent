import { emitStore } from "@/lib/store";

export interface AccountRecord {
  name: string;
  email: string;
  phone: string;
  campus: string;
  role: "user" | "admin";
  ktm: boolean;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  campus: string;
  role: "user" | "admin";
  ktm: boolean;
  isBlocked: boolean;
  createdAt: string;
}

const ACCOUNT_KEY = "buyorent_account";
const USERS_KEY = "buyorent_users";

const DEFAULT_ACCOUNT: AccountRecord = {
  name: "Daffa Rizky",
  email: "daffa.rizky@ui.ac.id",
  phone: "081234567800",
  campus: "UI Depok & Salemba",
  role: "user",
  ktm: true,
};

// Data dummy pengguna (konsisten dengan ITEMS katalog) — diganti tabel users
// Supabase saat auth tersambung.
const SEED_USERS: UserRecord[] = [
  { id: "usr-1001", name: "Rizky Maulana", email: "rizky.m@ui.ac.id", phone: "081234567801", campus: "UI Depok", role: "user", ktm: true, isBlocked: false, createdAt: "12 Agu 2026" },
  { id: "usr-1002", name: "Nadia Safira", email: "nadia.s@itb.ac.id", phone: "081234567802", campus: "ITB Bandung", role: "user", ktm: true, isBlocked: false, createdAt: "20 Agu 2026" },
  { id: "usr-1003", name: "Alifia Putri", email: "alifia.putri@gmail.com", phone: "081234567803", campus: "SMAN 28 Jakarta", role: "user", ktm: false, isBlocked: false, createdAt: "5 Sep 2026" },
  { id: "usr-1004", name: "Dimas Kurniawan", email: "dimas.k@gmail.com", phone: "081234567804", campus: "UGM Yogyakarta", role: "user", ktm: true, isBlocked: true, createdAt: "11 Sep 2026" },
  { id: "usr-1005", name: "Sultan Doven", email: "sultan.admin@ui.ac.id", phone: "081234567805", campus: "Fasilkom UI", role: "admin", ktm: true, isBlocked: false, createdAt: "1 Jul 2026" },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getAccount(): AccountRecord {
  return read<AccountRecord>(ACCOUNT_KEY, DEFAULT_ACCOUNT);
}

export function saveAccount(acc: AccountRecord) {
  try {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(acc));
  } catch {
    /* abaikan */
  }
  emitStore();
}

export function getUsers(): UserRecord[] {
  return read<UserRecord[]>(USERS_KEY, SEED_USERS);
}

export function saveUsers(users: UserRecord[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* abaikan */
  }
  emitStore();
}
