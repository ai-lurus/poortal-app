-- Provider profiles and documents
create type public.provider_status as enum (
  'pending_review',
  'approved_incomplete',
  'active',
  'suspended',
  'rejected'
);

create table public.provider_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  destination_id uuid references public.destinations(id),
  business_name text not null,
  representative_name text not null,
  phone text not null,
  location text not null,
  category_id uuid references public.categories(id),
  short_description text not null,
  status public.provider_status not null default 'pending_review',
  -- Post-approval fields
  legal_name text,
  tax_id text,
  full_address text,
  customer_phone text,
  website text,
  operating_hours jsonb,
  -- Stripe Connect
  stripe_account_id text,
  stripe_onboarding_complete boolean not null default false,
  -- Metadata
  rejection_reason text,
  approved_at timestamptz,
  approved_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.document_type as enum (
  'government_id',
  'proof_of_address',
  'business_license',
  'insurance',
  'other'
);

create type public.document_status as enum (
  'pending',
  'approved',
  'rejected'
);

create table public.provider_documents (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.provider_profiles(id) on delete cascade,
  type public.document_type not null,
  name text not null,
  file_url text not null,
  status public.document_status not null default 'pending',
  rejection_reason text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.provider_profiles enable row level security;
alter table public.provider_documents enable row level security;

-- Indexes
create index idx_provider_profiles_user on public.provider_profiles(user_id);
create index idx_provider_profiles_status on public.provider_profiles(status);
create index idx_provider_profiles_destination on public.provider_profiles(destination_id);
create index idx_provider_documents_provider on public.provider_documents(provider_id);

comment on table public.provider_profiles is 'Provider business profiles with verification status';
comment on table public.provider_documents is 'Documents uploaded by providers for verification';
