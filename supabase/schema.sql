-- ===== 1. TABEL =====
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null default '',
  phone text,
  kecamatan text,
  ktm boolean not null default false,
  role text not null default 'user' check (role in ('user','admin')),
  is_blocked boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.categories (
  id serial primary key,
  name text unique not null
);
insert into public.categories (name) values ('Barang'), ('Jasa');

create table public.items (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.users(id) on delete cascade,
  category_id int not null references public.categories(id),
  sub_category text,
  name text not null,
  description text not null default '',
  price numeric not null check (price >= 0),
  condition text check (condition in ('like-new','used')),
  location text,
  image_url text,
  seller_name text not null default '',
  seller_kecamatan text not null default '',
  seller_ktm boolean not null default false,
  is_approved boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.cart (
  id serial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  cod_spot text,
  note text,
  brief text,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.users(id) on delete cascade,
  total_price numeric not null,
  shipping_fee numeric not null default 0,
  status text not null default 'pending' check (status in ('pending','processing','completed')),
  payment_proof text,
  address text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id bigserial primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  item_id uuid not null references public.items(id),
  seller_id uuid not null references public.users(id),
  quantity int not null default 1,
  price numeric not null,
  is_service boolean not null default false,
  service_approved boolean,
  note text
);

create index on public.items (seller_id);
create index on public.items (category_id);
create index on public.cart (user_id);
create index on public.orders (buyer_id);
create index on public.order_items (order_id);
create index on public.order_items (seller_id);

-- ===== 2. HELPER & TRIGGER =====
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'admin');
$$;

-- register: auth.signUp sukses → baris users terisi otomatis (nama/phone dari metadata)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- kontak penjual jasa: hanya pembeli & hanya setelah service_approved (aturan bisnis 5)
create or replace function public.seller_contact(p_order_item_id bigint)
returns text language sql stable security definer set search_path = public as $$
  select u.phone
  from public.order_items oi
  join public.orders o on o.id = oi.order_id
  join public.users u on u.id = oi.seller_id
  where oi.id = p_order_item_id
    and oi.is_service
    and oi.service_approved = true
    and (o.buyer_id = auth.uid() or public.is_admin());
$$;

-- anti-rekursi RLS: policy orders ↔ order_items saling membaca tabel satunya
-- → "infinite recursion". Pola sama dengan is_admin(): SECURITY DEFINER →
-- dijalankan sebagai owner (postgres) → RLS tidak berlaku di dalam fungsi → rantai berhenti.
create or replace function public.is_order_seller(p_order_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.order_items
    where order_id = p_order_id and seller_id = auth.uid()
  );
$$;

create or replace function public.is_order_buyer(p_order_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.orders
    where id = p_order_id and buyer_id = auth.uid()
  );
$$;

-- ===== 3. RLS =====
alter table public.users       enable row level security;
alter table public.categories  enable row level security;
alter table public.items       enable row level security;
alter table public.cart        enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

create policy "users: baca sendiri atau admin" on public.users
  for select using (auth.uid() = id or public.is_admin());
create policy "users: update sendiri atau admin" on public.users
  for update using (auth.uid() = id or public.is_admin())
  with check (public.is_admin() or (role = 'user' and is_blocked = false));

create policy "categories: publik baca" on public.categories
  for select using (true);

create policy "items: tayang / milik sendiri / admin" on public.items
  for select using (is_approved or seller_id = auth.uid() or public.is_admin());
create policy "items: insert milik sendiri" on public.items
  for insert with check (seller_id = auth.uid());
create policy "items: update penjual atau admin" on public.items
  for update using (seller_id = auth.uid() or public.is_admin());
-- tanpa policy DELETE ini, semua hapus listing lewat API gagal diam-diam (PostgREST balas
-- 204 tanpa baris) — penjual & admin tak pernah bisa menghapus listing sendiri.
create policy "items: hapus penjual atau admin" on public.items
  for delete using (seller_id = auth.uid() or public.is_admin());

create policy "cart: milik sendiri" on public.cart
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "orders: pembeli, admin, atau penjual terkait" on public.orders
  for select using (
    buyer_id = auth.uid() or public.is_admin()
    or public.is_order_seller(public.orders.id)
  );
create policy "orders: pembeli insert" on public.orders
  for insert with check (buyer_id = auth.uid());
-- pembeli (upload bukti), penjual (ubah status), admin boleh update
create policy "orders: update terkait" on public.orders
  for update using (
    buyer_id = auth.uid() or public.is_admin()
    or public.is_order_seller(public.orders.id)
  );
-- kompensasi checkout (D5): kalau insert order_items gagal, pembeli menghapus
-- order kosong yang tadi dibuatnya
create policy "orders: pembeli hapus" on public.orders
  for delete using (buyer_id = auth.uid() or public.is_admin());

-- ===== SECURITY TRIGGERS (audit Ficus 5 Okt 2026: A1–A5) =====
-- RLS tidak bisa membatasi PERUBAHAN KOLOM (USING/WITH CHECK hanya melihat nilai baris),
-- jadi kolom sensitif dikunci di trigger SECURITY DEFINER — pola yang sama dengan
-- guard_order_status lama. Patch terpisah: supabase/fix-hardening-ficus.sql.

-- A1+A3: role/is_blocked/ktm hanya admin; email/id immutable
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
create trigger trg_guard_items_mutation
  before update on public.items
  for each row
  execute function public.guard_items_mutation();

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
create trigger trg_guard_orders_mutation
  before update on public.orders
  for each row
  execute function public.guard_orders_mutation();

-- A4: order completed tidak bisa dihapus (kompensasi checkout = pending saja)
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

-- A5: price & seller_id order_items dipaksa dari items (client tidak dipercaya)
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

create policy "order_items: terkait order" on public.order_items
  for select using (
    public.is_admin() or seller_id = auth.uid()
    or public.is_order_buyer(order_id)
  );
create policy "order_items: pembeli order tsb insert" on public.order_items
  for insert with check (public.is_order_buyer(order_id));
create policy "order_items: penjual update" on public.order_items
  for update using (seller_id = auth.uid() or public.is_admin());

-- ===== 4. STORAGE =====
insert into storage.buckets (id, name, public) values
  ('listing-images', 'listing-images', true),
  ('payment-proofs', 'payment-proofs', false);

-- Public URL /object/public/... tidak lewat policy — file tetap bisa dibaca siapa pun.
-- Policy SELECT hanya mengatur ENUMERASI (list) — dulu terbuka untuk semua login.
drop policy if exists "listing-images: publik baca" on storage.objects;
create policy "listing-images: owner baca" on storage.objects
  for select using (
    bucket_id = 'listing-images'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
create policy "listing-images: owner upload" on storage.objects
  for insert with check (
    bucket_id = 'listing-images'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
create policy "payment-proofs: owner baca" on storage.objects
  for select using (
    bucket_id = 'payment-proofs'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
drop policy if exists "payment-proofs: user upload" on storage.objects;
drop policy if exists "payment-proofs: owner upload" on storage.objects;
-- A6 (audit Ficus): tulis hanya ke folder sendiri — tanpa ini, user login bisa menulis
-- bukti transfer ke folder user lain.
create policy "payment-proofs: owner upload" on storage.objects
  for insert with check (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
