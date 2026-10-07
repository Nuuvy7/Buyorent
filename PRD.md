# Product Requirement Document (PRD)
# Buyorent

**Versi**: 1.0  
**Tanggal**: 6 Oktober 2026  
**Status**: Draft

---

## 1. Ringkasan Eksekutif

Buyorent adalah platform berbasis web untuk jual beli barang bekas dan sewa jasa yang dirancang khusus untuk pelajar dan anak muda. Platform ini menyediakan katalog terpusat, sistem pencarian terstruktur, dan mekanisme transaksi yang lebih terorganisir dibandingkan metode perdagangan informal melalui media sosial.

---

## 2. Tujuan Produk

### 2.1 Tujuan Bisnis
- Menyediakan wadah publikasi yang terstruktur bagi penjual barang bekas dan penyedia jasa
- Memperluas jangkauan pasar melampaui lingkaran pertemanan penjual
- Meningkatkan efisiensi pencarian dan transaksi bagi pembeli

### 2.2 Tujuan Pengguna
- **Penjual**: memiliki katalog terpusat yang mudah dikelola dan diakses
- **Pembeli**: menghemat waktu dengan fitur pencarian dan filter yang efektif
- **Platform**: menciptakan ekosistem transaksi yang lebih aman dan terlacak

---

## 3. Ruang Lingkup Produk

### 3.1 Deskripsi Produk
Buyorent adalah website/platform yang memfasilitasi:
- Jual beli barang bekas
- Sewa jasa (desain, fotografi, les privat, servis, dan lainnya)

### 3.2 Stack Teknologi
- **Frontend Framework**: Next.js
- **Backend & Database**: Supabase (database, autentikasi, storage)
- **Styling**: Tailwind CSS

---

## 4. Pengguna Target

### 4.1 Segmen Pengguna

| Peran | Deskripsi | Hak Akses |
|-------|-----------|-----------|
| **Pembeli** | Pengguna yang mencari dan membeli barang atau menyewa jasa | Akses penuh ke katalog, keranjang, checkout, riwayat pesanan |
| **Penjual** | Pengguna yang memasang listing barang atau jasa | Semua fitur pembeli + posting listing + kelola pesanan masuk |
| **Admin** | Pengelola platform | Moderasi konten, kelola pengguna |

**Catatan**: Semua akun terdaftar dapat berjualan tanpa memerlukan role khusus sebagai penjual.

---

## 5. Fitur dan Persyaratan Fungsional

### 5.1 Autentikasi Pengguna

#### 5.1.1 Register
- Pengguna mendaftar menggunakan email dan password
- Tidak ada verifikasi email (simplified flow)
- Akun langsung aktif setelah registrasi

#### 5.1.2 Login
- Pengguna masuk dengan email dan password yang telah didaftarkan
- Session management melalui Supabase Auth

### 5.2 Manajemen Listing

#### 5.2.1 Posting Barang atau Jasa
- Setiap akun dapat memasang listing melalui form dengan field:
  - Nama item
  - Harga
  - Foto (upload ke Supabase Storage)
  - Deskripsi
  - Kategori (barang/jasa)
- Listing langsung tayang setelah submit (tanpa approval otomatis)

### 5.3 Pencarian dan Filter

#### 5.3.1 Search Bar
- Pencarian berdasarkan nama item
- Real-time search atau submit-based search

#### 5.3.2 Filter Barang
- Filter berdasarkan kategori (barang bekas / jasa)
- Filter berdasarkan rentang harga (min-max)
- Filter dapat dikombinasikan dengan search bar

### 5.4 Keranjang Belanja

#### 5.4.1 Keranjang
- Pembeli dapat menambahkan item (barang atau jasa) ke keranjang
- Keranjang bersifat per-user (persistent)
- Item di keranjang dapat dihapus sebelum checkout

#### 5.4.2 Checkout
- Pembeli melakukan checkout untuk semua item di keranjang
- Setelah checkout, keranjang dikosongkan
- Data yang dikumpulkan saat checkout:
  - Alamat pengiriman/layanan
  - Nomor telepon/WhatsApp

### 5.5 Transaksi dan Pembayaran

**Status**: Fitur ini akan dibangun pada tahap berikutnya.

#### 5.5.1 Pembayaran Manual
- Belum ada integrasi payment gateway
- Pembeli melakukan transfer manual ke rekening penjual
- Pembeli mengunggah bukti transfer ke sistem
- Penjual mengonfirmasi/menandai pembayaran sebagai lunas

#### 5.5.2 Status Pesanan
Alur status pesanan:
1. **Menunggu Pembayaran** — setelah checkout, sebelum pembeli upload bukti transfer
2. **Diproses** — setelah penjual konfirmasi pembayaran
3. **Selesai** — transaksi selesai

#### 5.5.3 Riwayat Pesanan
- Pembeli dapat melihat daftar pesanan dengan status masing-masing
- Penjual dapat melihat pesanan masuk yang perlu diproses

### 5.6 Sewa Jasa (Khusus)

#### 5.6.1 Approval Penjual
- Setelah checkout pesanan jasa, penjual harus menyetujui pesanan terlebih dahulu
- Kontak penjual (nomor HP/WhatsApp) hanya terbuka untuk pembeli setelah penjual menyetujui pesanan
- Alur ini mencegah spam dan memastikan penjual siap menerima pesanan

### 5.7 Panel Admin

#### 5.7.1 Moderasi Konten
- Admin dapat melihat semua listing
- Admin dapat menyetujui atau menurunkan listing yang melanggar kebijakan
- Admin memiliki kontrol penuh atas visibilitas listing

#### 5.7.2 Kelola Pengguna
- Admin dapat melihat daftar semua pengguna
- Admin dapat memblokir akun (menonaktifkan sementara)
- Admin dapat menghapus akun secara permanen

---

## 6. Persyaratan Non-Fungsional

### 6.1 Keamanan
- Password di-hash menggunakan mekanisme Supabase Auth
- Session management aman dengan token-based authentication
- File upload dibatasi ukuran dan tipe (image only untuk foto listing)

### 6.2 Performa
- Halaman katalog harus dapat memuat minimal 50 item tanpa lag
- Search dan filter harus memberikan hasil dalam < 2 detik

### 6.3 Usability
- Interface responsif untuk desktop dan mobile
- Navigasi intuitif untuk target pengguna (pelajar/anak muda)

---

## 7. Batasan dan Asumsi

### 7.1 Batasan
- Tidak ada verifikasi email pada tahap ini
- Tidak ada payment gateway terintegrasi (transfer manual)
- Tidak ada sistem rating/review (belum termasuk scope)
- Tidak ada live chat antara pembeli dan penjual

### 7.2 Asumsi
- Pengguna memiliki akses ke rekening bank untuk transfer manual
- Pengguna memiliki nomor WhatsApp atau telepon untuk koordinasi
- Admin melakukan moderasi secara manual (tidak ada auto-moderation)

---

## 8. Kriteria Sukses

### 8.1 Metrik Produk
- Platform dapat diakses dan digunakan oleh minimal 10 pengguna aktif dalam fase pilot
- Minimal 20 listing (barang + jasa) terpublikasi dalam minggu pertama setelah launch
- Minimal 5 transaksi berhasil diselesaikan dalam bulan pertama

### 8.2 Metrik Teknis
- Zero critical bugs pada fase production
- Uptime > 95% setelah deployment
- Load time halaman utama < 3 detik

---

## 9. Roadmap dan Tahapan

### 9.1 Tahap 1 (MVP — Current Scope)
- Autentikasi pengguna
- Posting listing
- Search dan filter
- Keranjang dan checkout
- Panel admin dasar

### 9.2 Tahap Berikutnya (Post-MVP)
- Integrasi payment gateway
- Sistem rating dan review
- Notifikasi real-time (email/push notification)
- Live chat antara pembeli dan penjual
- Analytics dashboard untuk penjual

---

## 10. Kontak dan Persetujuan

**Dokumen ini disusun oleh**: Tim Buyorent  

**Disetujui oleh:**

| Nama | Peran | Tanggal |
|------|-------|---------|
| Muhamad Jundi Al Hafidz | Project Lead & Full Stack Developer | 29 September 2026 |
| Zariel Waleed Hidayat | UI/UX Designer & Frontend Developer | 29 September 2026 |
| Fauzunnajah Attamam | Backend Developer | 29 September 2026 |
| Sultan Doven Hagi | Database Developer | 29 September 2026 |
| Muhammad Salim Umar | Developer OPS | 29 September 2026 |
| Wildan Haibatur Rohim | Assistant UI/UX Designer | 29 September 2026 |

**Untuk persetujuan dan pertanyaan**, hubungi project lead atau product owner.

---

*Dokumen ini merupakan referensi utama untuk pengembangan produk Buyorent dan dapat direvisi sesuai kebutuhan selama proses development.*
