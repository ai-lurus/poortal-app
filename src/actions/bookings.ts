'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface CartItem {
  experienceId: string
  availabilityId: string | null
  providerId: string
  quantity: number
  unitPrice: number
  currency: string
  serviceDate: string
  serviceTime: string | null
  pricingType: 'per_person' | 'per_group' | 'flat_rate'
}

export async function createBookingFromCart(items: CartItem[]) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'not_authenticated' }
  if (items.length === 0) return { error: 'empty_cart' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any

  const subtotal = items.reduce((acc, item) => {
    const lineTotal =
      item.pricingType === 'per_person' ? item.unitPrice * item.quantity : item.unitPrice
    return acc + lineTotal
  }, 0)
  const iva = subtotal * 0.16
  const total = subtotal + iva

  const bookingNumber = `POORTAL-${crypto.randomUUID().substring(0, 8).toUpperCase()}`

  const { data: booking, error: bookingError } = await admin
    .from('bookings')
    .insert({
      booking_number: bookingNumber,
      user_id: user.id,
      status: 'confirmed',
      total_amount: total,
      platform_fee: 0,
      currency: items[0].currency,
    })
    .select('id')
    .single()

  if (bookingError || !booking) {
    console.error('[bookings] create booking error:', bookingError)
    return { error: 'booking_failed' }
  }

  for (const item of items) {
    const lineTotal =
      item.pricingType === 'per_person' ? item.unitPrice * item.quantity : item.unitPrice

    const { data: bookingItem, error: itemError } = await admin
      .from('booking_items')
      .insert({
        booking_id: booking.id,
        experience_id: item.experienceId,
        availability_id: item.availabilityId,
        provider_id: item.providerId,
        status: 'confirmed',
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: lineTotal,
        service_date: item.serviceDate,
        service_time: item.serviceTime,
      })
      .select('id')
      .single()

    if (itemError || !bookingItem) {
      console.error('[bookings] create booking_item error:', itemError)
      return { error: 'booking_item_failed' }
    }

    const qrCode = crypto.randomUUID()

    const { error: ticketError } = await admin.from('tickets').insert({
      booking_item_id: bookingItem.id,
      user_id: user.id,
      experience_id: item.experienceId,
      provider_id: item.providerId,
      qr_code: qrCode,
      status: 'active',
      service_date: item.serviceDate,
      service_time: item.serviceTime,
      quantity: item.quantity,
    })

    if (ticketError) {
      console.error('[bookings] create ticket error:', ticketError)
      return { error: 'ticket_failed' }
    }
  }

  return { bookingId: booking.id }
}
