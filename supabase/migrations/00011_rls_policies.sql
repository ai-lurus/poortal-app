-- ============================================================
-- RLS Policies for all tables
-- ============================================================

-- Helper function to check user role
create or replace function public.get_user_role(user_id uuid)
returns public.user_role
language sql
security definer
stable
as $$
  select role from public.profiles where id = user_id;
$$;

-- Helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- PROFILES
-- ============================================================
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin());

-- ============================================================
-- DESTINATIONS (public catalog)
-- ============================================================
create policy "Anyone can view active destinations"
  on public.destinations for select
  using (is_active = true);

create policy "Admins can manage destinations"
  on public.destinations for all
  using (public.is_admin());

-- ============================================================
-- CATEGORIES (public catalog)
-- ============================================================
create policy "Anyone can view active categories"
  on public.categories for select
  using (is_active = true);

create policy "Admins can manage categories"
  on public.categories for all
  using (public.is_admin());

create policy "Anyone can view active subcategories"
  on public.subcategories for select
  using (is_active = true);

create policy "Admins can manage subcategories"
  on public.subcategories for all
  using (public.is_admin());

create policy "Anyone can view destination categories"
  on public.destination_categories for select
  using (true);

create policy "Admins can manage destination categories"
  on public.destination_categories for all
  using (public.is_admin());

-- ============================================================
-- PROVIDER PROFILES
-- ============================================================
create policy "Users can view their own provider profile"
  on public.provider_profiles for select
  using (user_id = auth.uid());

create policy "Users can create their own provider profile"
  on public.provider_profiles for insert
  with check (user_id = auth.uid());

create policy "Users can update their own provider profile"
  on public.provider_profiles for update
  using (user_id = auth.uid());

create policy "Admins can manage all provider profiles"
  on public.provider_profiles for all
  using (public.is_admin());

create policy "Anyone can view active providers (for experience listings)"
  on public.provider_profiles for select
  using (status = 'active');

-- ============================================================
-- PROVIDER DOCUMENTS
-- ============================================================
create policy "Providers can manage their own documents"
  on public.provider_documents for all
  using (
    exists (
      select 1 from public.provider_profiles
      where id = provider_documents.provider_id
      and user_id = auth.uid()
    )
  );

create policy "Admins can manage all provider documents"
  on public.provider_documents for all
  using (public.is_admin());

-- ============================================================
-- EXPERIENCES (public catalog when active)
-- ============================================================
create policy "Anyone can view active experiences"
  on public.experiences for select
  using (status = 'active');

create policy "Providers can manage their own experiences"
  on public.experiences for all
  using (
    exists (
      select 1 from public.provider_profiles
      where id = experiences.provider_id
      and user_id = auth.uid()
    )
  );

create policy "Admins can manage all experiences"
  on public.experiences for all
  using (public.is_admin());

-- Experience images
create policy "Anyone can view images of active experiences"
  on public.experience_images for select
  using (
    exists (
      select 1 from public.experiences
      where id = experience_images.experience_id
      and status = 'active'
    )
  );

create policy "Providers can manage their experience images"
  on public.experience_images for all
  using (
    exists (
      select 1 from public.experiences e
      join public.provider_profiles p on e.provider_id = p.id
      where e.id = experience_images.experience_id
      and p.user_id = auth.uid()
    )
  );

create policy "Admins can manage all experience images"
  on public.experience_images for all
  using (public.is_admin());

-- Experience availability
create policy "Anyone can view availability of active experiences"
  on public.experience_availability for select
  using (
    exists (
      select 1 from public.experiences
      where id = experience_availability.experience_id
      and status = 'active'
    )
  );

create policy "Providers can manage their experience availability"
  on public.experience_availability for all
  using (
    exists (
      select 1 from public.experiences e
      join public.provider_profiles p on e.provider_id = p.id
      where e.id = experience_availability.experience_id
      and p.user_id = auth.uid()
    )
  );

create policy "Admins can manage all availability"
  on public.experience_availability for all
  using (public.is_admin());

-- ============================================================
-- BOOKINGS
-- ============================================================
create policy "Users can view their own bookings"
  on public.bookings for select
  using (user_id = auth.uid());

create policy "Users can create bookings"
  on public.bookings for insert
  with check (user_id = auth.uid());

create policy "Users can update their own bookings"
  on public.bookings for update
  using (user_id = auth.uid());

create policy "Admins can manage all bookings"
  on public.bookings for all
  using (public.is_admin());

-- Booking items
create policy "Users can view their own booking items"
  on public.booking_items for select
  using (
    exists (
      select 1 from public.bookings
      where id = booking_items.booking_id
      and user_id = auth.uid()
    )
  );

create policy "Providers can view booking items for their experiences"
  on public.booking_items for select
  using (
    exists (
      select 1 from public.provider_profiles
      where id = booking_items.provider_id
      and user_id = auth.uid()
    )
  );

create policy "Providers can update booking items for their experiences"
  on public.booking_items for update
  using (
    exists (
      select 1 from public.provider_profiles
      where id = booking_items.provider_id
      and user_id = auth.uid()
    )
  );

create policy "Admins can manage all booking items"
  on public.booking_items for all
  using (public.is_admin());

-- ============================================================
-- TICKETS
-- ============================================================
create policy "Users can view their own tickets"
  on public.tickets for select
  using (user_id = auth.uid());

create policy "Providers can view tickets for their experiences"
  on public.tickets for select
  using (
    exists (
      select 1 from public.provider_profiles
      where id = tickets.provider_id
      and user_id = auth.uid()
    )
  );

create policy "Providers can update tickets for their experiences"
  on public.tickets for update
  using (
    exists (
      select 1 from public.provider_profiles
      where id = tickets.provider_id
      and user_id = auth.uid()
    )
  );

create policy "Admins can manage all tickets"
  on public.tickets for all
  using (public.is_admin());

-- ============================================================
-- PAYMENTS
-- ============================================================
create policy "Users can view their own payments"
  on public.payments for select
  using (
    exists (
      select 1 from public.bookings
      where id = payments.booking_id
      and user_id = auth.uid()
    )
  );

create policy "Admins can manage all payments"
  on public.payments for all
  using (public.is_admin());

-- ============================================================
-- CANCELLATIONS
-- ============================================================
create policy "Users can view their own cancellations"
  on public.cancellations for select
  using (cancelled_by = auth.uid());

create policy "Users can create cancellations for their bookings"
  on public.cancellations for insert
  with check (cancelled_by = auth.uid());

create policy "Admins can manage all cancellations"
  on public.cancellations for all
  using (public.is_admin());

-- ============================================================
-- REVIEWS
-- ============================================================
create policy "Anyone can view visible reviews"
  on public.reviews for select
  using (is_visible = true);

create policy "Users can create reviews for their completed bookings"
  on public.reviews for insert
  with check (user_id = auth.uid());

create policy "Users can update their own reviews"
  on public.reviews for update
  using (user_id = auth.uid());

create policy "Providers can update reviews (for response only)"
  on public.reviews for update
  using (
    exists (
      select 1 from public.experiences e
      join public.provider_profiles p on e.provider_id = p.id
      where e.id = reviews.experience_id
      and p.user_id = auth.uid()
    )
  );

create policy "Admins can manage all reviews"
  on public.reviews for all
  using (public.is_admin());

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create policy "Users can view their own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "Users can update their own notifications"
  on public.notifications for update
  using (user_id = auth.uid());

create policy "Admins can manage all notifications"
  on public.notifications for all
  using (public.is_admin());

-- ============================================================
-- PLATFORM CREDITS
-- ============================================================
create policy "Users can view their own credits"
  on public.platform_credits for select
  using (user_id = auth.uid());

create policy "Admins can manage all credits"
  on public.platform_credits for all
  using (public.is_admin());
