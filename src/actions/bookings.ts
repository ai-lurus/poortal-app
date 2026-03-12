'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'

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
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: 'not_authenticated' }
  if (items.length === 0) return { error: 'empty_cart' }

  const profile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
    select: { id: true },
  })
  if (!profile) return { error: 'not_authenticated' }

  const subtotal = items.reduce((acc, item) => {
    const lineTotal = item.pricingType === 'per_person' ? item.unitPrice * item.quantity : item.unitPrice
    return acc + lineTotal
  }, 0)
  const iva = subtotal * 0.16
  const total = subtotal + iva

  const bookingNumber = `POORTAL-${crypto.randomUUID().substring(0, 8).toUpperCase()}`

  const booking = await prisma.bookings.create({
    data: {
      booking_number: bookingNumber,
      user_id: profile.id,
      status: 'confirmed',
      total_amount: total,
      platform_fee: 0,
      currency: items[0].currency,
    },
    select: { id: true },
  })

  for (const item of items) {
    const lineTotal = item.pricingType === 'per_person' ? item.unitPrice * item.quantity : item.unitPrice

    const bookingItem = await prisma.booking_items.create({
      data: {
        booking_id: booking.id,
        experience_id: item.experienceId,
        availability_id: item.availabilityId,
        provider_id: item.providerId,
        status: 'confirmed',
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: lineTotal,
        service_date: new Date(item.serviceDate),
        service_time: item.serviceTime,
      },
      select: { id: true },
    })

    const qrCode = crypto.randomUUID()

    await prisma.tickets.create({
      data: {
        booking_item_id: bookingItem.id,
        user_id: profile.id,
        experience_id: item.experienceId,
        provider_id: item.providerId,
        qr_code: qrCode,
        status: 'active',
        service_date: new Date(item.serviceDate),
        service_time: item.serviceTime,
        quantity: item.quantity,
      },
    })
  }

  return { bookingId: booking.id }
}
