-- Experiences (services offered by providers)
create type public.cancellation_policy as enum ('flexible', 'moderate', 'strict');
create type public.experience_status as enum ('draft', 'pending_review', 'active', 'paused', 'rejected', 'archived');
create type public.pricing_type as enum ('per_person', 'per_group', 'flat_rate');

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.provider_profiles(id) on delete cascade,
  destination_id uuid not null references public.destinations(id),
  category_id uuid not null references public.categories(id),
  subcategory_id uuid references public.subcategories(id),
  title text not null,
  slug text not null,
  description text not null,
  short_description text,
  highlights text[], -- array of key highlights
  includes text[], -- what's included
  excludes text[], -- what's not included
  requirements text[], -- requirements for participants
  meeting_point text,
  meeting_point_lat double precision,
  meeting_point_lng double precision,
  duration_minutes integer,
  max_capacity integer not null default 10,
  min_capacity integer not null default 1,
  pricing_type public.pricing_type not null default 'per_person',
  price_amount numeric(10,2) not null,
  price_currency text not null default 'MXN',
  cancellation_policy public.cancellation_policy not null default 'flexible',
  status public.experience_status not null default 'draft',
  average_rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  -- Full-text search
  search_vector tsvector,
  -- Metadata
  rejection_reason text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider_id, slug)
);

create table public.experience_images (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.experience_availability (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time,
  total_spots integer not null,
  booked_spots integer not null default 0,
  price_override numeric(10,2), -- optional price override for specific dates
  is_blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint available_spots_check check (booked_spots <= total_spots)
);

-- Enable RLS
alter table public.experiences enable row level security;
alter table public.experience_images enable row level security;
alter table public.experience_availability enable row level security;

-- Indexes
create index idx_experiences_provider on public.experiences(provider_id);
create index idx_experiences_destination on public.experiences(destination_id);
create index idx_experiences_category on public.experiences(category_id);
create index idx_experiences_status on public.experiences(status) where status = 'active';
create index idx_experiences_search on public.experiences using gin(search_vector);
create index idx_experience_images_experience on public.experience_images(experience_id);
create index idx_experience_availability_lookup on public.experience_availability(experience_id, date) where is_blocked = false;

comment on table public.experiences is 'Tourist experiences/services offered by providers';
comment on table public.experience_images is 'Images for each experience';
comment on table public.experience_availability is 'Daily availability calendar for experiences';
