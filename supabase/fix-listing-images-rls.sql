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

-- CATATAN (belum diubah): policy INSERT masih "authenticated tanpa filter folder",
-- jadi user login bisa menulis ke folder orang lain. Belum diuji dampaknya — follow-up.
