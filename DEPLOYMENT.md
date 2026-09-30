# Pet2tile Technical Deployment

1. Create a Supabase project and a Vercel account owned by Green Trash Limited.
2. Run `supabase/schema.sql`, then `supabase/rls.sql` in the Supabase SQL Editor.
3. Create a private `evidence` Storage bucket for scale/material photos.
4. Create the first user with Supabase Auth. Set their profile `role` to `admin` and `is_active` to `true`.
5. Put `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the application's environment variables. For server-only routes, add `SUPABASE_SERVICE_ROLE_KEY` only in Vercel server environment variables, never in browser code.
6. Create material prices for PET, LDPE, HDPE and CARTONS before taking real records.
7. Deploy Pet2tile to Vercel and add the production URL to Supabase Auth redirect URLs.
8. Test staff roles, price calculation, evidence upload, payout approval, inventory reconciliation and backup/export before launch.

## Current Green Trash material buying prices

- PET — ₦200/kg
- LDPE — ₦250/kg
- HDPE — ₦200/kg
- CARTONS — ₦150/kg

## Phase 1 payment control

Do not enable automated bank payments in Phase 1. Record cash/bank payouts only after a hub operator verifies weight and material type.
