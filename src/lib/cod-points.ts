// Data titik COD DKI Jakarta — sumber: COD_POINTS.md (riset Lythrum, 3 Okt 2026).
// 5 kota administrasi × 42 kecamatan × 3 titik. Kepulauan Seribu dikecualikan.
// Jangan hardcode jumlah titik/transit di luar file ini (lihat COD_POINTS.md §5).

export interface KecamatanCOD {
  nama: string;
  kota: string;
  titik: string[];
}

/** Sentinel pilihan manual — muncul terakhir di setiap dropdown titik. */
export const COD_LAINNYA = "Lainnya (pilih lokasi manual)";

/** Disclaimer wajib saat user memilih titik di luar daftar (COD_POINTS.md §4). */
export const COD_LAINNYA_WARNING =
  "Titik di luar daftar tidak diverifikasi. Pilih lokasi umum ramai dengan orang lain di sekitar, jangan bawa barang berharga berlebih, dan pilih jam ramai (07.00–21.00 WIB).";

export const KOTA_ADMINISTRASI = [
  "Jakarta Selatan",
  "Jakarta Pusat",
  "Jakarta Utara",
  "Jakarta Barat",
  "Jakarta Timur",
] as const;

export const KECAMATAN_COD: KecamatanCOD[] = [
  { nama: "Mampang Prapatan", kota: "Jakarta Selatan", titik: ["Lippo Mall Kemang (Lobby)", "Halte TJ Mampang Prapatan", "SPBU Shell Tendean"] },
  { nama: "Pancoran", kota: "Jakarta Selatan", titik: ["Kalibata City Square (Lobby)", "Stasiun Duren Kalibata (Pintu Timur)", "Patung Pancoran (Area Terang/Polisi)"] },
  { nama: "Cilandak", kota: "Jakarta Selatan", titik: ["Cilandak Town Square (Citos)", "Stasiun MRT Fatmawati", "One Belpark Mall"] },
  { nama: "Jagakarsa", kota: "Jakarta Selatan", titik: ["AEON Mall Tanjung Barat", "Stasiun Lenteng Agung", "SPBU Pertamina 31.126.01"] },
  { nama: "Kebayoran Baru", kota: "Jakarta Selatan", titik: ["Blok M Plaza (Lobby/MRT)", "Senayan City", "Pacific Place"] },
  { nama: "Kebayoran Lama", kota: "Jakarta Selatan", titik: ["Pondok Indah Mall (PIM)", "Gandaria City", "Stasiun Kebayoran"] },
  { nama: "Pasar Minggu", kota: "Jakarta Selatan", titik: ["The Park Pejaten", "Stasiun Pasar Minggu", "Terminal Pasar Minggu"] },
  { nama: "Pesanggrahan", kota: "Jakarta Selatan", titik: ["Bintaro Jaya Xchange (Lobby)", "SPBU Pertamina 34.122.04 (Veteran)", "Universitas Tanri Abeng"] },
  { nama: "Setiabudi", kota: "Jakarta Selatan", titik: ["Lotte Shopping Avenue", "Kuningan City", "Plaza Festival"] },
  { nama: "Tebet", kota: "Jakarta Selatan", titik: ["Kota Kasablanka (Kokas)", "Tebet Eco Park (Main Gate)", "Stasiun Tebet"] },
  { nama: "Tanah Abang", kota: "Jakarta Pusat", titik: ["Grand Indonesia (Lobby)", "Stasiun Tanah Abang", "Citywalk Sudirman"] },
  { nama: "Menteng", kota: "Jakarta Pusat", titik: ["Stasiun Gondangdia", "Taman Menteng", "Plaza Menteng"] },
  { nama: "Senen", kota: "Jakarta Pusat", titik: ["Plaza Atrium Senen", "Stasiun Senen (Hall Depan)", "Terminal Senen"] },
  { nama: "Johar Baru", kota: "Jakarta Pusat", titik: ["Pasar Johar Baru", "SPBU Galur (Suprapto)", "Halte TJ Galur"] },
  { nama: "Cempaka Putih", kota: "Jakarta Pusat", titik: ["Green Pramuka Square", "Transmart Cempaka Putih", "Holland Bakery Cempaka Putih"] },
  { nama: "Kemayoran", kota: "Jakarta Pusat", titik: ["MGK Kemayoran", "JIExpo (Pintu Utama)", "Stasiun Kemayoran"] },
  { nama: "Sawah Besar", kota: "Jakarta Pusat", titik: ["Gerbang Utama Pasar Baru", "Stasiun Juanda", "Harco Mangga Dua"] },
  { nama: "Gambir", kota: "Jakarta Pusat", titik: ["Stasiun Gambir (Hall/Parkir)", "Monas (Parkir IRTI)", "Gajah Mada Plaza"] },
  { nama: "Kelapa Gading", kota: "Jakarta Utara", titik: ["Mall Kelapa Gading (MKG)", "Stasiun LRT Boulevard Utara", "Mal Artha Gading"] },
  { nama: "Penjaringan", kota: "Jakarta Utara", titik: ["Emporium Pluit Mall", "Pluit Village", "PIK Avenue"] },
  { nama: "Tanjung Priok", kota: "Jakarta Utara", titik: ["Terminal Tanjung Priok", "Sunter Mall", "Jakarta International Stadium (JIS)"] },
  { nama: "Cilincing", kota: "Jakarta Utara", titik: ["Pasar Cilincing", "Rusun Marunda (Security Post)", "SPBU Pertamina 34.141.01"] },
  { nama: "Koja", kota: "Jakarta Utara", titik: ["Mall Koja Trade Center", "Islamic Centre Jakarta", "Stasiun Tanjung Priok (Sisi Timur)"] },
  { nama: "Pademangan", kota: "Jakarta Utara", titik: ["Gerbang Utama Ancol", "Stasiun Ancol", "WTC Mangga Dua"] },
  { nama: "Cengkareng", kota: "Jakarta Barat", titik: ["Mall Taman Palem", "RSUD Cengkareng", "Halte TJ Rawa Buaya"] },
  { nama: "Grogol Petamburan", kota: "Jakarta Barat", titik: ["Mall Ciputra (Citraland)", "Stasiun Grogol", "Terminal Grogol"] },
  { nama: "Kalideres", kota: "Jakarta Barat", titik: ["Terminal Kalideres", "Hari Hari Swalayan Kalideres", "SPBU Daan Mogot KM 17"] },
  { nama: "Kebon Jeruk", kota: "Jakarta Barat", titik: ["Halte TJ Kebon Jeruk", "McDonald's Kebon Jeruk (24 jam)", "MNC Studios"] },
  { nama: "Kembangan", kota: "Jakarta Barat", titik: ["Lippo Mall Puri", "Kantor Walikota Jakarta Barat", "Pasar Puri Indah"] },
  { nama: "Palmerah", kota: "Jakarta Barat", titik: ["Stasiun Palmerah", "Plaza Slipi Jaya", "Universitas Binus (Kampus Anggrek)"] },
  { nama: "Taman Sari", kota: "Jakarta Barat", titik: ["Stasiun Jakarta Kota", "Glodok Plaza", "Museum Fatahillah (Kota Tua)"] },
  { nama: "Tambora", kota: "Jakarta Barat", titik: ["Seasons City Mall", "Stasiun Angke", "Pasar Pagi Tambora"] },
  { nama: "Cakung", kota: "Jakarta Timur", titik: ["Stasiun Cakung", "Terminal Pulogebang", "ITC Cakung"] },
  { nama: "Duren Sawit", kota: "Jakarta Timur", titik: ["Mall Cipinang Indah", "Halte TJ Kalimalang", "Pegadaian Pondok Kelapa Raya"] },
  { nama: "Jatinegara", kota: "Jakarta Timur", titik: ["Stasiun Jatinegara", "Pasar Mester", "Terminal Kampung Melayu"] },
  { nama: "Kramat Jati", kota: "Jakarta Timur", titik: ["PGC Cililitan", "Pasar Induk Kramat Jati", "Halte TJ Kramat Jati"] },
  { nama: "Makasar", kota: "Jakarta Timur", titik: ["Terminal Pinang Ranti", "Stasiun LRT Taman Mini", "Bandara Halim Perdanakusuma"] },
  { nama: "Matraman", kota: "Jakarta Timur", titik: ["Stasiun Matraman", "Halte TJ Matraman 1/2", "Pasar Genjing"] },
  { nama: "Pasar Rebo", kota: "Jakarta Timur", titik: ["Halte Flyover Raya Bogor", "Terminal Pasar Rebo", "RSUD Pasar Rebo"] },
  { nama: "Pulo Gadung", kota: "Jakarta Timur", titik: ["Terminal Pulo Gadung", "Arion Mall", "GOR Rawamangun"] },
  { nama: "Ciracas", kota: "Jakarta Timur", titik: ["Terminal Kampung Rambutan", "Stasiun LRT Ciracas", "Stasiun LRT Kampung Rambutan"] },
  { nama: "Cipayung", kota: "Jakarta Timur", titik: ["Gerbang Utama TMII", "RSUD Cipayung", "Pasar Cipayung"] },
];
