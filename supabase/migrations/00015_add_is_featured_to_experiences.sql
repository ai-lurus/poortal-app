-- Add is_featured flag to experiences for admin-curated recommendations
alter table public.experiences add column if not exists is_featured boolean not null default false;

create index idx_experiences_featured on public.experiences(category_id, is_featured) where is_featured = true;
