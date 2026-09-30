# Buyorent

## Apa yang dibangun

Website/platform **Buyorent** untuk jual beli barang bekas dan sewa jasa.

## Apa saja yang dibutuhkan untuk membangun

- **Next.js** — framework frontend
- **Supabase** — database, autentikasi, dan storage
- **Tailwind** — styling

## Fitur apa saja yang dibangun

- Login dan register
- Search bar
- Filter barang
- Keranjang
- Posting barang atau jasa
- Halaman admin
- Transaksi dan pembayaran

## Siapa saja yang akan menggunakan sistem ini

- **Pembeli**
- **Penjual**
- **Admin**

Catatan: semua akun dapat berjualan, tanpa role khusus untuk penjual.

## Bagaimana sistem ini akan berjalan pada setiap fitur yang dibangun

1. **Login dan register** — pengguna mendaftar dan masuk menggunakan email dan password saja (tanpa verifikasi email).
2. **Posting barang atau jasa** — setiap akun dapat memasang barang atau jasa melalui form (nama, harga, foto, deskripsi) dan langsung tayang.
3. **Search bar dan filter** — pengguna mencari item berdasarkan nama, lalu mempersempit hasil dengan filter kategori (barang/jasa) dan rentang harga.
4. **Keranjang dan checkout** — pembeli memilih item, memasukkannya ke keranjang, lalu melakukan checkout.
5. **Pembayaran** — belum ada payment gateway: pembeli melakukan **transfer manual** kepada penjual, kemudian penjual mengonfirmasi/menandai pembayaran lunas.
6. **Riwayat pesanan** — pembeli dan penjual dapat memantau pesanan melalui halaman riwayat dengan status: **Menunggu pembayaran → Diproses → Selesai**. Fitur transaksi dan pembayaran ini *akan dibangun pada tahap berikutnya*.
7. **Sewa jasa** — setelah checkout, pesanan jasa harus **disetujui penjual** terlebih dahulu; kontak penjual (no. HP/WA) baru terbuka untuk pembeli setelah penjual menyetujui.
8. **Admin** — moderasi konten (menyetujui atau menurunkan listing) dan kelola pengguna: **melihat, memblokir, dan menghapus akun**.
