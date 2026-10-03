-- RPC: ambil nomor HP penjual dari listing yang aktif (is_approved = true).
-- Dipanggil dari tombol TANYA di /items/[id] (BUG-05 fix, 3 Okt 2026).
-- Tidak butuh login; RLS users dibypass via security definer — hanya mengembalikan
-- phone dari items.seller_id, tidak pernah membuka kolom lain.
-- Batas: hanya listing tayang (is_approved = true) — listing dimoderasi tidak bisa dikontaki.

create or replace function public.public_seller_phone(p_item_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select u.phone
  from public.items i
  join public.users u on u.id = i.seller_id
  where i.id = p_item_id
    and i.is_approved = true;
$$;
