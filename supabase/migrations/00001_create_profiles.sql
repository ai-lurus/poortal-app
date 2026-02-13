-- Create profiles table extending auth.users
create type public.user_role as enum ('tourist', 'provider', 'admin');

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  role public.user_role not null default 'tourist',
  avatar_url text,
  nationality text,
  preferred_language text default 'es',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Index for role-based queries
create index idx_profiles_role on public.profiles(role);

comment on table public.profiles is 'User profiles extending Supabase auth.users';
