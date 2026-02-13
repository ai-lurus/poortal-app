-- Payments and cancellations
create type public.payment_status as enum ('pending', 'succeeded', 'failed', 'refunded', 'partially_refunded');
create type public.payment_type as enum ('charge', 'transfer', 'refund', 'platform_fee');

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  booking_item_id uuid references public.booking_items(id),
  type public.payment_type not null,
  status public.payment_status not null default 'pending',
  amount numeric(10,2) not null,
  currency text not null default 'MXN',
  stripe_payment_intent_id text,
  stripe_charge_id text,
  stripe_transfer_id text,
  stripe_refund_id text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cancellations (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  booking_item_id uuid references public.booking_items(id),
  cancelled_by uuid not null references public.profiles(id),
  reason text,
  cancellation_policy public.cancellation_policy not null,
  hours_before_service numeric(10,2),
  original_amount numeric(10,2) not null,
  refund_percentage integer not null, -- 0, 50, or 100
  refund_amount numeric(10,2) not null,
  stripe_refund_id text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.payments enable row level security;
alter table public.cancellations enable row level security;

-- Indexes
create index idx_payments_booking on public.payments(booking_id);
create index idx_payments_status on public.payments(status);
create index idx_cancellations_booking on public.cancellations(booking_id);

comment on table public.payments is 'Payment transactions linked to Stripe';
comment on table public.cancellations is 'Cancellation records with refund calculations';
