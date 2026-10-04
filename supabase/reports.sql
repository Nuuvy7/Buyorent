-- Tabel laporan pelanggaran listing (BUG-13).
-- Untuk dieksekusi di Supabase SQL Editor.

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  reporter_id uuid not null default auth.uid(),
  reason text not null check (char_length(reason) between 5 and 500),
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

drop policy if exists "reports: insert own" on public.reports;
create policy "reports: insert own" on public.reports
  for insert with check (auth.uid() = reporter_id);

drop policy if exists "reports: select own or admin" on public.reports;
create policy "reports: select own or admin" on public.reports
  for select using (auth.uid() = reporter_id or public.is_admin());

drop policy if exists "reports: admin update" on public.reports;
create policy "reports: admin update" on public.reports
  for update using (public.is_admin());
