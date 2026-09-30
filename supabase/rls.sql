alter table profiles enable row level security;
alter table collector_profiles enable row level security;
alter table material_prices enable row level security;
alter table weigh_ins enable row level security;
alter table inventory_movements enable row level security;
alter table pickup_requests enable row level security;

create or replace function get_user_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from profiles
  where id = auth.uid()
$$;

create or replace function user_is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select get_user_role() in ('admin', 'hub_operator')
$$;

create policy "own profile"
on profiles
for select
to authenticated
using (
  id = auth.uid()
  or user_is_staff()
);

create policy "staff read weighins"
on weigh_ins
for select
to authenticated
using (
  collector_id = auth.uid()
  or user_is_staff()
);

create policy "staff insert weighins"
on weigh_ins
for insert
to authenticated
with check (
  user_is_staff()
);

create policy "staff update weighins"
on weigh_ins
for update
to authenticated
using (
  user_is_staff()
);

create policy "read prices"
on material_prices
for select
to authenticated
using (true);

create policy "admin price management"
on material_prices
for all
to authenticated
using (
  get_user_role() = 'admin'
)
with check (
  get_user_role() = 'admin'
);

create policy "public pickup"
on pickup_requests
for insert
to anon, authenticated
with check (true);

create policy "staff pickup read"
on pickup_requests
for select
to authenticated
using (
  user_is_staff()
);
