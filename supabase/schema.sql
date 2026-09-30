-- Pet2tile database schema
-- Green Trash Limited
-- Run once in the Pet2tile Supabase project's SQL Editor.

create type user_role as enum ('admin','hub_operator','collector');
create type record_status as enum ('pending','verified','paid','rejected');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role user_role not null default 'collector',
  is_active boolean default false,
  created_at timestamptz default now()
);

create table collection_centres (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null
);

insert into collection_centres (name, address)
values (
  'Owode Elede Community Recyclable Collections Center',
  '30 Aloku Street, Off Ikorodu Road, Owode Elede, Mile 12, Lagos'
);

create table material_prices (
  id uuid primary key default gen_random_uuid(),
  material_type text not null check (material_type in ('PET','LDPE','HDPE','CARTONS')),
  buy_price numeric(12,2) not null,
  effective_from date default current_date,
  is_active boolean default true,
  approved_by uuid references profiles(id)
);

create table collector_profiles (
  id uuid primary key references profiles(id),
  centre_id uuid references collection_centres(id),
  home_address text,
  next_of_kin_name text,
  next_of_kin_phone text,
  bank_name text,
  account_name text,
  account_number text,
  onboarding_status text default 'pending'
);

create table weigh_ins (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  collector_id uuid references profiles(id),
  centre_id uuid references collection_centres(id),
  material_type text not null check (material_type in ('PET','LDPE','HDPE','CARTONS')),
  quality_grade text default 'clean',
  gross_weight_kg numeric(12,2) not null check (gross_weight_kg > 0),
  verified_weight_kg numeric(12,2),
  buy_price_per_kg numeric(12,2),
  payout_amount numeric(12,2),
  status record_status default 'pending',
  payment_method text,
  material_photo_url text,
  created_at timestamptz default now(),
  verified_by uuid references profiles(id)
);

create table inventory_movements (
  id uuid primary key default gen_random_uuid(),
  centre_id uuid references collection_centres(id),
  material_type text not null check (material_type in ('PET','LDPE','HDPE','CARTONS')),
  weight_kg numeric(12,2) not null,
  movement_type text not null check (movement_type in ('in','out','adjustment')),
  source_weigh_in_id uuid references weigh_ins(id),
  created_at timestamptz default now()
);

create table pickup_requests (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  name text not null,
  phone text not null,
  material_type text check (material_type in ('PET','LDPE','HDPE','CARTONS')),
  address text not null,
  status text default 'new',
  created_at timestamptz default now()
);

-- Green Trash current buying prices for Pet2tile.
insert into material_prices (material_type, buy_price, effective_from, is_active)
values
  ('PET', 200, current_date, true),
  ('LDPE', 250, current_date, true),
  ('HDPE', 200, current_date, true),
  ('CARTONS', 150, current_date, true);

