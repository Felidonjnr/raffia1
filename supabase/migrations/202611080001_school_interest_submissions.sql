-- School interest submissions for the Raffia in School Challenge.
create table if not exists public.school_interest_submissions (
  id uuid primary key default gen_random_uuid(),
  school_name text not null,
  institution_type text not null check (institution_type in ('primary', 'secondary', 'tertiary')),
  contact_name text not null,
  position text not null,
  email text not null,
  phone text not null,
  school_address text not null,
  confirms_institution boolean not null default false check (confirms_institution = true),
  created_at timestamptz not null default now(),
  constraint school_interest_email_valid check (
    email = lower(btrim(email))
    and email ~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$'
  )
);

create index if not exists school_interest_submissions_created_idx
  on public.school_interest_submissions (created_at desc);

alter table public.school_interest_submissions enable row level security;
revoke all on public.school_interest_submissions from anon, authenticated;
grant select on public.school_interest_submissions to authenticated;

drop policy if exists school_interest_admin_read on public.school_interest_submissions;
create policy school_interest_admin_read
  on public.school_interest_submissions
  for select
  to authenticated
  using (public.is_admin());
