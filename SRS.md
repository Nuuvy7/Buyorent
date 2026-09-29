# Buyorent

## Sistem apa yang akan dibangun

Website/platform **Buyorrent** untuk jual beli barang bekas dan sewa jasa.

## Dengan apa sistem ini akan dibangun

- **Next.js** — framework frontend
- **Supabase** — database, autentikasi, dan storage
- **Tailwind** — styling

## Bagaimana Rancangan alur sistem pada setiap fitur yang akan dibangun

1. **Login dan register** — pengguna mendaftar dan masuk menggunakan email dan password saja (tanpa verifikasi email).
2. **Posting barang atau jasa** — setiap akun dapat memasang listing (nama, harga, foto, deskripsi, kategori) dan langsung tayang.
3. **Search bar dan filter** — pencarian berdasarkan nama item, dipersempit dengan filter kategori (barang/jasa) dan rentang harga.
4. **Keranjang dan checkout** — pembeli memilih item (barang atau jasa, sama persis), memasukkannya ke keranjang, lalu checkout. Keranjang bersifat per user dan dikosongkan setelah checkout.
5. **Pembayaran** — belum ada payment gateway: pembeli melakukan transfer manual kepada penjual, lalu penjual mengonfirmasi/menandai pembayaran lunas.
6. **Riwayat pesanan** — status pesanan: **Menunggu pembayaran → Diproses → Selesai**.
7. **Sewa jasa** — setelah checkout, pesanan jasa harus disetujui penjual terlebih dahulu; kontak penjual (no. HP/WA) baru terbuka untuk pembeli setelah penjual menyetujui.
8. **Admin** — moderasi konten (menyetujui atau menurunkan listing) dan kelola pengguna: melihat, memblokir, dan menghapus akun.

## Bagaimana Alur Datanya

**Tabel yang digunakan:**

- `users` — profil dan role pengguna (pembeli, penjual, admin)
- `items` — listing barang bekas dan jasa
- `categories` — kategori untuk keperluan filter
- `cart` — keranjang per user
- `orders` — pesanan hasil checkout
- `order_items` — rincian item di dalam tiap pesanan

**Relasi:**

- `users` 1-to-many `items` (satu user punya banyak listingan)
- `users` 1-to-many `orders` (satu user punya banyak pesanan)
- `orders` 1-to-many `order_items` (satu pesanan berisi banyak item)
- `items` many-to-one `categories`

**Alur data:**

1. Penjual memasang listing → data tersimpan ke tabel `items` beserta kategorinya di `categories`.
2. Pembeli mencari → sistem membaca `items` dan `categories` sesuai kata kunci serta filter.
3. Pembeli memilih item → data masuk ke `cart` (per user).
4. Checkout → sistem membuat record di `orders` (total harga, tanggal pesanan, status, bukti transfer, kontak penjual untuk jasa) beserta rinciannya di `order_items`, lalu `cart` dikosongkan.
5. Pembeli mengunggah bukti transfer → tersimpan di `orders`, penjual menyetujui → status berubah dari Menunggu pembayaran ke Diproses.
6. Transaksi selesai → status menjadi Selesai.
7. Halaman riwayat pembeli, daftar pesanan masuk penjual, dan kelola pengguna admin semuanya membaca dari tabel `orders` dan `users`.

## Apa yang diharapkan dari input dan output dari sistem ini

**Input dari pengguna:**

- Email dan password (register/login)
- Data listing: nama, harga, foto, deskripsi, kategori
- Kata kunci pencarian dan filter (kategori, rentang harga)
- Data checkout: alamat, no. HP
- Bukti transfer
- Aksi admin: menyetujui/menurunkan listing, memblokir/menghapus akun

**Output dari sistem:**

- Daftar hasil pencarian dan halaman detail item
- Status pesanan pada halaman riwayat (Menunggu pembayaran → Diproses → Selesai)
- Kontak penjual jasa (terbuka setelah penjual menyetujui)
- Daftar pengguna untuk admin
- Daftar pesanan masuk untuk penjual
