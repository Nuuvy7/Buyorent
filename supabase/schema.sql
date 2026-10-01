-- ===== 1. TABEL =====
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null default '',
  phone text,
  campus text,
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
  seller_campus text not null default '',
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

create policy "listing-images: publik baca" on storage.objects
  for select using (bucket_id = 'listing-images');
create policy "listing-images: user upload" on storage.objects
  for insert with check (bucket_id = 'listing-images' and auth.role() = 'authenticated');
create policy "payment-proofs: login baca" on storage.objects
  for select using (bucket_id = 'payment-proofs' and auth.role() = 'authenticated');
create policy "payment-proofs: user upload" on storage.objects
  for insert with check (bucket_id = 'payment-proofs' and auth.role() = 'authenticated');
