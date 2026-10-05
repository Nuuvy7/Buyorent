-- Isolasi storage listing-images (temuan load test 4 Okt 2026, MEDIUM)
-- Bucket public: file tetap bisa dibaca publik lewat /object/public/... (tidak lewat policy).
-- Yang ditutup: ENUMERASI — semua user login bisa list folder siapa saja (nama file + timestamp).

drop policy if exists "listing-images: publik baca" on storage.objects;
drop policy if exists "listing-images: owner baca" on storage.objects;

create policy "listing-images: owner baca" on storage.objects
  for select using (
    bucket_id = 'listing-images'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );

-- INSERT: user hanya boleh tulis ke folder sendiri (dieksekusi 5 Okt 2026).
drop policy if exists "listing-images: user upload" on storage.objects;
create policy "listing-images: owner upload" on storage.objects
  for insert with check (
    bucket_id = 'listing-images'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
-- Terverifikasi: upload ke folder sendiri 200, folder orang lain 403, anon 403.
