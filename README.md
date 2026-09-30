# Buyorent

Platform jual beli barang bekas dan sewa jasa untuk pelajar, mahasiswa, dan anak muda.

## Masalah

Pelajar SMA/sederajat berjualan via Facebook/WhatsApp — katalog berupa foto + caption di story/grup chat. Tidak terstruktur, tidak ada pencarian, jangkauan terbatas lingkaran pertemanan. Pelajar/mahasiswa punya skill (desain, foto, les privat, servis) tapi tidak ada wadah publikasi.

## Solusi

Buyorent menyatukan jual beli barang bekas + sewa jasa dalam satu platform. Katalog terpusat, pencarian & filter, transaksi terlacak.

## Tech Stack

| Layer          | Teknologi                                      |
|----------------|------------------------------------------------|
| Framework      | Next.js 14 (App Router)                        |
| Database/Auth  | Supabase (client `@supabase/ssr` siap, belum tersambung) |
| Storage        | Supabase Storage (belum dipakai)               |
| Styling        | Tailwind CSS + komponen ala shadcn/ui (cva, lucide-react) |
| Animasi        | GSAP (`gsap.context()` + cleanup)              |
| Data sementara | `localStorage` (sampai Supabase tersambung)    |

## Cara Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
```

Variabel lingkungan (belum wajib — auth/DB belum aktif):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

> **Catatan**: jangan menjalankan `npm run build` selagi `next dev` masih hidup — `.next/` jadi rusak dan halaman tampil plain HTML. Matikan dev server dulu, lalu build.

## Fitur

- **Auth** — Register & login (email + password, tanpa verifikasi email) — *menyusul*
- **Listing** — Posting barang/jasa (nama, harga, foto, deskripsi, kategori), langsung tayang
- **Search & Filter** — Pencarian nama item, filter kategori (barang/jasa), kondisi, kampus, rentang harga, urutkan
- **Keranjang** — Pilih item + titik COD/catatan, ringkasan ongkir, dikosongkan setelah checkout
- **Checkout & Pembayaran** — Transfer manual + upload bukti, tanpa payment gateway
- **Riwayat Pesanan** — Status: Menunggu pembayaran → Diproses → Selesai — *halaman riwayat menyusul* (order sudah tersimpan)
- **Sewa Jasa** — Pesanan jasa disetujui penjual; kontak (HP/WA) terbuka setelah approval
- **Admin** — Moderasi listing (setujui/turunkan), kelola user (lihat/blokir/hapus)
- **Kelola Akun** — Edit profil, peran (role demo sebelum auth aktif)

## Halaman & Status

| Route           | Halaman                          | Status                     |
|-----------------|----------------------------------|----------------------------|
| `/` dan `/items`| Katalog + search + filter        | ✅ UI, data statis + iklan lokal |
| `/items/[id]`   | Detail produk/jasa               | ✅ UI                      |
| `/items/new`    | Form pasang iklan                | ✅ UI, draft localStorage  |
| `/cart`         | Keranjang                        | ✅ UI (`buyorent_cart`)    |
| `/checkout`     | Pembayaran transfer manual       | ✅ UI (`buyorent_orders`)  |
| `/account`      | Kelola akun pengguna             | ✅ UI (`buyorent_account`) |
| `/admin`        | Dashboard admin (gate role admin)| ✅ UI (`buyorent_account`) |
| `/admin/items`  | Moderasi listing                 | ✅ UI (`buyorent_takedown`)|
| `/admin/users`  | Kelola pengguna                  | ✅ UI (`buyorent_users`)   |
| `/login`, `/register` | Auth Supabase               | ⏳ menyusul                |
| `/orders`, `/orders/[id]`, `/seller/orders` | Riwayat pesanan | ⏳ menyusul        |

Moderasi listing langsung berefek: listing yang diturunkan hilang dari katalog, pencarian, dan detail (CTA beli dinonaktifkan).

## Role

| Role    | Keterangan                                            |
|---------|-------------------------------------------------------|
| Pembeli | Semua akun bisa membeli                               |
| Penjual | Semua akun bisa berjualan (tidak ada role khusus)     |
| Admin   | Moderasi konten & kelola pengguna (`role` di `users`) |

## Database

Skema desain awal (belum tersambung — UI memakai `localStorage`):

Tabel: `users`, `items`, `categories`, `cart`, `orders`, `order_items`

```
users 1──N items
users 1──N orders
orders 1──N order_items
items N──1 categories
```

## Alur

1. Register/login
2. Penjual posting listing → tersimpan di `items`
3. Pembeli cari & filter → baca `items` + `categories`
4. Pilih item → masuk `cart`
5. Checkout → buat `orders` + `order_items`, kosongkan `cart`
6. Upload bukti transfer → penjual approve → status Diproses
7. Selesai → status Selesai
8. Jasa: perlu approval penjual, kontak baru terbuka
9. Admin: moderasi listing, kelola user

## Status Proyek

**Fase**: Implementasi frontend — katalog, detail, pasang iklan, keranjang, checkout, kelola akun, panel admin selesai dan terverifikasi (type-check, lint, uji alur browser).

**Belum dibangun**:
- Supabase auth (login/register, session, cek `role`/`is_blocked` server-side)
- Koneksi database + RLS (skema di atas; data UI kini di `localStorage`)
- Halaman riwayat pesanan (`/orders`, `/seller/orders`)
- Payment gateway — sesuai PRD **tidak dipakai** (transfer manual)
- Deploy

## Tim

- Zariel Walid Hidayat
- Muhammad Jundi Al Hafidz
- Muhammad Salim Umar
- Wildan Haibatur Rohim
- Sultan Doven Hagi
- Fauzunnajah Attamam

Guru pengajar: Raihan Ibrahim Saputra

## Dokumentasi

- [BRD.md](BRD.md) — Business Requirements Document
- [PRD.md](PRD.md) — Product Requirements Document
- [SRS.md](SRS.md) — Software Requirements Specification
- `docs/` — Laporan progres & LKPD
