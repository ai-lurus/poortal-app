-- ============================================================
-- Update category names to short labels + add shopping/wellness
-- ============================================================

-- Rename existing categories
update public.categories set name = 'tours',    slug = 'tours',    icon = 'Compass'  where id = 'c0000001-0000-0000-0000-000000000001';
update public.categories set name = 'sea',       slug = 'sea',      icon = 'Waves'    where id = 'c0000001-0000-0000-0000-000000000002';
update public.categories set name = 'ride',      slug = 'ride',     icon = 'Car'      where id = 'c0000001-0000-0000-0000-000000000003';
update public.categories set name = 'food',      slug = 'food',     icon = 'Utensils' where id = 'c0000001-0000-0000-0000-000000000004';
update public.categories set name = 'stay',      slug = 'stay',     icon = 'Heart'    where id = 'c0000001-0000-0000-0000-000000000005';
update public.categories set name = 'party',     slug = 'party',    icon = 'Moon'     where id = 'c0000001-0000-0000-0000-000000000006';
update public.categories set name = 'sports',    slug = 'sports',   icon = 'Dumbbell' where id = 'c0000001-0000-0000-0000-000000000007';
update public.categories set name = 'culture',   slug = 'culture',  icon = 'Landmark' where id = 'c0000001-0000-0000-0000-000000000008';

-- Add new categories
insert into public.categories (id, name, slug, description, icon, sort_order) values
  ('c0000001-0000-0000-0000-000000000009', 'shopping', 'shopping', 'Tiendas, mercados y souvenirs', 'ShoppingBag', 9),
  ('c0000001-0000-0000-0000-000000000010', 'wellness', 'wellness', 'Bienestar, yoga y meditacion', 'Sparkles', 10)
on conflict (id) do nothing;

-- Link new categories to Cancun destination
insert into public.destination_categories (destination_id, category_id) values
  ('d0000000-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000009'),
  ('d0000000-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000010')
on conflict do nothing;
