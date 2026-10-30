-- The Home Lab: member accounts.
-- Adds member details, referrals, rewards, member offers, launch alerts and
-- newsletter double opt-in. Run after 0001_init.sql.

-- ─── Profiles: member details ────────────────────────────────────────────────
alter table public.profiles
  add column email text,
  add column member_number bigint generated always as identity,
  add column birthday_day smallint check (birthday_day between 1 and 31),
  add column birthday_month smallint check (birthday_month between 1 and 12),
  add column favourite_sets text[] not null default '{}',
  add column email_batch_reminders boolean not null default false,
  add column email_launch_alerts boolean not null default false,
  add column referral_code text unique check (referral_code ~ '^[A-Z0-9-]{4,20}$'),
  add column referred_by uuid references auth.users (id) on delete set null,
  add column welcome_sent_at timestamptz,
  add column created_at timestamptz not null default now();

-- Customers may only edit their own details and preferences. Email, member
-- number, referral fields and timestamps are written by triggers and the
-- server, never from the browser.
revoke insert, update on public.profiles from anon, authenticated;
grant update (first_name, last_name, phone, email_product_updates, birthday_day, birthday_month, favourite_sets, email_batch_reminders, email_launch_alerts, updated_at)
  on public.profiles to authenticated;
drop policy if exists "profiles: owner inserts" on public.profiles;

-- A short, readable code for the member's referral link, e.g. EMMA-7KQ2.
create function public.new_referral_code(first_name text)
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  prefix text := left(upper(regexp_replace(coalesce(first_name, ''), '[^A-Za-z]', '', 'g')), 8);
  suffix text;
  candidate text;
begin
  if prefix = '' then prefix := 'HOME'; end if;
  loop
    suffix := '';
    for i in 1..4 loop
      suffix := suffix || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    candidate := prefix || '-' || suffix;
    exit when not exists (select 1 from public.profiles where referral_code = candidate);
  end loop;
  return candidate;
end;
$$;

-- Existing members (if any) get an email and a referral code.
update public.profiles p
  set email = u.email, referral_code = public.new_referral_code(p.first_name)
  from auth.users u
  where u.id = p.id;

-- ─── Referrals ───────────────────────────────────────────────────────────────
-- One row per friend. Email invites start as 'invited'; a friend who joins
-- through a referral link is recorded without their email, so the referrer
-- never sees an address they did not type in themselves.
create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users (id) on delete cascade,
  referred_user_id uuid unique references auth.users (id) on delete set null,
  invited_email text check (invited_email is null or position('@' in invited_email) > 1),
  source text not null default 'link' check (source in ('link', 'email')),
  status text not null default 'invited' check (status in ('invited', 'joined', 'ordered', 'rewarded')),
  created_at timestamptz not null default now(),
  joined_at timestamptz,
  ordered_at timestamptz,
  rewarded_at timestamptz
);

create index referrals_referrer_idx on public.referrals (referrer_id);
create unique index referrals_one_invite_per_email
  on public.referrals (referrer_id, lower(invited_email)) where invited_email is not null;

alter table public.referrals enable row level security;

create policy "referrals: referrer reads" on public.referrals
  for select using (auth.uid() = referrer_id);
-- No insert, update or delete policies: invites go through the server route.

-- ─── Rewards ─────────────────────────────────────────────────────────────────
-- Credit a member has earned. `code` is the matching Shopify discount code,
-- filled in when the reward becomes available.
create table public.member_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('referral', 'referred_welcome', 'birthday', 'goodwill')),
  title text not null,
  amount_cents integer not null check (amount_cents > 0),
  code text,
  status text not null default 'pending' check (status in ('pending', 'available', 'used', 'expired')),
  referral_id uuid references public.referrals (id) on delete set null,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index member_rewards_user_idx on public.member_rewards (user_id);

alter table public.member_rewards enable row level security;

create policy "rewards: owner reads" on public.member_rewards
  for select using (auth.uid() = user_id);

-- ─── Member offers ───────────────────────────────────────────────────────────
-- Offers shown only to signed-in members. Add rows in the Supabase table
-- editor; every code must also exist as a discount in Shopify.
create table public.member_offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  discount_label text,
  code text,
  terms text,
  href text check (href is null or href ~ '^/'),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  active boolean not null default true,
  sort smallint not null default 0,
  created_at timestamptz not null default now()
);

alter table public.member_offers enable row level security;

create policy "offers: members read live offers" on public.member_offers
  for select to authenticated
  using (active and starts_at <= now() and (ends_at is null or ends_at > now()));

-- ─── Launch alerts ───────────────────────────────────────────────────────────
-- "Tell me when it opens" for coming-soon sets and pieces.
create table public.product_alerts (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_handle text not null check (char_length(product_handle) between 1 and 255),
  created_at timestamptz not null default now(),
  notified_at timestamptz,
  primary key (user_id, product_handle)
);

alter table public.product_alerts enable row level security;

create policy "alerts: owner reads" on public.product_alerts
  for select using (auth.uid() = user_id);
create policy "alerts: owner inserts" on public.product_alerts
  for insert with check (auth.uid() = user_id);
create policy "alerts: owner deletes" on public.product_alerts
  for delete using (auth.uid() = user_id);
revoke update on public.product_alerts from anon, authenticated;

-- ─── Newsletter: double opt-in ───────────────────────────────────────────────
alter table public.newsletter_subscribers
  add column user_id uuid references auth.users (id) on delete set null,
  add column confirm_token uuid unique default gen_random_uuid(),
  add column confirm_sent_at timestamptz,
  add column confirmed_at timestamptz,
  add column unsubscribe_token uuid not null unique default gen_random_uuid();

-- Sign-ups recorded before double opt-in already gave consent.
update public.newsletter_subscribers set confirmed_at = created_at, confirm_token = null where confirmed_at is null;

-- ─── New members ─────────────────────────────────────────────────────────────
-- Creates the profile with a referral code and records who referred the new
-- member: a referral code from the sign-up link first, otherwise an email
-- invite sent to this address.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  ref_code text := upper(nullif(trim(new.raw_user_meta_data ->> 'referral_code'), ''));
  referrer uuid;
  via text := 'link';
begin
  if ref_code is not null then
    select id into referrer from public.profiles where referral_code = ref_code and id <> new.id;
  end if;
  if referrer is null then
    select referrer_id into referrer from public.referrals
      where lower(invited_email) = lower(new.email) and referred_user_id is null and referrer_id <> new.id
      order by created_at
      limit 1;
    via := 'email';
  end if;

  insert into public.profiles (id, first_name, last_name, email, referral_code, referred_by)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'first_name', ''),
    nullif(new.raw_user_meta_data ->> 'last_name', ''),
    new.email,
    public.new_referral_code(new.raw_user_meta_data ->> 'first_name'),
    referrer
  )
  on conflict (id) do nothing;

  if referrer is not null then
    update public.referrals
      set referred_user_id = new.id, status = 'joined', joined_at = now()
      where referrer_id = referrer and lower(invited_email) = lower(new.email) and referred_user_id is null;
    if not found then
      insert into public.referrals (referrer_id, referred_user_id, source, status, joined_at)
      values (referrer, new.id, via, 'joined', now());
    end if;
  end if;
  return new;
end;
$$;

-- Keep the profile's copy of the email in step with Supabase Auth.
create function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email, updated_at = now() where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();
