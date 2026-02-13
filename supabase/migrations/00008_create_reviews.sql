-- Reviews system
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  booking_item_id uuid not null references public.booking_items(id) unique,
  user_id uuid not null references public.profiles(id),
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  -- Provider response
  provider_response text,
  provider_responded_at timestamptz,
  -- Moderation
  is_flagged boolean not null default false,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Indexes
create index idx_reviews_experience on public.reviews(experience_id);
create index idx_reviews_user on public.reviews(user_id);
create index idx_reviews_rating on public.reviews(experience_id, rating);

comment on table public.reviews is 'User reviews for completed bookings';
