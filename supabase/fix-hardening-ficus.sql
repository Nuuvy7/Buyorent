-- fix-hardening-ficus.sql — perbaikan temuan security audit Ficus 5 Okt 2026
-- A1 (self-unblock blokir) · A2 (takedown items bisa dibatalkan penjual) · A3 (ktm self-grant)
-- A4 (orders: total/address tamper + delete kapan saja) · A5 (order_items price/seller client-trusted)
-- A6 (payment-proofs insert tanpa ownership folder)
-- Idempotent: create or replace function + drop trigger if exists. Jalankan via SQL Editor.

-- ===== A1 + A3: kolom users sensitif hanya admin yang boleh ubah =====
-- role / is_blocked / ktm tidak boleh disentuh pemilik baris; email immutable untuk semua
-- (ubah email dilakukan lewat Supabase Auth dashboard, bukan REST tabel users).
create or replace function public.guard_users_mutation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    return new;
  end if;
  if not public.is_admin() then
    if new.role is distinct from old.role then
      raise exception 'role hanya bisa diubah admin';
    end if;
    if new.is_blocked is distinct from old.is_blocked then
      raise exception 'is_blocked hanya bisa diubah admin';
    end if;
    if new.ktm is distinct from old.ktm then
      raise exception 'ktm hanya bisa diubah admin';
    end if;
  end if;
  if new.email is distinct from old.email or new.id is distinct from old.id then
    raise exception 'email/id tidak bisa diubah';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_guard_users_mutation on public.users;
create trigger trg_guard_users_mutation
  before update on public.users
  for each row
  execute function public.guard_users_mutation();

-- ===== A2: takedown & snapshot listing tidak bisa dibatalkan/dimanipulasi penjual =====
-- is_approved hanya admin; snapshot seller_name/seller_kecamatan/seller_ktm dikunci setelah insert;
-- seller_id immutable. Kolom konten (name/description/price/location/image_url) tetap bebas
-- untuk penjual di listingnya sendiri — itu fitur, bukan celah.
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
  end if;
  return new;
end;
$$;

drop trigger if exists trg_guard_items_mutation on public.items;
create trigger trg_guard_items_mutation
  before update on public.items
  for each row
  execute function public.guard_items_mutation();

-- ===== A4: orders — kolom nilai & identitas dikunci; delete hanya saat pending =====
-- total_price/shipping_fee = snapshot checkout (client-computed, pembayaran manual).
-- address/phone hanya bisa diubah pembeli sebelum status 'processing'.
-- Delete: hanya status 'pending' (kompensasi checkout gagal) — order selesai tak bisa hilang.
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
  -- status: tetap urusan penjual terkait / admin (guard lama digabung di sini)
  if new.status is distinct from old.status
     and not public.is_order_seller(old.id)
     and not public.is_admin() then
    raise exception 'status hanya bisa diubah penjual atau admin';
  end if;
  -- pembeli: payment_proof bebas; address/phone hanya sebelum diproses
  if not public.is_admin() and not public.is_order_seller(old.id) then
    if old.status <> 'pending'
       and (new.address is distinct from old.address
            or new.phone is distinct from old.phone) then
      raise exception 'alamat/HP hanya bisa diubah sebelum order diproses';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_guard_order_status on public.orders;
drop trigger if exists trg_guard_orders_mutation on public.orders;
create trigger trg_guard_orders_mutation
  before update on public.orders
  for each row
  execute function public.guard_orders_mutation();

create or replace function public.guard_orders_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status <> 'pending' and not public.is_admin() then
    raise exception 'hanya order pending yang bisa dihapus';
  end if;
  return old;
end;
$$;

drop trigger if exists trg_guard_orders_delete on public.orders;
create trigger trg_guard_orders_delete
  before delete on public.orders
  for each row
  execute function public.guard_orders_delete();

-- ===== A5: order_items — harga & penjual dipaksa dari tabel items, bukan client =====
-- INSERT: price = items.price, seller_id = items.seller_id (kolom client tidak dipercaya).
-- UPDATE: kolom inti dikunci; penjual tetap boleh ubah note/service_approved (fitur).
create or replace function public.guard_order_items_mutation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_price numeric;
  v_seller uuid;
begin
  select price, seller_id into v_price, v_seller
  from public.items where id = new.item_id;
  if v_price is null then
    raise exception 'item tidak ditemukan';
  end if;
  new.price := v_price;
  new.seller_id := v_seller;
  if tg_op = 'UPDATE' then
    if new.order_id is distinct from old.order_id
       or new.item_id is distinct from old.item_id then
      raise exception 'order/item tidak bisa diganti';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_guard_order_items_insert on public.order_items;
create trigger trg_guard_order_items_insert
  before insert or update on public.order_items
  for each row
  execute function public.guard_order_items_mutation();

-- ===== A6: payment-proofs — tulis hanya ke folder sendiri =====
drop policy if exists "payment-proofs: user upload" on storage.objects;
drop policy if exists "payment-proofs: owner upload" on storage.objects;
create policy "payment-proofs: owner upload" on storage.objects
  for insert with check (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
