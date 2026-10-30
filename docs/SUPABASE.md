# Connecting Supabase

Supabase provides customer accounts (sign up, sign in, email verification, password reset), member profiles, the address book, the wishlist, referrals and rewards, member offers, launch alerts, newsletter consent records and the Shopify customer link.

## 1. Create the project

Create a Supabase project in an EU region (for example Frankfurt or Ireland) to keep personal data in the EU.

## 2. Run the migrations

Run `supabase/migrations/0001_init.sql` and then `supabase/migrations/0002_members.sql`, in that order, either with the Supabase CLI (`supabase db push`) or by pasting each one into the SQL editor and pressing Run. `0001` creates:

| Table | Holds | Access |
| --- | --- | --- |
| `profiles` | Name, phone, product-email preference | Owner only. A row is created automatically on sign-up |
| `customer_addresses` | Address book, one default per customer | Owner only. `set_default_address(address_id)` switches the default atomically |
| `wishlist_items` | Product handles a customer has saved | Owner only |
| `newsletter_subscribers` | Email, exact consent wording, source, time | No client access. Written by the server with the service role |
| `commerce_customer_links` | Supabase user ↔ Shopify customer id | Owner can read; only the service role writes |

`0002` adds the member system:

| Table or change | Holds | Access |
| --- | --- | --- |
| `profiles` (new columns) | Member number, birthday (day and month), favourite sets, email preferences, referral code, who referred them | Owner can read. Owner can only update name, phone, birthday, favourite sets and email preferences; member number and referral fields are set by the database |
| `referrals` | Who invited whom, by link or by email, and how far it got (invited, joined, ordered, rewarded) | Referrer can read their own |
| `member_rewards` | Codes a member has earned (€15 referral credit, €15 welcome code for a referred friend) | Owner can read; only the server writes |
| `member_offers` | Members-only offers shown in the account | Any signed-in member can read live offers; you add them in the table editor |
| `product_alerts` | "Tell me when it opens" requests for coming-soon sets | Owner can read, add and remove |
| `newsletter_subscribers` (new columns) | Double opt-in confirmation and one-click unsubscribe tokens, link to the account | No client access |

On sign-up a trigger creates the profile, gives the member a referral code (for example `EMMA-7KQ2`) and links them to whoever referred them: the code from a referral link wins, otherwise an earlier email invite to the same address. Another trigger keeps the profile email in step when a member changes their email.

Every table has row-level security enabled. No table stores passwords: those stay in Supabase Auth.

## 3. Auth settings

In Authentication › URL configuration:

- **Site URL**: your production URL, for example `https://thehomelab.ie`.
- **Redirect URLs**: add `https://YOUR-DOMAIN/auth/callback` and `http://localhost:3000/auth/callback`.

In Authentication › Providers › Email:

- Keep **Confirm email** on. Order history is only linked after the email is verified.
- Set a minimum password length of at least 10. The site also asks for letters and numbers.

In Authentication › Emails, paste the branded templates from `emails/supabase/` (subjects are in `emails/supabase/SUBJECTS.txt`), and set up custom SMTP through Resend. Both steps are in [EMAIL.md](EMAIL.md). Supabase's built-in email service only sends a few emails an hour and is meant for testing.

The reset email links to `/auth/callback?next=/account/reset-password`, where the customer sets a new password.

## 4. Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   # or the legacy anon key
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...                  # server only
```

The publishable key is safe in the browser because row-level security limits each customer to their own rows. The service-role key bypasses RLS. It is only read in `src/lib/supabase/admin.ts` (which imports `server-only`) and is used for newsletter sign-ups, referral invites and rewards, account deletion and writing the Shopify customer link. Never give it a `NEXT_PUBLIC_` prefix.

## 5. What changes when connected

- Sign in, register, forgot password and reset password work, and the "not connected" notices disappear.
- `/account/*` pages require a session; signed-out visitors are redirected to sign in and returned afterwards.
- A guest wishlist is merged into the account on sign-in.
- The newsletter form stores consent records (requires the service-role key).
- The account area shows member number, offers, rewards, referrals, new arrivals, recently viewed, email preferences and security settings, and members can download or delete their data.
- Order history additionally needs the Shopify Admin token (see SHOPIFY.md).

## Data protection notes

- Deleting a user in Supabase Auth (or the member pressing Delete my account) cascades to their profile, addresses, wishlist, rewards, alerts and customer link, and removes their newsletter record. It does not delete their Shopify customer or orders: handle erasure requests in Shopify too.
- The newsletter table keeps the consent wording and time as a record of consent, plus when the address was confirmed and when it unsubscribed.
- Document these processors (Supabase, Shopify, your email provider) in the privacy policy.
