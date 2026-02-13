-- Notifications and platform credits
create type public.notification_type as enum (
  'booking_created',
  'booking_confirmed',
  'booking_rejected',
  'booking_cancelled',
  'payment_received',
  'payment_transferred',
  'review_received',
  'provider_approved',
  'provider_rejected',
  'experience_approved',
  'experience_rejected',
  'general'
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.notification_type not null default 'general',
  title text not null,
  body text,
  link text, -- optional deep link within the app
  is_read boolean not null default false,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create type public.credit_reason as enum (
  'provider_cancellation',
  'referral',
  'promotion',
  'dispute_resolution',
  'manual'
);

create table public.platform_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(10,2) not null,
  currency text not null default 'MXN',
  reason public.credit_reason not null,
  description text,
  booking_id uuid references public.bookings(id),
  expires_at timestamptz,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.notifications enable row level security;
alter table public.platform_credits enable row level security;

-- Indexes
create index idx_notifications_user on public.notifications(user_id);
create index idx_notifications_unread on public.notifications(user_id, is_read) where is_read = false;
create index idx_platform_credits_user on public.platform_credits(user_id);

comment on table public.notifications is 'In-app notifications for users';
comment on table public.platform_credits is 'Platform credits for loyalty, refunds, etc.';
