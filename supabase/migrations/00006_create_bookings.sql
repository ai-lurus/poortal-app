-- Bookings and booking items
create type public.booking_status as enum (
  'pending_payment',
  'paid',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'refunded',
  'disputed'
);

create type public.booking_item_status as enum (
  'pending',
  'confirmed',
  'rejected',
  'cancelled',
  'completed'
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_number text not null unique, -- POORTAL-XXXXXX
  user_id uuid not null references public.profiles(id),
  status public.booking_status not null default 'pending_payment',
  total_amount numeric(10,2) not null,
  platform_fee numeric(10,2) not null default 0,
  currency text not null default 'MXN',
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.booking_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  experience_id uuid not null references public.experiences(id),
  availability_id uuid references public.experience_availability(id),
  provider_id uuid not null references public.provider_profiles(id),
  status public.booking_item_status not null default 'pending',
  quantity integer not null default 1,
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) not null,
  service_date date not null,
  service_time time,
  provider_message text, -- message from provider on approve/reject
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.bookings enable row level security;
alter table public.booking_items enable row level security;

-- Indexes
create index idx_bookings_user on public.bookings(user_id);
create index idx_bookings_status on public.bookings(status);
create index idx_bookings_number on public.bookings(booking_number);
create index idx_booking_items_booking on public.booking_items(booking_id);
create index idx_booking_items_provider on public.booking_items(provider_id);
create index idx_booking_items_experience on public.booking_items(experience_id);

comment on table public.bookings is 'User bookings/orders';
comment on table public.booking_items is 'Individual items within a booking, one per provider experience';
