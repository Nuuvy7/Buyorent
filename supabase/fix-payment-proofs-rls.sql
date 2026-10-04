-- IDOR bucket payment-proofs (audit 3 Okt 2026 — KRITIS)
-- Sebelumnya semua user login bisa baca/mengunggah ke seluruh bucket.
-- Sesudah: hanya folder milik sendiri (foldername pertama = user id) + admin.
-- Jalankan di Supabase SQL Editor (tidak ada perubahan kode aplikasi).

drop policy if exists "payment-proofs: login baca" on storage.objects;
drop policy if exists "payment-proofs: user upload" on storage.objects;

create policy "payment-proofs: owner baca" on storage.objects
  for select using (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name)[1] = auth.uid()::text or public.is_admin())
  );

create policy "payment-proofs: owner upload" on storage.objects
  for insert with check (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name)[1] = auth.uid()::text or public.is_admin())
  );
