# Pet2tile Phase 1 — Production integration artifacts
This pack contains the database model, basic RLS controls, an example secure server endpoint for calculated weigh-ins, environment template and deployment checklist.

Important: the supplied API example uses the Supabase service role on the server. It must never be exposed in client-side code. Before production, a developer should replace its simple endpoint logic with authenticated user checks, add audit records, image validation and inventory movement creation after hub verification.
Pet2tile Phase 1
