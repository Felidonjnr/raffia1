-- Raffia Legacy Admin Security Patch
-- Run after 202610040001_marketplace.sql.
--
-- New authenticated users are NOT automatically administrators.
-- Promote only the intended administrator manually after signup:
-- update public.profiles set role='admin' where id=(select id from auth.users where email='YOUR-ADMIN-EMAIL');

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('pending','admin','editor'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email, 'User'),
    'pending'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- A user may view their own profile, but cannot promote themselves.
drop policy if exists own_profile_insert on public.profiles;
create policy own_profile_insert
on public.profiles
for insert
to authenticated
with check (id = auth.uid() and role = 'pending');

drop policy if exists own_profile_update on public.profiles;

-- Only an already-approved admin/editor can modify profiles.
drop policy if exists admin_profiles on public.profiles;
create policy admin_profiles
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Existing accounts retain their current approved role.
-- Existing admin/editor records are intentionally not changed by this patch.
