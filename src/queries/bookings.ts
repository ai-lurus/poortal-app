import { createClient } from '@/lib/supabase/server'
import type { Booking, BookingItem } from '@/types'

export type BookingItemWithDetails = BookingItem & {
  bookings: Pick<Booking, 'id' | 'booking_number' | 'status' | 'total_amount' | 'currency' | 'created_at' | 'notes'> & {
    profiles: { full_name: string | null; email: string; phone: string | null } | null
  }
  experiences: { id: string; title: string; slug: string } | null
}

export async function getProviderBookingItems(
  providerId: string,
  status?: BookingItem['status'] | BookingItem['status'][]
): Promise<BookingItemWithDetails[]> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('booking_items')
    .select(`
      *,
      bookings:booking_id (
        id, booking_number, status, total_amount, currency, created_at, notes,
        profiles:user_id (full_name, email, phone)
      ),
      experiences:experience_id (id, title, slug)
    `)
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })

  if (status) {
    if (Array.isArray(status)) {
      query = query.in('status', status)
    } else {
      query = query.eq('status', status)
    }
  }

  const { data } = await query

  return (data as BookingItemWithDetails[] | null) ?? []
}

export async function getProviderBookingStats(providerId: string) {
  const supabase = await createClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const [total, monthly, pending, cancelled] = await Promise.all([
    db
      .from('booking_items')
      .select('subtotal', { count: 'exact' })
      .eq('provider_id', providerId)
      .in('status', ['confirmed', 'completed']),

    db
      .from('booking_items')
      .select('subtotal')
      .eq('provider_id', providerId)
      .in('status', ['confirmed', 'completed'])
      .gte('created_at', startOfMonth),

    db
      .from('booking_items')
      .select('*', { count: 'exact', head: true })
      .eq('provider_id', providerId)
      .eq('status', 'pending'),

    db
      .from('booking_items')
      .select('*', { count: 'exact', head: true })
      .eq('provider_id', providerId)
      .eq('status', 'cancelled'),
  ])

  const totalRevenue = (total.data ?? []).reduce((sum: number, item: { subtotal: unknown }) => sum + Number(item.subtotal), 0)
  const monthlyRevenue = (monthly.data ?? []).reduce((sum: number, item: { subtotal: unknown }) => sum + Number(item.subtotal), 0)
  const PLATFORM_FEE_RATE = 0.15

  return {
    totalBookings: total.count ?? 0,
    pendingCount: pending.count ?? 0,
    cancelledCount: cancelled.count ?? 0,
    totalRevenue,
    monthlyRevenue,
    netRevenue: totalRevenue * (1 - PLATFORM_FEE_RATE),
    netMonthlyRevenue: monthlyRevenue * (1 - PLATFORM_FEE_RATE),
  }
}
