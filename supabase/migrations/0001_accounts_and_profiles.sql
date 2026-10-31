-- Divine Matrix: accounts (usernames) and saved birth profiles.
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.

create extension if not exists citext with schema extensions;

-- One row per signed-up user, holding their unique username.
create table if not exists public.accounts (
  id uuid primary key references auth.users (id) on delete cascade,
  username extensions.citext not null unique
    check (username ~ '^[A-Za-z0-9_.]{3,24}$'),
  created_at timestamptz not null default now()
);

-- Birth profiles a user has saved (their own, family, partners, team).
create table if not exists public.birth_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  dob date not null,
  tob time not null,
  city_id text not null,
  created_at timestamptz not null default now()
);
create index if not exists birth_profiles_user_idx on public.birth_profiles (user_id, created_at);

-- Row level security: every user only ever sees and changes their own rows.
alter table public.accounts enable row level security;
alter table public.birth_profiles enable row level security;

drop policy if exists "Read own account" on public.accounts;
create policy "Read own account" on public.accounts
  for select to authenticated using (id = (select auth.uid()));

drop policy if exists "Read own profiles" on public.birth_profiles;
create policy "Read own profiles" on public.birth_profiles
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "Add own profiles" on public.birth_profiles;
create policy "Add own profiles" on public.birth_profiles
  for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "Edit own profiles" on public.birth_profiles;
create policy "Edit own profiles" on public.birth_profiles
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "Delete own profiles" on public.birth_profiles;
create policy "Delete own profiles" on public.birth_profiles
  for delete to authenticated using (user_id = (select auth.uid()));

-- Create the account row (with the chosen username) whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.accounts (id, username)
  values (new.id, new.raw_user_meta_data ->> 'username');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Is a username free? Used by the sign-up form.
create or replace function public.username_available(name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (select 1 from public.accounts where username = name::extensions.citext);
$$;

-- Lets people sign in with their username: returns the email behind it.
-- Note: anyone who knows a username can look up its email. Fine for private
-- testing; before a public launch, move username sign-in to an Edge Function.
create or replace function public.email_for_username(name text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select u.email
  from public.accounts a
  join auth.users u on u.id = a.id
  where a.username = name::extensions.citext;
$$;

revoke all on function public.username_available(text) from public;
revoke all on function public.email_for_username(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;
grant execute on function public.email_for_username(text) to anon, authenticated;
