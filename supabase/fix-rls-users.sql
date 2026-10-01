-- PATCH keamanan (Tahap C): cegah user menaikkan role / memblokir diri sendiri.
-- Policy update lama hanya memakai USING (siapa) tanpa WITH CHECK (apa yang berubah) →
-- user biasa bisa `update users set role='admin' where id = <dirinya>` → eskalasi hak akses.
-- Jalankan sekali di SQL Editor.

drop policy if exists "users: update sendiri atau admin" on public.users;
create policy "users: update sendiri atau admin" on public.users
  for update
  using (auth.uid() = id or public.is_admin())
  with check (
    public.is_admin()
    or (role = 'user' and is_blocked = false)
  );
-- Penjelasan WITH CHECK: baris HASIL update untuk non-admin wajib tetap
-- role='user' dan is_blocked=false → edit profil (nama/HP/kampus) tetap boleh,
-- promosi ke admin / self-block tertolak. Admin bebas mengubah apa pun.
