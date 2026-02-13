-- Wallet / Tickets
create type public.ticket_status as enum ('active', 'used', 'expired', 'cancelled');

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  booking_item_id uuid not null references public.booking_items(id) on delete cascade unique,
  user_id uuid not null references public.profiles(id),
  experience_id uuid not null references public.experiences(id),
  provider_id uuid not null references public.provider_profiles(id),
  qr_code text not null unique, -- unique QR identifier
  status public.ticket_status not null default 'active',
  service_date date not null,
  service_time time,
  quantity integer not null default 1,
  provider_message text,
  scanned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.tickets enable row level security;

-- Indexes
create index idx_tickets_user on public.tickets(user_id);
create index idx_tickets_provider on public.tickets(provider_id);
create index idx_tickets_qr on public.tickets(qr_code);
create index idx_tickets_status on public.tickets(status) where status = 'active';

comment on table public.tickets is 'Digital wallet tickets with QR codes for booked experiences';
