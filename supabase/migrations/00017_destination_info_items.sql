-- Create table for secure info categories (e.g. money exchange, consulates)
create table public.destination_info_categories (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations(id) on delete cascade,
  slug text not null,
  title text not null,
  icon text, -- lucide icon name
  color text, -- tailwind color class
  subtitle text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique(destination_id, slug)
);

comment on table public.destination_info_categories is 'Categories for secure information (e.g., Consulates, Money Exchange) per destination';

-- Create table for items inside those info categories
create table public.destination_info_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.destination_info_categories(id) on delete cascade,
  title text not null,
  description jsonb not null default '[]'::jsonb, -- Array of strings/details
  author text,
  date text,
  images_count integer,
  actions jsonb not null default '{}'::jsonb, -- Store boolean flags like { "time": true, "map": true }
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.destination_info_items is 'Individual items/cards (e.g., US Consulate, Airport ATM) belonging to a secure info category';

-- Enable RLS
alter table public.destination_info_categories enable row level security;
alter table public.destination_info_items enable row level security;

-- Policies for destination_info_categories
create policy "destination_info_categories are viewable by everyone"
  on public.destination_info_categories for select
  using (true);

create policy "destination_info_categories are insertable by admins"
  on public.destination_info_categories for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "destination_info_categories are updatable by admins"
  on public.destination_info_categories for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "destination_info_categories are deletable by admins"
  on public.destination_info_categories for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Policies for destination_info_items
create policy "destination_info_items are viewable by everyone"
  on public.destination_info_items for select
  using (true);

create policy "destination_info_items are insertable by admins"
  on public.destination_info_items for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "destination_info_items are updatable by admins"
  on public.destination_info_items for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "destination_info_items are deletable by admins"
  on public.destination_info_items for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
