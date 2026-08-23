create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  details text,
  icon text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.payment_methods enable row level security;

drop policy if exists "public can read active payment methods" on public.payment_methods;
create policy "public can read active payment methods"
on public.payment_methods for select
using (is_active = true);

-- Reutilise is_admin() (deja cree par 20260823120000_secure_profile_privileges.sql)
-- pour rester coherent avec le reste du projet et eviter la recursion RLS.
drop policy if exists "admins can manage payment methods" on public.payment_methods;
create policy "admins can manage payment methods"
on public.payment_methods for all
using (public.is_admin())
with check (public.is_admin());

notify pgrst, 'reload schema';
