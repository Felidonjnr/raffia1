-- Add the pending profile role before the admin security policies use it.
alter type public.user_role add value if not exists 'pending';