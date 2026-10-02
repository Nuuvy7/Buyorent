-- guard status pesanan (Tahap E) — jalankan via SQL editor dashboard Supabase

-- guard integritas status: pembeli hanya boleh update kolom lain (payment_proof),
-- perubahan status = urusan penjual terkait / admin (satu-satunya jalan, semua
-- update lewat RLS langsung dari client)
create or replace function public.guard_order_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status
     and not public.is_order_seller(old.id)
     and not public.is_admin() then
    raise exception 'status hanya bisa diubah penjual atau admin';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_guard_order_status on public.orders;
create trigger trg_guard_order_status
  before update on public.orders
  for each row
  execute function public.guard_order_status();
