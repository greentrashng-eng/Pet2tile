# Revive technical deployment
1. Create a Supabase project and a Vercel account owned by Green Trash.
2. Run `supabase/schema.sql`, then `supabase/rls.sql` in Supabase SQL Editor.
3. Create a private `evidence` Storage bucket for scale/material photos.
4. Create the first user with Supabase Auth. Set their profile `role` to `admin` and `is_active` to true.
5. Put `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`. For server-only routes, add `SUPABASE_SERVICE_ROLE_KEY` only in Vercel server environment variables, never in browser code.
6. Create material prices for PET, LDPE, HDPE and CARTONS before taking real records.
7. Deploy to Vercel; add the production URL to Supabase Auth redirect URLs.
8. Test staff roles, price calculation, evidence upload, payout approval, inventory reconciliation and backup/export before launch.

Do not enable automated bank payments in Phase 1. Record cash/bank payouts only after a hub operator verifies weight and material type.
