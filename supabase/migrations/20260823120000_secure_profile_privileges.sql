-- Fixes a privilege-escalation hole: the previous "own profile update" policy let any
-- authenticated user set their own role/premium/coins via the client (update profiles
-- set role='admin' where id=auth.uid() would have worked). This locks those columns down
-- to admins only, while leaving self-service fields (username, etc.) editable by their owner.
-- Runs outside PostgREST (SQL editor, service_role, migrations) are unaffected on purpose,
-- since auth.role() is only set on PostgREST-authenticated requests.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'authenticated' and not public.is_admin() then
    new.role := old.role;
    new.is_premium := old.is_premium;
    new.premium_orders_left := old.premium_orders_left;
    new.plus_coins := old.plus_coins;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_privileges on public.profiles;
create trigger protect_profile_privileges
before update on public.profiles
for each row execute function public.protect_profile_privileges();

drop policy if exists "admins can update any profile" on public.profiles;
create policy "admins can update any profile" on public.profiles
for update using (public.is_admin()) with check (public.is_admin());

notify pgrst, 'reload schema';
