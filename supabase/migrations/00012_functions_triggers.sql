-- ============================================================
-- Functions and Triggers
-- ============================================================

-- 1. Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at trigger to all tables that have the column
do $$
declare
  t text;
begin
  for t in
    select table_name from information_schema.columns
    where column_name = 'updated_at'
    and table_schema = 'public'
  loop
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function public.handle_updated_at()',
      t
    );
  end loop;
end;
$$;

-- 2. Auto-create profile on auth.users insert
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'tourist')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Update average_rating and review_count on experience when review is inserted/updated/deleted
create or replace function public.handle_review_change()
returns trigger
language plpgsql
security definer
as $$
declare
  exp_id uuid;
begin
  -- Get the experience_id from either NEW or OLD record
  if tg_op = 'DELETE' then
    exp_id := old.experience_id;
  else
    exp_id := new.experience_id;
  end if;

  -- Recalculate averages
  update public.experiences
  set
    average_rating = coalesce(
      (select avg(rating)::numeric(3,2) from public.reviews where experience_id = exp_id and is_visible = true),
      0
    ),
    review_count = (
      select count(*) from public.reviews where experience_id = exp_id and is_visible = true
    )
  where id = exp_id;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute function public.handle_review_change();

-- 4. Update search_vector on experience insert/update
create or replace function public.update_experience_search_vector()
returns trigger
language plpgsql
as $$
begin
  new.search_vector := to_tsvector('spanish',
    coalesce(new.title, '') || ' ' ||
    coalesce(new.description, '') || ' ' ||
    coalesce(new.short_description, '') || ' ' ||
    coalesce(array_to_string(new.highlights, ' '), '')
  );
  return new;
end;
$$;

create trigger update_experience_search
  before insert or update of title, description, short_description, highlights
  on public.experiences
  for each row execute function public.update_experience_search_vector();

-- 5. Generate booking_number
create or replace function public.generate_booking_number()
returns trigger
language plpgsql
as $$
declare
  new_number text;
begin
  loop
    new_number := 'POORTAL-' || upper(substr(md5(random()::text), 1, 6));
    exit when not exists (select 1 from public.bookings where booking_number = new_number);
  end loop;
  new.booking_number := new_number;
  return new;
end;
$$;

create trigger set_booking_number
  before insert on public.bookings
  for each row
  when (new.booking_number is null)
  execute function public.generate_booking_number();

-- 6. Search experiences RPC function
create or replace function public.search_experiences(
  search_query text default null,
  dest_id uuid default null,
  cat_id uuid default null,
  subcat_id uuid default null,
  min_price numeric default null,
  max_price numeric default null,
  min_rating numeric default null,
  available_date date default null,
  sort_by text default 'relevance',
  page_size integer default 20,
  page_offset integer default 0
)
returns table (
  id uuid,
  title text,
  slug text,
  short_description text,
  price_amount numeric,
  price_currency text,
  pricing_type public.pricing_type,
  duration_minutes integer,
  average_rating numeric,
  review_count integer,
  cover_image_url text,
  provider_name text,
  destination_name text,
  category_name text,
  rank real
)
language plpgsql
stable
security definer
as $$
begin
  return query
  select
    e.id,
    e.title,
    e.slug,
    e.short_description,
    e.price_amount,
    e.price_currency,
    e.pricing_type,
    e.duration_minutes,
    e.average_rating,
    e.review_count,
    (select ei.url from public.experience_images ei where ei.experience_id = e.id and ei.is_cover = true limit 1) as cover_image_url,
    pp.business_name as provider_name,
    d.name as destination_name,
    c.name as category_name,
    case
      when search_query is not null then ts_rank(e.search_vector, plainto_tsquery('spanish', search_query))
      else 0
    end as rank
  from public.experiences e
  join public.provider_profiles pp on e.provider_id = pp.id
  join public.destinations d on e.destination_id = d.id
  join public.categories c on e.category_id = c.id
  where e.status = 'active'
    and (search_query is null or e.search_vector @@ plainto_tsquery('spanish', search_query))
    and (dest_id is null or e.destination_id = dest_id)
    and (cat_id is null or e.category_id = cat_id)
    and (subcat_id is null or e.subcategory_id = subcat_id)
    and (min_price is null or e.price_amount >= min_price)
    and (max_price is null or e.price_amount <= max_price)
    and (min_rating is null or e.average_rating >= min_rating)
    and (available_date is null or exists (
      select 1 from public.experience_availability ea
      where ea.experience_id = e.id
      and ea.date = available_date
      and ea.is_blocked = false
      and ea.booked_spots < ea.total_spots
    ))
  order by
    case when sort_by = 'relevance' and search_query is not null
      then ts_rank(e.search_vector, plainto_tsquery('spanish', search_query))
    end desc nulls last,
    case when sort_by = 'price_asc' then e.price_amount end asc,
    case when sort_by = 'price_desc' then e.price_amount end desc,
    case when sort_by = 'rating' then e.average_rating end desc,
    case when sort_by = 'newest' then e.created_at end desc,
    e.average_rating desc
  limit page_size
  offset page_offset;
end;
$$;
