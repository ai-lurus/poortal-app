-- Create destinations table
create table public.destinations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  country text not null,
  state text,
  city text,
  latitude double precision,
  longitude double precision,
  cover_image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.destinations enable row level security;

-- Indexes
create index idx_destinations_slug on public.destinations(slug);
create index idx_destinations_active on public.destinations(is_active) where is_active = true;

comment on table public.destinations is 'Tourist destinations available on the platform';
