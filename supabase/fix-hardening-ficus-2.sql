-- fix-hardening-ficus-2.sql — re-audit Ficus 6 Okt 2026
-- F1: policy orders DELETE hilang dari live (drift repo↔live) → kompensasi checkout rusak
-- F2: items.created_at bisa ditamper penjual (manipulasi sort katalog)
-- F3: items.category_id bisa diubah barang↔jasa pasca-tayang
-- R1: penjual kebal cek pending pada address/phone (pengiriman = milik pembeli)
-- Isi fungsi = potongan final dari schema.sql (anti-drift).

-- A2: is_approved hanya admin; snapshot seller_* terkunci; seller_id immutable
create or replace function public.guard_items_mutation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    return new;
  end if;
  if new.seller_id is distinct from old.seller_id then
    raise exception 'seller_id tidak bisa diubah';
  end if;
  if not public.is_admin() then
    if new.is_approved is distinct from old.is_approved then
      raise exception 'is_approved hanya bisa diubah admin';
    end if;
    if new.seller_name is distinct from old.seller_name
       or new.seller_kecamatan is distinct from old.seller_kecamatan
       or new.seller_ktm is distinct from old.seller_ktm then
      raise exception 'snapshot penjual tidak bisa diubah penjual';
    end if;
    -- F2 (re-audit): created_at mengendalikan sort katalog — kunci
    if new.created_at is distinct from old.created_at then
      raise exception 'created_at tidak bisa diubah';
    end if;
    -- F3 (re-audit): kategori menentukan barang/jasa & alur approval — kunci
    if new.category_id is distinct from old.category_id
       or new.sub_category is distinct from old.sub_category then
      raise exception 'kategori tidak bisa diubah setelah tayang';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_guard_items_mutation on public.items;

-- A4: total/shipping/buyer/waktu immutable; status = penjual terkait/admin;
-- address/phone pembeli hanya sebelum diproses
create or replace function public.guard_orders_mutation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.total_price is distinct from old.total_price
     or new.shipping_fee is distinct from old.shipping_fee
     or new.buyer_id is distinct from old.buyer_id
     or new.created_at is distinct from old.created_at then
    raise exception 'nilai total/buyer/waktu order tidak bisa diubah';
  end if;
  if new.status is distinct from old.status
     and not public.is_order_seller(old.id)
     and not public.is_admin() then
    raise exception 'status hanya bisa diubah penjual atau admin';
  end if;
  -- R1 (re-audit): pengiriman = milik pembeli — penjual juga tidak boleh ubah;
  -- pembeli hanya sebelum diproses; admin bebas.
  if not public.is_admin() and old.buyer_id <> auth.uid() then
    if new.address is distinct from old.address
       or new.phone is distinct from old.phone then
      raise exception 'alamat/HP hanya bisa diubah pembeli sebelum diproses';
    end if;
  end if;
  if not public.is_admin() and old.buyer_id = auth.uid() and old.status <> 'pending' then
    if new.address is distinct from old.address
       or new.phone is distinct from old.phone then
      raise exception 'alamat/HP hanya bisa diubah sebelum order diproses';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_guard_orders_mutation on public.orders;

drop policy if exists "orders: pembeli hapus" on public.orders;
create policy "orders: pembeli hapus" on public.orders
  for delete using (buyer_id = auth.uid() or public.is_admin());

-- create trigger yang terpotong di batch sebelumnya (awk range salah)
drop trigger if exists trg_guard_items_mutation on public.items;
create trigger trg_guard_items_mutation
  before update on public.items
  for each row
  execute function public.guard_items_mutation();

drop trigger if exists trg_guard_orders_mutation on public.orders;
create trigger trg_guard_orders_mutation
  before update on public.orders
  for each row
  execute function public.guard_orders_mutation();
