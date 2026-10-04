-- ============================================
-- RAFFIA LEGACY — ADMIN ACCESS HARDENING
-- ============================================

-- New accounts must be explicitly approved before they can access
-- the admin/editor area. Existing roles are preserved.
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'editor', 'pending'));

-- Never auto-create a privileged account.
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

-- Replace the self-update policy: users must not be able to change
-- their own role or otherwise modify their profile privileges.
drop policy if exists own_profile_update on public.profiles;

-- Admin/editor users retain full profile management.
drop policy if exists admin_profiles on public.profiles;
create policy admin_profiles
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- A user can still read their own profile.
drop policy if exists own_profile on public.profiles;
create policy own_profile
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

-- Prevent arbitrary self-created privileged profiles.
drop policy if exists own_profile_insert on public.profiles;
create policy own_profile_insert
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
  and role = 'pending'
);

-- Keep the privilege function restricted to approved roles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'editor')
  );
$$;
