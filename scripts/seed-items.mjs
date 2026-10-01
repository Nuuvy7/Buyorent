/* Seed 6 listing katalog ke Supabase (Tahap D1).
   Idempoten: hanya insert uuid yang belum ada. Metadata tampilan listing seed
   (badge/kategori label/rating/priceUnit) tercatat di src/lib/items.ts (SEED_META)
   dengan uuid yang SAMA — jangan ubah uuid di sini tanpa mengubah SEED_META.

   Jalankan:
     node --env-file=.env.local scripts/seed-items.mjs <email-penjual> <password>
   (penjual harus user auth yang sudah terdaftar; RLS insert butuh seller_id = auth.uid) */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const [email, password] = process.argv.slice(2);

if (!url || !key || url.includes("PROJECT-REF")) {
  console.error("FAIL: .env.local belum diisi");
  process.exit(1);
}
if (!email || !password) {
  console.error("Pakai: node --env-file=.env.local scripts/seed-items.mjs <email> <password>");
  process.exit(1);
}

const H = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};

const SEEDS = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    category: "Barang",
    sub_category: "Casio FX-991EX",
    name: "Kalkulator Ilmiah Casio FX-991EX",
    description:
      "Dipakai 2 semester matkul Kalkulus. Layar bening, tombol responsif 100%, bonus baterai cadangan.",
    price: 140000,
    condition: "like-new",
    location: "UI Salemba",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBGWQVWin4spjXjFKD6SxnAHPNgHv26kfF9qqIi0E-zo4OhYDVZrKJg9SV9M09IbvJXT7pPzXUH8XoRPwcIe0e470Txyzc-iqxJc-hZi9CBSKtZu5SYbmFDAEHqtiz2j5WhOTaQ9pDPSKzosJIlyuWTSO_2IHzUD_Sr5VnmiHdnqh5ZqevmdiOck-viXA7s9XU_b0SePJmUjNcqxdvv2mS6Qe2ZLTtSYPnbrPvrRofY1eO9C9DTPNGFQ",
    seller_name: "Rizky M.",
    seller_campus: "UI Salemba",
    seller_ktm: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    category: "Jasa",
    sub_category: "Revisi 2x",
    name: "Desain PPT Sidang & Poster Skripsi",
    description:
      "Layout modern, infografis data rapi siap sidang, file Canva Pro atau PPT editable.",
    price: 35000,
    condition: null,
    location: "DKV Binus Jakarta",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSIdSKHxgj5QPvunyLR1oMzEuexatWFCxLa5tpx31qALEtd6yVxbEkj9tn9KWT1LSP7fv-ts6Rzi5MMcLeIGLayYOI5_soax9grAy4quEjoFf7s9EC1j3iGZr8yi33jlBsSzv6ZcbvsdpdoUIJXI47pwFzTsx8I1Bt3qw4BFF4S8mWJWXrVAJzUUDCUbMlORtSlA1aaxjqED-_1HPlSX9soGvf76dGInbopEopkxVwwI5Ox7ud1O1jzw",
    seller_name: "Nadia S.",
    seller_campus: "DKV Binus Jakarta",
    seller_ktm: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    category: "Barang",
    sub_category: "Size XL",
    name: "Kemeja Flanel Uniqlo Vintage",
    description:
      "Warna pekat 90%, katun tebal lembut khas Uniqlo, wangi laundry siap pakai ngampus.",
    price: 65000,
    condition: "used",
    location: "Halte Pasar Senen",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCd6_OBrPsNEH3YdOXTni5bNxNvaLQ2qazdFX9RrocUCjjEHQYE5pPrkAEPu2SIW7iOiv3RdMfq5uYBuQaOxGqHnnXuXZdqPLtbE1Uh9Xogv18GTxuFfGSkRgqDmc02X3YnBIzkaXgM6qpDpo8m_YY9Ll7C2idEgUYeJxf3xtlaUgmBEIUGVpCBkPQkR79DWUc3VRyE_3mptD41NqwdULCMxzKybfuQTSgzKCr3V0wu8qc1x4w1wXQk9A",
    seller_name: "Alifia",
    seller_campus: "SMAN 28",
    seller_ktm: false,
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    category: "Jasa",
    sub_category: "Garansi 14 Hari",
    name: "Servis & Install Ulang Laptop",
    description:
      "Install OS bersih, ganti pasta thermal, upgrade SSD, dan install software kuliah lengkap.",
    price: 50000,
    condition: null,
    location: "Siap Datang ke Kost",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-Rk-m7P92D8sa2Zr2J3RwMhsUNau55-9AuA6mwe4yjbQu5NWkxBT95UPD5DvGszTQ80kZ9rJqwSAnpxAaI-6jRjJQ6WUqMKP-KGyI6AQUFMMpTfTZ7BmiT0HHKMK4KgExH-t57KOOIHogJDXaMm__okUQu968hs4IBNG300aEJyo9Qc92m1-OZOkThHGKZZRAVhEpCJ68dEE3nicqX07i3mjqRzCm0X74PpuLOHLikO7i-6ZbQIEjsg",
    seller_name: "Bima Tech",
    seller_campus: "Universitas Trisakti",
    seller_ktm: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    category: "Barang",
    sub_category: "3 Tingkat Terang",
    name: "Lampu Meja Belajar Aesthetic",
    description:
      "Leher fleksibel, port USB charger HP, sensor sentuh. Dijual karena selesai kuliah & pindah kost.",
    price: 45000,
    condition: "like-new",
    location: "Kost Tebet, Jakarta Selatan",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAiC-OPADkgOaFC3JvOjS2f3Lze6B7gZJuhZYvP5RMS8PnI6PiBGgK3XkEk40OhEts18ncQOL4GSYuZRsbmqXyTfn98qBU8PrmPWp-Qxl0oeZJxxw8If6ZwhdrdRbghu7PSj1a1cm72YON8k37sEEGi8JBz5gUbQvpWe2F7grh8SBjL6eFFG_pu-Ak0lFW7DpiK68Eq0pwuGQLTBxVXBYE-909YLW7LdaWQm9CnjLfYQL96yFk3hBlPbw",
    seller_name: "Dimas K.",
    seller_campus: "Tebet",
    seller_ktm: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000006",
    category: "Jasa",
    sub_category: "Sony A7",
    name: "Fotografer Wisuda Paket Hemat",
    description:
      "Warna natural estetik, siap foto bersama keluarga/sahabat, file Google Drive di hari H.",
    price: 150000,
    condition: null,
    location: "Softfile + 10 Edit",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCvORGLssFRSO5CPoriG3wNBqAH4WeEhIbpAR-ER36dHnE_7DVPpb327FqqzsdBbOzUNMDhCOLeEX68hDkIaOSzUQXZmafCxOpyD3GS9KqE9FXcJWUIxQxn5IseUDBFyd5W6zMV_TwiUWhnV0zQxgjzzhsdKNtueHgljOXICvsCHKxslP_A6gCp5TN5lFbmXw1JqGik63JosiR4H6gDFcwAcXz32irRBO9eJH2ilyakp-sa4F6NGZbbtA",
    seller_name: "LensKreatif",
    seller_campus: "UI Salemba",
    seller_ktm: true,
  },
];

async function main() {
  // 1. login penjual (RLS insert: seller_id harus auth.uid sendiri)
  const li = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ email, password }),
  });
  const sess = await li.json();
  if (!sess.access_token) {
    console.error("FAIL login:", li.status, sess.error_description ?? sess);
    process.exit(1);
  }
  const auth = { ...H, Authorization: `Bearer ${sess.access_token}` };

  // 2. kategori name → id
  const cat = await fetch(`${url}/rest/v1/categories?select=id,name`, { headers: auth });
  const cats = await cat.json();
  if (!Array.isArray(cats) || cats.length < 2) {
    console.error("FAIL: categories belum di-seed", cats);
    process.exit(1);
  }
  const catId = Object.fromEntries(cats.map((c) => [c.name, c.id]));

  // 3. id yang sudah ada (idempoten)
  const ex = await fetch(`${url}/rest/v1/items?select=id`, { headers: auth });
  const existing = new Set((await ex.json()).map((r) => r.id));
  const missing = SEEDS.filter((s) => !existing.has(s.id));
  if (!missing.length) {
    console.log(`OK: semua ${SEEDS.length} listing seed sudah ada`);
    return;
  }

  // 4. insert (created_at digeser per urutan supaya urutan katalog lama terjaga)
  const base = Date.now() - missing.length * 60_000;
  const rows = missing.map((s, i) => ({
    id: s.id,
    seller_id: sess.user.id,
    category_id: catId[s.category],
    sub_category: s.sub_category,
    name: s.name,
    description: s.description,
    price: s.price,
    condition: s.condition,
    location: s.location,
    image_url: s.image_url,
    seller_name: s.seller_name,
    seller_campus: s.seller_campus,
    seller_ktm: s.seller_ktm,
    is_approved: true,
    created_at: new Date(base + i * 60_000).toISOString(),
  }));
  const ins = await fetch(`${url}/rest/v1/items`, {
    method: "POST",
    headers: { ...auth, Prefer: "return=minimal" },
    body: JSON.stringify(rows),
  });
  if (!ins.ok) {
    console.error("FAIL insert:", ins.status, await ins.text());
    process.exit(1);
  }
  console.log(`OK: ${rows.length} listing seed di-insert (penjual ${email})`);
}

main();
