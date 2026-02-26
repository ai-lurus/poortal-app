-- Recommended experiences per destination, managed by admins
create table public.destination_recommendations (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations(id) on delete cascade,
  experience_id uuid not null references public.experiences(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (destination_id, experience_id)
);

alter table public.destination_recommendations enable row level security;

-- Everyone can read recommendations
create policy "Public can read destination recommendations"
  on public.destination_recommendations for select
  using (true);

-- Only admins can insert/update/delete
create policy "Admins can manage destination recommendations"
  on public.destination_recommendations for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create index idx_dest_recommendations_dest on public.destination_recommendations(destination_id, sort_order);
