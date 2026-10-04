# Buyorent — Daftar Titik COD Aman DKI Jakarta (Blok 1)

Sumber: riset Lythrum (2026-10-03), handoff via Iris ke Ficus untuk implementasi.
Status: draft siap implementasi — `safety_score` masih scoring statis, bukan klaim "aman" final.
Catatan seed: `safety_score` **derived dari jenis titik per kriteria ANGPA** (kelas 3 = grid petugas/CCTV permanen: stasiun/mal/bandara/RS; kelas 2 = ramai+terang, pengawasan situasional). Titik `[unver]` tidak masuk seed sampai verifikasi ulang.

## 1. Daftar titik per wilayah & kecamatan

Cakupan: 42 kecamatan di 5 kota administrasi (Kepulauan Seribu dikecualikan — di luar "wilayah kota").
~126 titik, 3 per kecamatan.

### Jakarta Selatan (10 kecamatan)
- **Mampang Prapatan**: Lippo Mall Kemang (Lobby), Halte TJ Mampang Prapatan, SPBU Shell Tendean.
- **Pancoran**: Kalibata City Square (Lobby), Stasiun Duren Kalibata (Pintu Timur), Patung Pancoran (Area Terang/Polisi).
- **Cilandak**: Cilandak Town Square (Citos), Stasiun MRT Fatmawati, One Belpark Mall.
- **Jagakarsa**: AEON Mall Tanjung Barat, Stasiun Lenteng Agung, SPBU Pertamina 31.126.01.
- **Kebayoran Baru**: Blok M Plaza (Lobby/MRT), Senayan City, Pacific Place.
- **Kebayoran Lama**: Pondok Indah Mall (PIM), Gandaria City, Stasiun Kebayoran.
- **Pasar Minggu**: The Park Pejaten, Stasiun Pasar Minggu, Terminal Pasar Minggu.
- **Pesanggrahan**: Bintaro Jaya Xchange (Lobby), SPBU Pertamina 34.122.04 (Veteran), Universitas Tanri Abeng.
- **Setiabudi**: Lotte Shopping Avenue, Kuningan City, Plaza Festival.
- **Tebet**: Kota Kasablanka (Kokas), Tebet Eco Park (Main Gate), Stasiun Tebet.

### Jakarta Pusat (8 kecamatan)
- **Tanah Abang**: Grand Indonesia (Lobby), Stasiun Tanah Abang, Citywalk Sudirman.
- **Menteng**: Stasiun Gondangdia, Taman Menteng, Plaza Menteng.
- **Senen**: Plaza Atrium Senen, Stasiun Senen (Hall Depan), Terminal Senen.
- **Johar Baru**: Pasar Johar Baru, SPBU Galur (Suprapto), Halte TJ Galur.
- **Cempaka Putih**: Green Pramuka Square, Transmart Cempaka Putih, Holland Bakery Cempaka Putih.
- **Kemayoran**: MGK Kemayoran, JIExpo (Pintu Utama), Stasiun Kemayoran.
- **Sawah Besar**: Gerbang Utama Pasar Baru, Stasiun Juanda, Harco Mangga Dua.
- **Gambir**: Stasiun Gambir (Hall/Parkir), Monas (Parkir IRTI), Gajah Mada Plaza.

### Jakarta Utara (6 kecamatan)
- **Kelapa Gading**: Mall Kelapa Gading (MKG), Stasiun LRT Boulevard Utara, Mal Artha Gading.
- **Penjaringan**: Emporium Pluit Mall, Pluit Village, PIK Avenue.
- **Tanjung Priok**: Terminal Tanjung Priok, Sunter Mall, Jakarta International Stadium (JIS).
- **Cilincing**: Pasar Cilincing, Rusun Marunda (Security Post), SPBU Pertamina 34.141.01.
- **Koja**: Mall Koja Trade Center, Islamic Centre Jakarta, Stasiun Tanjung Priok (Sisi Timur).
- **Pademangan**: Gerbang Utama Ancol, Stasiun Ancol, WTC Mangga Dua.

### Jakarta Barat (8 kecamatan)
- **Cengkareng**: Mall Taman Palem, RSUD Cengkareng, Halte TJ Rawa Buaya.
- **Grogol Petamburan**: Mall Ciputra (Citraland), Stasiun Grogol, Terminal Grogol.
- **Kalideres**: Terminal Kalideres, Hari Hari Swalayan Kalideres, SPBU Daan Mogot KM 17.
- **Kebon Jeruk**: Halte TJ Kebon Jeruk, McDonald's Kebon Jeruk (24 jam), MNC Studios.
- **Kembangan**: Lippo Mall Puri, Kantor Walikota Jakarta Barat, Pasar Puri Indah.
- **Palmerah**: Stasiun Palmerah, Plaza Slipi Jaya, Universitas Binus (Kampus Anggrek).
- **Taman Sari**: Stasiun Jakarta Kota, Glodok Plaza, Museum Fatahillah (Kota Tua).
- **Tambora**: Seasons City Mall, Stasiun Angke, Pasar Pagi Tambora.

### Jakarta Timur (10 kecamatan)
- **Cakung**: Stasiun Cakung, Terminal Pulogebang, ITC Cakung.
- **Duren Sawit**: Mall Cipinang Indah, Halte TJ Kalimalang, Pegadaian Pondok Kelapa Raya.
- **Jatinegara**: Stasiun Jatinegara, Pasar Mester, Terminal Kampung Melayu.
- **Kramat Jati**: Pasar Induk Kramat Jati, Halte TJ Kramat Jati. (PGC Cililitan ditarik sementara — verifikasi online gagal saat riset `[unver]`; masukkan lagi setelah verifikasi ulang.)
- **Makasar**: Terminal Pinang Ranti, Stasiun LRT Taman Mini, Bandara Halim Perdanakusuma.
- **Matraman**: Stasiun Matraman, Halte TJ Matraman 1/2, Pasar Genjing.
- **Pasar Rebo**: Halte Flyover Raya Bogor, Terminal Pasar Rebo, RSUD Pasar Rebo.
- **Pulo Gadung**: Terminal Pulo Gadung, Arion Mall, GOR Rawamangun.
- **Ciracas**: Terminal Kampung Rambutan, Stasiun LRT Ciracas, Stasiun LRT Kampung Rambutan.
- **Cipayung**: Gerbang Utama TMII, RSUD Cipayung, Pasar Cipayung.

## 2. Kriteria seleksi — checklist ANGPA

4 syarat, semua wajib lolos:

1. **Area Niaga/Publik** — fasilitas umum/komersial: mal, stasiun, halte, SPBU, RS, kantor instansi, pasar. Ruang privat (warung, kos, rumah) → gagal.
2. **Grid transportasi** — terhubung jaringan KRL/MRT/LRT/TransJakarta/SPBU. Gang tanpa jaringan → gagal.
3. **Ramai** — arus orang stabil 07.00–21.00 WIB, bukan cuma jam tertentu. Titik yang sepi setelah jam 10 malam → gagal untuk malam hari.
4. **Terang + ada witness** — penerangan, CCTV, petugas/kasir sebagai eyewitness. Bonus nilai `safety_score`, bukan syarat lolos sendiri.

Penalty (bukan auto-gagal, wajib di-remark):
- Kafe/rumah makan independen tanpa CCTV/eyewitness — boleh masuk kandidat, tulis "no CCTV/eyewitness".
- Bengkel motor/mobil, gudang, parkir basement sepi → out.
- Kantor kosong di luar jam kerja → out untuk weekday malam.
- Contoh out penting: Menteng/Tanah Abang sepi setelah 21.00 hari kerja → titik non-24jam pakai transaction window 07.00–21.00 WIB.

## 3. Skema data untuk filter + label listing

```
wilayah   (kota_administrasi, 5 values)      ← filter level 1
kecamatan (42 values, fixed seed Kemendagri)  ← filter level 2
titik {
  id, nama, jenis, wilayah_id, kecamatan_id,
  landmark      // penanda singkat, WAJIB nullable-safe
  anchor_type   // station|bus_stop|mall|fuel|atm|market|public_office
  network       // "KAI","MRT","LRT","TransJakarta","Pertamina","BCA"... nullable
  open_24h      // bool
  safety_score  // 0-3, hanya scoring, bukan hardcode teks "aman"
  active        // FALSE sampai vendor safe_point_claim terverifikasi
}
```

- `landmark` bukan `{street, number}` — orang COD butuh "dekat MRT", bukan "Plaza Senayan Lt. 3 Unit 21" (itu privacy-mapping).
- Filter UI: `kota_administrasi → kecamatan → titik`, sort default "paling aman & paling dekat".
- Label listing: `📍 Plaza Senayan — Senayan, Kebayoran Baru (Mal, terang & ramai, 08.00–22.00)`.

## 4. Opsi "Lainnya" (di luar daftar)

- Muncul paling bawah di filter lokasi per kecamatan: "Lainnya (Pilih lokasi manual)" → toggle "Di luar daftar titik aman", field bebas + input koordinat/pin opsional.
- Auto-warning: "Titik di luar daftar tidak diverifikasi tim kami. Lokasi umum dengan orang lain di sekitar, jangan bawa barang berharga berlebih, pilih jam ramai."
- Transaksi `Lainnya` wajib foto/pin konfirmasi dari **kedua** pihak sebelum konfirmasi order, plus insurance flag `unverified_point` (rate lebih tinggi).
- Jangan disembunyikan — user tetap butuh COD di lokasi yang tidak terdaftar. Dibedakan lewat **tanggung jawab**, bukan larangan.

## 5. Catatan verifikasi & jangan di-hardcode

- **Jangan hardcode jumlah halte TransJakarta** — sumber berselisih: 252 (Wikipedia, koridor utama) vs 269 (jakarta.go.id) vs 7.790 "bus stop" (termasuk mikrotrans, PT Transjakarta 2025). Pakai nama halte spesifik per koridor. Angka total butuh konfirmasi PT Transjakarta.
- Kepulauan Seribu dikecualikan (kabupaten administrasi, bukan kota) — kalau nanti masuk, tambah 2 kecamatan sebagai wilayah ke-6.
- `safety_score` statis dulu; rating/ulasan user di-skip (butuh moderation + cold start), diganti hybrid kalau data sudah cukup.
- GPS auto-detect proximity: YAGNI untuk Blok 1, filter manual per kecamatan. Menyusul setelah ada data titik riil.
- 267 kelurahan bukan filter — kelurahan = filter level 3 kalau perlu nanti.
- Catatan verifikasi per titik individual belum ada dari riset ini — yang meng-cover adalah `active=false` default + `safety_score` + remark penalty.
