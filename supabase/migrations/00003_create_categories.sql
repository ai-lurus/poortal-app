-- Create categories and subcategories tables
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text, -- lucide icon name
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Junction table: which categories are available at which destination
create table public.destination_categories (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations on delete cascade,
  category_id uuid not null references public.categories on delete cascade,
  created_at timestamptz not null default now(),
  unique (destination_id, category_id)
);

-- Enable RLS
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.destination_categories enable row level security;

-- Indexes
create index idx_subcategories_category on public.subcategories(category_id);
create index idx_destination_categories_dest on public.destination_categories(destination_id);
create index idx_destination_categories_cat on public.destination_categories(category_id);

comment on table public.categories is 'Service categories (tours, car rental, restaurants, etc.)';
comment on table public.subcategories is 'Sub-categories within each main category';
comment on table public.destination_categories is 'Categories available at each destination';
