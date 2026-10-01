<div align="center">

  # Buyorent
  ### Platform Jual Beli Barang Bekas & Sewa Jasa Antar Mahasiswa

  [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Nuuvy7/Buyorent)

  **By Kelompok 6**

</div>

---

## 📋 Daftar Isi

- [Tim Developer](#-tim-developer)
- [Tentang Proyek](#-tentang-proyek)
- [Fitur Unggulan](#-fitur-unggulan)
- [Teknologi](#️-teknologi)
- [Arsitektur Sistem](#️-arsitektur-sistem)
- [Instalasi & Setup](#️-instalasi--setup)
- [Penggunaan](#-penggunaan)
- [Status Proyek](#-status-proyek)
- [Dokumentasi](#-dokumentasi)

---

## 👥 Tim Developer

| Nama | Peran | GitHub |
|------|-------|--------|
| **Muhammad Jundi Al Hafidz** | Project Lead & Full Stack Developer | [nuuvy7](https://github.com/nuuvy7) |
| **Zariel Waleed Hidayat** | UI/UX Designer & Frontend Developer | [zarielwh04-cyber](https://github.com/zarielwh04-cyber) |
| **Fauzunnajah Attamam** | Backend Developer | [chfjuna76-sudo](https://github.com/chfjuna76-sudo) |
| **Sultan Doven Hagi** | Database Developer | [Doveins](https://github.com/Doveins) |
| **Muhammad Salim Umar** | Frontend Developer | [umarrr643](https://github.com/umarrr643) |
| **Wildan Haibatur Rohim** | Assistant UI/UX Designer | - |


Guru pengajar: **Raihan Ibrahim Saputra**

---

## 🎯 Tentang Proyek

### Latar Belakang

Pelajar SMA/sederajat berjualan melalui Facebook, WhatsApp, dan media sosial lain. Katalog berupa foto + caption yang tersebar di story atau grup chat — tidak terstruktur, tanpa pencarian, dan jangkauannya terbatas pada lingkaran pertemanan penjual. Di sisi lain, banyak pelajar/mahasiswa yang punya *skill* (desain, foto, les privat, servis) namun tidak memiliki wadah publikasi yang tepat.

### Solusi yang Ditawarkan

Buyorent menyatukan jual beli barang bekas sekaligus sewa jasa dalam satu platform: katalog terpusat dengan pencarian dan filter, transaksi terlacak dengan status pesanan, serta moderasi admin agar katalog aman dari penipuan dan pelanggaran kode etik kampus.

### Tujuan Proyek

- 🎯 **Tujuan Utama**: Katalog terpusat dan terstruktur untuk barang bekas & jasa mahasiswa
- 📊 **Target Pengguna**: Pelajar SMA hingga mahasiswa dan anak muda
- 💡 **Value Proposition**: Jangkauan pasar lebih luas, pencarian cepat lewat search bar & filter, transaksi lebih aman dan terlacak tanpa payment gateway

---

## ✨ Fitur Unggulan

### Fitur Utama

| Fitur | Deskripsi | Keunggulan |
|-------|-----------|------------|
| *Search & Filter* | Cari nama item, filter kategori (barang/jasa), kondisi, kampus, dan rentang harga | Menemukan kebutuhan kuliah dalam hitungan detik |
| *Pasang Iklan* | Form posting barang/jasa (nama, harga, foto, deskripsi) dengan draft autosave | Listing langsung tayang, draft tidak hilang saat pindah halaman |
| *Detail Produk* | Halaman detail dengan foto, spesifikasi, kondisi, penjual, dan related items | Info lengkap sebelum memutuskan beli atau booking |
| *Keranjang* | Pilih item + titik COD/catatan janji temu, ringkasan subtotal & ongkir | Mendukung COD kampus (gratis) dan ekspedisi reguler |
| *Checkout Transfer Manual* | Form alamat & no. HP tervalidasi, instruksi transfer 3 langkah, upload bukti | Tanpa payment gateway — sesuai alur PRD |
| *Sewa Jasa* | Booking jasa wajib ACC penjual, kontak penjual terbuka setelah disetujui | Melindungi pembeli dari kontak di luar platform |
| *Moderasi Listing* | Admin turunkan/pulihkan listing langsung dari panel | Listing diturunkan hilang dari katalog, pencarian, dan detail (CTA beli dinonaktifkan) |
| *Kelola Pengguna* | Lihat detail, blokir/unblokir, dan hapus akun dari tabel admin | Blokir = tidak bisa login, hapus = permanen (ada konfirmasi) |
| *Kelola Akun* | Edit profil (nama, email, no. HP, kampus) tervalidasi + peran akses | Satu pintu ke panel admin untuk role admin |

### Fitur Tambahan

- *Animasi GSAP* — entrance, stagger, dan hover spring dengan cleanup `gsap.context()`
- *Desain Cyber-Retro Campus* — palet gelap, aksen biru, hijau terbatas untuk elemen penting
- *Responsive + Hamburger* — menu compact saat layar sempit, tanpa overflow di 360–390px
- *Toast Notifikasi* — umpan balik aksi moderasi/kelola akun ala dashboard
- *Gate Role Admin* — halaman admin terbatas untuk role `admin` (demo sebelum auth aktif)
- *Badge Keranjang Live* — jumlah keranjang dari store bersama di semua halaman

---

## 🛠️ Teknologi

### Tech Stack

#### Frontend

```
Framework    : Next.js 14 (App Router)
UI Library   : React 18
Styling      : Tailwind CSS + komponen ala shadcn/ui (cva)
Animation    : GSAP 3
Icons        : Lucide React
State        : useSyncExternalStore + localStorage
```

#### Backend (direncanakan)

```
Service      : Supabase
Auth         : Supabase Auth (email + password, tanpa verifikasi email)
Database     : PostgreSQL (users, items, categories, cart, orders, order_items)
Storage      : Supabase Storage (foto listing)
Status       : Client @supabase/ssr terpasang, belum tersambung
```

#### DevOps & Tools

```
Package Mgmt : npm
Code Linting : ESLint (eslint-config-next)
Type Check   : TypeScript (tsc --noEmit)
```

### Alasan Pemilihan Teknologi

| Teknologi | Alasan Pemilihan |
|-----------|------------------|
| *Next.js App Router* | Server + client component, routing file-based, standar sesuai dokumen arsitektur |
| *Tailwind CSS + cva* | Utility-first, variant tombol/badge rapi tanpa UI library berat |
| *GSAP* | Animasi performa tinggi dengan kontrol timeline & cleanup per halaman |
| *Supabase* | Auth, database, dan storage dalam satu layanan — cocok untuk proyek kuliah |
| *localStorage* | Data sementara antar halaman sebelum Supabase tersambung, tanpa backend |

### Dependencies Utama

```json
{
  "dependencies": {
    "next": "^14.2.23",
    "react": "^18.3.1",
    "gsap": "^3.15.0",
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.49.1",
    "class-variance-authority": "^0.7.1",
    "lucide-react": "^1.49.0"
  }
}
```

---

## 🏗️ Arsitektur Sistem

### System Architecture

```
┌──────────────────────────────────────────────────────┐
│                    BROWSER (UI)                      │
│         Next.js App Router + Tailwind + GSAP         │
│                                                      │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Katalog │ │ Keranjang│ │ Checkout │ │   Admin   │  │
│  │ & Detail│ │  & Cart  │ │  & Order │ │ Moderasi  │  │
│  └────┬────┘ └────┬────┘ └────┬─────┘ └─────┬─────┘  │
│       └───────────┴───────────┴─────────────┘        │
│                       │                              │
│            localStorage (data sementara)             │
└──────────────────────────────────────────────────────┘
                       │  (menyusul)
                       ▼
┌──────────────────────────────────────────────────────┐
│                    SUPABASE                          │
│   Auth • PostgreSQL • Storage • RLS (semua tabel)    │
└──────────────────────────────────────────────────────┘
```

### Database Schema

```
┌────────────┐        ┌────────────┐
│   users    │        │ categories │
├────────────┤        ├────────────┤
│ id (uuid)  │        │ id (serial)│
│ email      │        │ name       │
│ name       │        └─────┬──────┘
│ phone      │              │ 1
│ role       │              │
│ is_blocked │              │ N
│ created_at │              │
└──┬───┬──┬──┘        ┌─────┴──────┐
   │   │  │           │   items    │
   │   │  │ 1         ├────────────┤
   │   │  └──────────>│ seller_id  │
   │   │              │ category_id│
   │   │ 1            │ name       │
   │   │              │ price      │
   │   │              │ image_url  │
   │   │              │ is_approved│
   │   │ N            └──┬──────┬──┘
   │   ┌─────────────────┘      │
   │   │ N              1       │ N
┌──┴───┴───┐        ┌───────────┴┐
│   cart   │        │ order_items │
├──────────┤        ├────────────┤
│ user_id  │        │ order_id   │
│ item_id  │        │ item_id    │
│ quantity │        │ seller_id  │
└──────────┘        │ price      │
                    │ is_service │
┌────────────┐      │ service_   │
│   orders   │      │  approved  │
├────────────┤      └────────────┘
│ buyer_id   │
│ total_price│
│ status     │  pending → processing → completed
│ payment_   │
│  proof     │
│ address    │
│ phone      │
└────────────┘
```

### Folder Structure

```
src/
├── app/
│   ├── page.tsx                 # Katalog utama (search, filter, sort)
│   ├── layout.tsx               # Root layout + font global
│   ├── account/page.tsx         # Kelola akun pengguna
│   ├── admin/
│   │   ├── layout.tsx           # Banner, metrik, tab, gate role admin
│   │   ├── page.tsx             # Dashboard admin
│   │   ├── items/page.tsx       # Moderasi listing
│   │   └── users/page.tsx       # Kelola pengguna
│   ├── cart/page.tsx            # Keranjang
│   ├── checkout/page.tsx        # Pembayaran transfer manual
│   └── items/
│       ├── page.tsx             # Alias katalog
│       ├── [id]/page.tsx        # Detail produk/jasa
│       └── new/page.tsx         # Form pasang iklan
├── components/
│   ├── navbar.tsx               # Navbar + hamburger + badge cart
│   ├── footer.tsx
│   ├── hero-banner.tsx
│   ├── item-card.tsx            # Kartu katalog (CTA beli/booking/cart)
│   ├── filter-sidebar.tsx
│   ├── toast.tsx                # Toast host global
│   └── ui/                      # Button, Badge, Card, Input (cva)
└── lib/
    ├── items.ts                 # Data katalog + status moderasi
    ├── cart.ts                  # Store keranjang + titik COD
    ├── users.ts                 # Akun + data pengguna
    ├── store.ts                 # Event bus antar-halaman
    ├── utils.ts                 # cn()
    └── supabase/                # Client Supabase (siap, belum dipakai)
```

---

## ⚙️ Instalasi & Setup

### Prerequisites

Pastikan Anda telah menginstall:

- *Node.js* ≥ 18.x
- *npm*
- *Git*

### Langkah Instalasi

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/Nuuvy7/Buyorent.git
cd Buyorent
```

#### 2️⃣ Install Dependencies

```bash
npm install
```

#### 3️⃣ Jalankan Development Server

```bash
npm run dev
```

Aplikasi berjalan di: *http://localhost:3000*

> **Catatan**: jangan menjalankan `npm run build` selagi server dev masih hidup — cache build Next.js bisa rusak dan halaman tampil tanpa styling. Matikan dev server terlebih dahulu, baru build.

---

## 🚀 Penggunaan

### Menjalankan Aplikasi

```bash
npm run dev      # Development mode
npm run build    # Production build (dev server harus mati)
npm run start    # Jalankan hasil build
npm run lint     # ESLint
npx tsc --noEmit # Type check
```

### User Guide

#### Pasang Iklan

1. Klik tombol *PASANG IKLAN* di navbar
2. Pilih tipe: Barang Pre-Loved atau Sewa Jasa
3. Isi nama, harga, deskripsi, kategori, unggah foto
4. Klik *PASANG SEKARANG* — listing langsung tayang (draft otomatis tersimpan)

#### Beli atau Booking

1. Dari katalog, klik *BELI* / *BOOKING* pada kartu, atau buka detail item
2. Di halaman detail: *BELI SEKARANG* / *BOOKING JASA* langsung ke pembayaran, *+ KERANJANG* ke keranjang
3. Klik *Tambah ke Keranjang* di kartu katalog juga menuju keranjang

#### Keranjang → Checkout

1. Centang item, pilih titik COD atau Ekspedisi Reguler, isi catatan janji temu
2. Klik *LANJUT KE HALAMAN PEMBAYARAN*
3. Isi alamat & no. HP (tervalidasi), ikuti instruksi transfer 3 langkah
4. Klik *BUAT PESANAN & LANJUT TRANSFER MANUAL*, lalu upload bukti transfer
5. Order tercatat dengan status *Menunggu Pembayaran*

#### Kelola Akun

1. Klik chip profil di navbar (atau baris profil di menu mobile)
2. Perbarui nama, email, no. HP, kampus → *SIMPAN PERUBAHAN*
3. Pindah peran *Pengguna / Admin* pada kartu Akses & Peran

#### Panel Admin

1. Dengan peran *Admin*, klik *Buka Panel Admin* (atau buka `/admin`)
2. *Moderasi Listing* — turunkan/pulihkan listing; katalog ikut berubah real-time
3. *Kelola Pengguna* — lihat detail, blokir/unblokir, hapus akun (ada konfirmasi)

---

## 📌 Status Proyek

**Fase**: Implementasi frontend — katalog, detail, pasang iklan, keranjang, checkout, kelola akun, dan panel admin selesai serta terverifikasi (type-check, lint, uji alur browser).

| Route | Halaman | Status |
|-------|---------|--------|
| `/` dan `/items` | Katalog + search + filter | ✅ Selesai |
| `/items/[id]` | Detail produk/jasa | ✅ Selesai |
| `/items/new` | Form pasang iklan | ✅ Selesai |
| `/cart` | Keranjang | ✅ Selesai |
| `/checkout` | Pembayaran transfer manual | ✅ Selesai |
| `/account` | Kelola akun pengguna | ✅ Selesai |
| `/admin` | Dashboard admin (gate role admin) | ✅ Selesai |
| `/admin/items` | Moderasi listing | ✅ Selesai |
| `/admin/users` | Kelola pengguna | ✅ Selesai |
| `/login`, `/register` | Auth Supabase | ⏳ Menyusul |
| `/orders`, `/seller/orders` | Riwayat pesanan | ⏳ Menyusul |

**Belum dibangun**:

- Supabase auth (login/register, session, cek `role` / `is_blocked` server-side)
- Koneksi database + RLS (data UI kini di `localStorage`)
- Halaman riwayat pesanan (`/orders`, `/seller/orders`)
- Payment gateway — sesuai PRD **tidak dipakai** (transfer manual)
- Deploy

---

## 📚 Dokumentasi

- [BRD.md](BRD.md) — Business Requirements Document
- [PRD.md](PRD.md) — Product Requirements Document
- [SRS.md](SRS.md) — Software Requirements Specification

---

<div align="center">

*Made with ❤️ by Kelompok 6*

</div>
