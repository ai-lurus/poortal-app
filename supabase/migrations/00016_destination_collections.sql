-- ============================================================
-- Destination Collections: replace destination_recommendations
-- Admin curates named collections per destination
-- ============================================================

-- Collections (e.g., "Vegetariano", "Para familias", "Romantico")
create table public.destination_collections (
  id          uuid        primary key default gen_random_uuid(),
  destination_id uuid     not null references public.destinations(id) on delete cascade,
  name        text        not null,
  description text,
  icon        text,        -- lucide icon name
  sort_order  integer     not null default 0,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Experiences inside each collection
create table public.collection_experiences (
  id            uuid        primary key default gen_random_uuid(),
  collection_id uuid        not null references public.destination_collections(id) on delete cascade,
  experience_id uuid        not null references public.experiences(id) on delete cascade,
  sort_order    integer     not null default 0,
  created_at    timestamptz not null default now(),
  unique (collection_id, experience_id)
);

-- RLS
alter table public.destination_collections  enable row level security;
alter table public.collection_experiences   enable row level security;

-- Public can read active collections
create policy "Public can read active collections"
  on public.destination_collections for select
  using (is_active = true);

-- Only admins can manage collections
create policy "Admins can manage collections"
  on public.destination_collections for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Public can read collection experiences
create policy "Public can read collection experiences"
  on public.collection_experiences for select
  using (
    exists (
      select 1 from public.destination_collections dc
      where dc.id = collection_id and dc.is_active = true
    )
  );

-- Only admins can manage collection experiences
create policy "Admins can manage collection experiences"
  on public.collection_experiences for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Indexes
create index idx_dest_collections_destination on public.destination_collections(destination_id, sort_order);
create index idx_collection_experiences_collection on public.collection_experiences(collection_id, sort_order);
create index idx_collection_experiences_experience on public.collection_experiences(experience_id);

-- Auto-update updated_at
create trigger set_destination_collections_updated_at
  before update on public.destination_collections
  for each row execute function public.handle_updated_at();
