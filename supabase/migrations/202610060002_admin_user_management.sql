-- Admin user management
-- Adds a safe, dashboard-visible email field to profiles so admins can
-- approve and assign roles without exposing auth.users to the client.

alter table public.profiles
  add column if not exists email text;

update public.profiles p
set email = au.email
from auth.users au
where au.id = p.id
  and (p.email is null or p.email = '');

create index if not exists profiles_email_idx on public.profiles(email);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email, 'User'),
    'pending'
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Keep profile access restricted: users can see themselves; approved admins
-- can manage all profiles. The existing admin_profiles policy remains the
-- authorization boundary for role changes.
drop policy if exists own_profile_insert on public.profiles;
create policy own_profile_insert
on public.profiles
for insert
to authenticated
with check (id = auth.uid() and role = 'pending');

drop policy if exists own_profile_update on public.profiles;
create policy own_profile_update
on public.profiles
for update
to authenticated
using (id = auth.uid() and role = 'pending')
with check (id = auth.uid() and role = 'pending');

drop policy if exists own_profile on public.profiles;
create policy own_profile
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists admin_profiles on public.profiles;
create policy admin_profiles
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
