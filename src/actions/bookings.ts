'use server'

import { auth } from '@/lib/auth'
import { headers, cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { stripe, STRIPE_CONFIG } from '@/lib/stripe/config'

interface CartItem {
  experienceId: string
  availabilityId: string | null
  title: string
  providerId: string
  quantity: number
  unitPrice: number
  currency: string
  serviceDate: string
  serviceTime: string | null
  pricingType: 'per_person' | 'per_group' | 'flat_rate'
}

interface CreateBookingInput {
  items: CartItem[]
  guestEmail?: string
  guestName?: string
}

function parseServiceTime(serviceTime: string | null): Date | null {
  if (!serviceTime) return null
  // Already a full ISO string (e.g. "1970-01-01T15:00:00.000Z")
  if (serviceTime.includes('T')) return new Date(serviceTime)
  // Bare time string (e.g. "09:00:00")
  return new Date(`1970-01-01T${serviceTime}Z`)
}

function lineTotal(item: CartItem) {
  return item.pricingType === 'per_person' ? item.unitPrice * item.quantity : item.unitPrice
}

function toStripeAmount(amount: number) {
  return Math.round(amount * 100)
}

export async function createBookingFromCart({ items, guestEmail, guestName }: CreateBookingInput) {
  if (items.length === 0) return { error: 'empty_cart' as const }

  const experienceIds = items.map((i) => i.experienceId)
  const existingExperiences = await prisma.experiences.findMany({
    where: { id: { in: experienceIds } },
    select: { id: true },
  })
  const foundIds = new Set(existingExperiences.map((e) => e.id))
  const missing = experienceIds.filter((id) => !foundIds.has(id))
  if (missing.length > 0) return { error: 'invalid_experiences' as const }

  const authSession = await auth.api.getSession({ headers: await headers() })

  let profileId: string

  if (authSession?.user) {
    const profile = await prisma.profiles.findFirst({
      where: { user_id: authSession.user.id },
      select: { id: true },
    })
    if (!profile) return { error: 'not_authenticated' as const }
    profileId = profile.id
  } else {
    if (!guestEmail) return { error: 'guest_email_required' as const }

    const email = guestEmail.trim().toLowerCase()
    const existing = await prisma.profiles.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existing) {
      profileId = existing.id
    } else {
      const created = await prisma.profiles.create({
        data: {
          email,
          full_name: guestName?.trim() || null,
          role: 'tourist',
        },
        select: { id: true },
      })
      profileId = created.id
    }
  }

  const subtotal = items.reduce((acc, item) => acc + lineTotal(item), 0)
  const buyerServiceFee = subtotal * (STRIPE_CONFIG.buyerServiceFeePercentage / 100)
  const poortalFee = subtotal * (STRIPE_CONFIG.poortalFeePercentage / 100)
  const total = subtotal + buyerServiceFee

  const bookingNumber = `POORTAL-${crypto.randomUUID().substring(0, 8).toUpperCase()}`
  const guestToken = crypto.randomUUID()

  const booking = await prisma.bookings.create({
    data: {
      booking_number: bookingNumber,
      user_id: profileId,
      guest_email: authSession?.user ? null : guestEmail?.trim().toLowerCase(),
      guest_token: guestToken,
      status: 'pending_payment',
      total_amount: total,
      platform_fee: poortalFee,
      currency: items[0].currency,
    },
    select: { id: true },
  })

  for (const item of items) {
    const itemSubtotal = lineTotal(item)

    await prisma.booking_items.create({
      data: {
        booking_id: booking.id,
        experience_id: item.experienceId,
        availability_id: item.availabilityId,
        provider_id: item.providerId,
        status: 'pending',
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: itemSubtotal,
        service_date: new Date(item.serviceDate),
        service_time: parseServiceTime(item.serviceTime),
      },
    })
  }

  if (!authSession?.user) {
    const cookieStore = await cookies()
    const existing = cookieStore.get('guest_tokens')?.value
    const tokens: string[] = existing ? JSON.parse(existing) : []
    tokens.push(guestToken)
    cookieStore.set('guest_tokens', JSON.stringify(tokens), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: authSession?.user ? undefined : guestEmail?.trim().toLowerCase(),
    line_items: [
      ...items.map((item) => ({
        quantity: 1,
        price_data: {
          currency: item.currency.toLowerCase(),
          unit_amount: toStripeAmount(lineTotal(item)),
          product_data: {
            name: item.title,
            description: item.providerId,
          },
        },
      })),
      {
        quantity: 1,
        price_data: {
          currency: items[0].currency.toLowerCase(),
          unit_amount: toStripeAmount(buyerServiceFee),
          product_data: {
            name: 'Poortal service fee',
            description: '10% marketplace service fee',
          },
        },
      },
    ],
    metadata: {
      bookingId: booking.id,
      guestToken,
      bookingNumber,
    },
    payment_intent_data: {
      metadata: {
        bookingId: booking.id,
        bookingNumber,
      },
      transfer_group: bookingNumber,
    },
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/cart?cancelled=1`,
  })

  await prisma.bookings.update({
    where: { id: booking.id },
    data: { stripe_checkout_session_id: checkoutSession.id },
  })

  if (!checkoutSession.url) return { error: 'stripe_checkout_failed' as const }

  return { bookingId: booking.id, guestToken, checkoutUrl: checkoutSession.url }
}
