-- PATCH: memutus rekursi RLS policy orders <-> order_items
-- Gejala saat query: infinite recursion detected in policy for relation "orders"
-- Jalankan sekali di SQL Editor, lalu `node --env-file=.env.local scripts/check-db.mjs`

-- 1. Fungsi SECURITY DEFINER (mirror pola is_admin) — RLS tidak berlaku di dalamnya
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

-- 2. Ganti 4 policy agar memakai fungsi di atas (tanpa subquery lintas tabel langsung)
drop policy if exists "orders: pembeli, admin, atau penjual terkait" on public.orders;
create policy "orders: pembeli, admin, atau penjual terkait" on public.orders
  for select using (
    buyer_id = auth.uid() or public.is_admin()
    or public.is_order_seller(public.orders.id)
  );

drop policy if exists "orders: update terkait" on public.orders;
create policy "orders: update terkait" on public.orders
  for update using (
    buyer_id = auth.uid() or public.is_admin()
    or public.is_order_seller(public.orders.id)
  );

drop policy if exists "order_items: terkait order" on public.order_items;
create policy "order_items: terkait order" on public.order_items
  for select using (
    public.is_admin() or seller_id = auth.uid()
    or public.is_order_buyer(order_id)
  );

drop policy if exists "order_items: pembeli order tsb insert" on public.order_items;
create policy "order_items: pembeli order tsb insert" on public.order_items
  for insert with check (public.is_order_buyer(order_id));
