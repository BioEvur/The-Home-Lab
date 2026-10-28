# Connecting Supabase

Supabase provides customer accounts (sign up, sign in, email verification, password reset), profiles, the address book, the account wishlist, newsletter consent records and the Shopify customer link.

## 1. Create the project

Create a Supabase project in an EU region (for example Frankfurt or Ireland) to keep personal data in the EU.

## 2. Run the migration

Run `supabase/migrations/0001_init.sql`, either with the Supabase CLI (`supabase db push`) or by pasting it into the SQL editor. It creates:

| Table | Holds | Access |
| --- | --- | --- |
| `profiles` | Name, phone, product-email preference | Owner only. A row is created automatically on sign-up |
| `customer_addresses` | Address book, one default per customer | Owner only. `set_default_address(address_id)` switches the default atomically |
| `wishlist_items` | Product handles a customer has saved | Owner only |
| `newsletter_subscribers` | Email, exact consent wording, source, time | No client access. Written by the server with the service role |
| `commerce_customer_links` | Supabase user ↔ Shopify customer id | Owner can read; only the service role writes |

Every table has row-level security enabled. No table stores passwords: those stay in Supabase Auth.

## 3. Auth settings

In Authentication › URL configuration:

- **Site URL**: your production URL, for example `https://thehomelab.ie`.
- **Redirect URLs**: add `https://YOUR-DOMAIN/auth/callback` and `http://localhost:3000/auth/callback`.

In Authentication › Providers › Email:

- Keep **Confirm email** on. Order history is only linked after the email is verified.
- Set a minimum password length of at least 10. The site also asks for letters and numbers.

In Authentication › Emails, edit the confirmation and reset templates to match the brand. Set up custom SMTP (for example Postmark, Resend or SES) before launch: Supabase's built-in email service is rate-limited and meant for testing.

The reset email links to `/auth/callback?next=/account/reset-password`, where the customer sets a new password.

## 4. Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   # or the legacy anon key
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...                  # server only
```

The publishable key is safe in the browser because row-level security limits each customer to their own rows. The service-role key bypasses RLS. It is only read in `src/lib/supabase/admin.ts` (which imports `server-only`) and is used for newsletter sign-ups and writing the Shopify customer link. Never give it a `NEXT_PUBLIC_` prefix.

## 5. What changes when connected

- Sign in, register, forgot password and reset password work, and the "not connected" notices disappear.
- `/account/*` pages require a session; signed-out visitors are redirected to sign in and returned afterwards.
- A guest wishlist is merged into the account on sign-in.
- The newsletter form stores consent records (requires the service-role key).
- Order history additionally needs the Shopify Admin token (see SHOPIFY.md).

## Data protection notes

- Deleting a user in Supabase Auth cascades to their profile, addresses, wishlist and customer link. It does not delete their Shopify customer or orders: handle erasure requests in Shopify too.
- The newsletter table keeps the consent wording and time as a record of consent. `unsubscribed_at` is there for when an email provider is connected.
- Document these processors (Supabase, Shopify, your email provider) in the privacy policy.
