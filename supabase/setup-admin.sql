-- ===== Setup admin Buyorent — jalankan 1x di SQL Editor Supabase =====
-- Prasyarat: sudah punya akun aplikasi (daftar via /register dulu bila belum).
-- Setelah ini, role admin asli dari tabel users; tombol demo di aplikasi sudah dihapus.

-- 1) Promosikan akunmu jadi admin — GANTI email di bawah dengan email daftarmu.
--    Pastikan "rows affected" = 1 (email salah → 0 baris, tidak ada efek samping).
update public.users
set role = 'admin'
where email = 'GANTI_DENGAN_EMAIL_KAMU';

-- 2) Izinkan admin menghapus akun permanen (tombol "Hapus" di Kelola Pengguna, PRD §8).
--    (idempoten: policy lama ditimpa kalau skrip dijalankan ulang)
drop policy if exists "users: hapus admin" on public.users;
create policy "users: hapus admin" on public.users
  for delete using (public.is_admin());
