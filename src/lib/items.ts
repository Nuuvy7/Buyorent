import type { ItemData } from "@/components/item-card";
import { emitStore } from "@/lib/store";

export const ITEMS: ItemData[] = [
  {
    id: "1",
    name: "Kalkulator Ilmiah Casio FX-991EX",
    category: "barang",
    categoryLabel: "Alat Kuliah",
    subLabel: "Casio FX-991EX",
    condition: "like-new",
    description: "Dipakai 2 semester matkul Kalkulus. Layar bening, tombol responsif 100%, bonus baterai cadangan.",
    price: 140000,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBGWQVWin4spjXjFKD6SxnAHPNgHv26kfF9qqIi0E-zo4OhYDVZrKJg9SV9M09IbvJXT7pPzXUH8XoRPwcIe0e470Txyzc-iqxJc-hZi9CBSKtZu5SYbmFDAEHqtiz2j5WhOTaQ9pDPSKzosJIlyuWTSO_2IHzUD_Sr5VnmiHdnqh5ZqevmdiOck-viXA7s9XU_b0SePJmUjNcqxdvv2mS6Qe2ZLTtSYPnbrPvrRofY1eO9C9DTPNGFQ",
    badge: "95% Mulus",
    location: "UI Salemba",
    seller: {
      name: "Rizky M.",
      avatarText: "R",
      campus: "UI Salemba",
      verified: true,
    },
  },
  {
    id: "2",
    name: "Desain PPT Sidang & Poster Skripsi",
    category: "jasa",
    categoryLabel: "Freelance",
    subLabel: "Revisi 2x",
    description: "Layout modern, infografis data rapi siap sidang, file Canva Pro atau PPT editable.",
    price: 35000,
    priceUnit: "/slide",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSIdSKHxgj5QPvunyLR1oMzEuexatWFCxLa5tpx31qALEtd6yVxbEkj9tn9KWT1LSP7fv-ts6Rzi5MMcLeIGLayYOI5_soax9grAy4quEjoFf7s9EC1j3iGZr8yi33jlBsSzv6ZcbvsdpdoUIJXI47pwFzTsx8I1Bt3qw4BFF4S8mWJWXrVAJzUUDCUbMlORtSlA1aaxjqED-_1HPlSX9soGvf76dGInbopEopkxVwwI5Ox7ud1O1jzw",
    badge: "Jasa Desain",
    location: "DKV Binus Jakarta",
    rating: "4.9 • 42 Portofolio",
    seller: {
      name: "Nadia S.",
      avatarText: "N",
      campus: "DKV Binus Jakarta",
      verified: true,
    },
  },
  {
    id: "3",
    name: "Kemeja Flanel Uniqlo Vintage",
    category: "barang",
    categoryLabel: "Fashion",
    subLabel: "Size XL",
    condition: "used",
    description: "Warna pekat 90%, katun tebal lembut khas Uniqlo, wangi laundry siap pakai ngampus.",
    price: 65000,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCd6_OBrPsNEH3YdOXTni5bNxNvaLQ2qazdFX9RrocUCjjEHQYE5pPrkAEPu2SIW7iOiv3RdMfq5uYBuQaOxGqHnnXuXZdqPLtbE1Uh9Xogv18GTxuFfGSkRgqDmc02X3YnBIzkaXgM6qpDpo8m_YY9Ll7C2idEgUYeJxf3xtlaUgmBEIUGVpCBkPQkR79DWUc3VRyE_3mptD41NqwdULCMxzKybfuQTSgzKCr3V0wu8qc1x4w1wXQk9A",
    badge: "Thrifted",
    location: "Halte Pasar Senen",
    seller: {
      name: "Alifia",
      avatarText: "A",
      campus: "SMAN 28",
      verified: true,
    },
  },
  {
    id: "4",
    name: "Servis & Install Ulang Laptop",
    category: "jasa",
    categoryLabel: "Tech Support",
    subLabel: "Garansi 14 Hari",
    description: "Install OS bersih, ganti pasta thermal, upgrade SSD, dan install software kuliah lengkap.",
    price: 50000,
    priceUnit: "/sesi",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-Rk-m7P92D8sa2Zr2J3RwMhsUNau55-9AuA6mwe4yjbQu5NWkxBT95UPD5DvGszTQ80kZ9rJqwSAnpxAaI-6jRjJQ6WUqMKP-KGyI6AQUFMMpTfTZ7BmiT0HHKMK4KgExH-t57KOOIHogJDXaMm__okUQu968hs4IBNG300aEJyo9Qc92m1-OZOkThHGKZZRAVhEpCJ68dEE3nicqX07i3mjqRzCm0X74PpuLOHLikO7i-6ZbQIEjsg",
    badge: "Teknisi Kampus",
    location: "Siap Datang ke Kost",
    seller: {
      name: "Bima Tech",
      avatarText: "B",
      campus: "Universitas Trisakti",
      verified: true,
    },
  },
  {
    id: "5",
    name: "Lampu Meja Belajar Aesthetic",
    category: "barang",
    categoryLabel: "Perlengkapan Kost",
    subLabel: "3 Tingkat Terang",
    condition: "like-new",
    description: "Leher fleksibel, port USB charger HP, sensor sentuh. Dijual karena selesai kuliah & pindah kost.",
    price: 45000,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiC-OPADkgOaFC3JvOjS2f3Lze6B7gZJuhZYvP5RMS8PnI6PiBGgK3XkEk40OhEts18ncQOL4GSYuZRsbmqXyTfn98qBU8PrmPWp-Qxl0oeZJxxw8If6ZwhdrdRbghu7PSj1a1cm72YON8k37sEEGi8JBz5gUbQvpWe2F7grh8SBjL6eFFG_pu-Ak0lFW7DpiK68Eq0pwuGQLTBxVXBYE-909YLW7LdaWQm9CnjLfYQL96yFk3hBlPbw",
    badge: "Kost Gear",
    location: "Kost Tebet, Jakarta Selatan",
    seller: {
      name: "Dimas K.",
      avatarText: "D",
      campus: "Tebet",
      verified: true,
    },
  },
  {
    id: "6",
    name: "Fotografer Wisuda Paket Hemat",
    category: "jasa",
    categoryLabel: "Fotografi Wisuda",
    subLabel: "Sony A7",
    description: "Warna natural estetik, siap foto bersama keluarga/sahabat, file Google Drive di hari H.",
    price: 150000,
    priceUnit: "/2 jam",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvORGLssFRSO5CPoriG3wNBqAH4WeEhIbpAR-ER36dHnE_7DVPpb327FqqzsdBbOzUNMDhCOLeEX68hDkIaOSzUQXZmafCxOpyD3GS9KqE9FXcJWUIxQxn5IseUDBFyd5W6zMV_TwiUWhnV0zQxgjzzhsdKNtueHgljOXICvsCHKxslP_A6gCp5TN5lFbmXw1JqGik63JosiR4H6gDFcwAcXz32irRBO9eJH2ilyakp-sa4F6NGZbbtA",
    badge: "Jasa Foto",
    location: "Softfile + 10 Edit",
    seller: {
      name: "LensKreatif",
      avatarText: "L",
      campus: "UI Salemba",
      verified: true,
    },
  },
];

/* Moderasi listing (PRD §8: admin menyetujui/menurunkan listing).
   Map id → ISO waktu diturunkan; tidak ada di map = tayang.
   ponytail: persist lokal sampai kolom is_approved items tersambung ke Supabase. */
const TAKEDOWN_KEY = "buyorent_takedown";

export type Takedowns = Record<string, string>;

export function getTakedowns(): Takedowns {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(TAKEDOWN_KEY) || "{}") as Takedowns;
  } catch {
    return {};
  }
}

export function setTakedown(id: string, down: boolean) {
  const map = getTakedowns();
  if (down) map[id] = new Date().toISOString();
  else delete map[id];
  try {
    localStorage.setItem(TAKEDOWN_KEY, JSON.stringify(map));
  } catch {
    /* storage penuh/di-block — abaikan, state tetap di memori sesi ini */
  }
  emitStore();
}

export function fmtDownTime(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
