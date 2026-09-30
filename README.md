# Buyorent

Platform jual beli barang bekas dan sewa jasa untuk pelajar, mahasiswa, dan anak muda.

## Masalah

Pelajar SMA/sederajat berjualan via Facebook/WhatsApp — katalog berupa foto + caption di story/grup chat. Tidak terstruktur, tidak ada pencarian, jangkauan terbatas lingkaran pertemanan. Pelajar/mahasiswa punya skill (desain, foto, les privat, servis) tapi tidak ada wadah publikasi.

## Solusi

Buyorent menyatukan jual beli barang bekas + sewa jasa dalam satu platform. Katalog terpusat, pencarian & filter, transaksi terlacak.

## Tech Stack

| Layer          | Teknologi     |
|----------------|---------------|
| Framework      | Next.js       |
| Database/Auth  | Supabase      |
| Storage        | Supabase Storage |
| Styling        | Tailwind CSS  |

## Fitur

- **Auth** — Register & login (email + password, tanpa verifikasi email)
- **Listing** — Posting barang/jasa (nama, harga, foto, deskripsi, kategori), langsung tayang
- **Search & Filter** — Pencarian nama item, filter kategori (barang/jasa) dan rentang harga
- **Keranjang** — Per user, dikosongkan setelah checkout
- **Checkout & Pembayaran** — Transfer manual, penjual konfirmasi lunas
- **Riwayat Pesanan** — Status: Menunggu pembayaran → Diproses → Selesai
- **Sewa Jasa** — Pesanan jasa harus disetujui penjual; kontak (HP/WA) terbuka setelah approval
- **Admin** — Moderasi listing (setujui/turunkan), kelola user (lihat/blokir/hapus)

## Role

| Role    | Keterangan |
|---------|-----------|
| Pembeli | Semua akun bisa membeli |
| Penjual | Semua akun bisa berjualan (tidak ada role khusus) |
| Admin   | Moderasi konten & kelola pengguna |

## Database

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

**Fase**: Perancangan (flowchart, use case, desain UI)
**Belum dibangun**: Source code, payment gateway, deploy

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
