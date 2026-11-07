-- Raffia Legacy mailing list subscribers
-- Subscribers are written through the newsletter-subscribe Edge Function.
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'pending_sync'
    check (status in ('pending_sync', 'subscribed', 'unsubscribed')),
  source text not null default 'website',
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_subscribers_email_normalized
    check (
      email = lower(btrim(email))
      and email ~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$'
    )
);

create index if not exists newsletter_subscribers_status_created_idx
  on public.newsletter_subscribers (status, created_at desc);

alter table public.newsletter_subscribers enable row level security;

revoke all on public.newsletter_subscribers from anon, authenticated;
grant select on public.newsletter_subscribers to authenticated;

drop policy if exists newsletter_admin_read on public.newsletter_subscribers;
create policy newsletter_admin_read
  on public.newsletter_subscribers
  for select
  to authenticated
  using (public.is_admin());
