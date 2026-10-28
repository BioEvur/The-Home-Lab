-- The Home Lab: initial schema.
-- Supabase Auth (auth.users) is the only identity store. Passwords live in
-- auth.users and are never copied into these tables.

-- ─── Profiles ────────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  email_product_updates boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: owner reads" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: owner inserts" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles: owner updates" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Create an empty profile row for each new user. First and last name come
-- from the sign-up form's user metadata when present.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'first_name', ''),
    nullif(new.raw_user_meta_data ->> 'last_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Wishlist ────────────────────────────────────────────────────────────────
-- Stores product handles, not copies of product data: the catalogue stays in
-- Shopify and is looked up when the wishlist is displayed.
create table public.wishlist_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_handle text not null check (char_length(product_handle) between 1 and 255),
  created_at timestamptz not null default now(),
  primary key (user_id, product_handle)
);

alter table public.wishlist_items enable row level security;

create policy "wishlist: owner reads" on public.wishlist_items
  for select using (auth.uid() = user_id);
create policy "wishlist: owner inserts" on public.wishlist_items
  for insert with check (auth.uid() = user_id);
create policy "wishlist: owner updates" on public.wishlist_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "wishlist: owner deletes" on public.wishlist_items
  for delete using (auth.uid() = user_id);

-- ─── Address book ────────────────────────────────────────────────────────────
create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text,
  first_name text not null,
  last_name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  county text,
  postcode text,
  country_code text not null default 'IE' check (country_code ~ '^[A-Z]{2}$'),
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customer_addresses_user_idx on public.customer_addresses (user_id);
-- At most one default address per user.
create unique index customer_addresses_one_default
  on public.customer_addresses (user_id) where is_default;

alter table public.customer_addresses enable row level security;

create policy "addresses: owner reads" on public.customer_addresses
  for select using (auth.uid() = user_id);
create policy "addresses: owner inserts" on public.customer_addresses
  for insert with check (auth.uid() = user_id);
create policy "addresses: owner updates" on public.customer_addresses
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "addresses: owner deletes" on public.customer_addresses
  for delete using (auth.uid() = user_id);

-- Switch the default address atomically (the partial unique index would
-- reject two separate updates).
create function public.set_default_address(address_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.customer_addresses
    where id = address_id and user_id = auth.uid()
  ) then
    raise exception 'Address not found';
  end if;

  update public.customer_addresses
    set is_default = false, updated_at = now()
    where user_id = auth.uid() and is_default and id <> address_id;

  update public.customer_addresses
    set is_default = true, updated_at = now()
    where id = address_id and user_id = auth.uid();
end;
$$;

grant execute on function public.set_default_address(uuid) to authenticated;

-- ─── Newsletter ──────────────────────────────────────────────────────────────
-- Written only by the server route with the service role. Keeps the exact
-- consent wording and source as a record of consent.
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null check (position('@' in email) > 1),
  consent_text text not null,
  source text,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create unique index newsletter_subscribers_email_key
  on public.newsletter_subscribers (lower(email));

alter table public.newsletter_subscribers enable row level security;
-- No policies: anon and authenticated roles have no access. The service role
-- bypasses RLS.

-- ─── Commerce identity mapping ───────────────────────────────────────────────
-- Maps a Supabase user to a Shopify customer. Written server-side only, after
-- the user's email is verified. Users may read their own row.
create table public.commerce_customer_links (
  user_id uuid primary key references auth.users (id) on delete cascade,
  shopify_customer_id text not null unique,
  email text not null,
  linked_at timestamptz not null default now()
);

alter table public.commerce_customer_links enable row level security;

create policy "links: owner reads" on public.commerce_customer_links
  for select using (auth.uid() = user_id);
-- No insert, update or delete policies: only the service role writes.
