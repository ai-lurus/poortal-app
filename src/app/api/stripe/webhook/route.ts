import { NextResponse } from 'next/server'
import { stripe, STRIPE_CONFIG } from '@/lib/stripe/config'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  let event

  try {
    const body = await request.text()
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_CONFIG.webhookSecret)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid Stripe webhook' },
      { status: 400 }
    )
  }

  if (event.type === 'account.updated') {
    const account = event.data.object
    await prisma.provider_profiles.updateMany({
      where: { stripe_account_id: account.id },
      data: {
        stripe_onboarding_complete: Boolean(
          account.details_submitted && account.charges_enabled && account.payouts_enabled
        ),
      },
    })
    return NextResponse.json({ received: true })
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object
    const bookingId = session.metadata?.bookingId
    if (bookingId) {
      await prisma.bookings.updateMany({
        where: { id: bookingId, status: 'pending_payment' },
        data: { status: 'cancelled' },
      })
    }
    return NextResponse.json({ received: true })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object
  const bookingId = session.metadata?.bookingId

  if (!bookingId || session.payment_status !== 'paid') {
    return NextResponse.json({ received: true })
  }

  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
    include: {
      booking_items: {
        include: {
          tickets: true,
          provider_profiles: {
            select: {
              id: true,
              user_id: true,
              stripe_account_id: true,
              stripe_onboarding_complete: true,
            },
          },
        },
      },
    },
  })

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  if (booking.status !== 'pending_payment') {
    return NextResponse.json({ received: true, status: booking.status })
  }

  const paymentIntentId =
    typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id
  const charge = paymentIntentId
    ? await stripe.paymentIntents.retrieve(paymentIntentId, { expand: ['latest_charge'] })
    : null
  const chargeId =
    typeof charge?.latest_charge === 'string' ? charge.latest_charge : charge?.latest_charge?.id

  await prisma.$transaction(async (tx) => {
    await tx.bookings.update({
      where: { id: booking.id },
      data: {
        status: 'confirmed',
        stripe_payment_intent_id: paymentIntentId ?? null,
        stripe_checkout_session_id: session.id,
      },
    })

    await tx.payments.create({
      data: {
        booking_id: booking.id,
        type: 'charge',
        status: 'succeeded',
        amount: booking.total_amount,
        currency: booking.currency,
        stripe_payment_intent_id: paymentIntentId ?? null,
        stripe_charge_id: chargeId ?? null,
        metadata: { stripeCheckoutSessionId: session.id },
      },
    })

    if (Number(booking.platform_fee) > 0) {
      await tx.payments.create({
        data: {
          booking_id: booking.id,
          type: 'platform_fee',
          status: 'succeeded',
          amount: booking.platform_fee,
          currency: booking.currency,
          stripe_payment_intent_id: paymentIntentId ?? null,
        },
      })
    }

    for (const item of booking.booking_items) {
      await tx.booking_items.update({
        where: { id: item.id },
        data: { status: 'confirmed' },
      })

      if (item.availability_id) {
        await tx.experience_availability.update({
          where: { id: item.availability_id },
          data: { booked_spots: { increment: item.quantity } },
        })
      }

      if (!item.tickets) {
        await tx.tickets.create({
          data: {
            booking_item_id: item.id,
            user_id: booking.user_id,
            experience_id: item.experience_id,
            provider_id: item.provider_id,
            qr_code: crypto.randomUUID(),
            status: 'active',
            service_date: item.service_date,
            service_time: item.service_time,
            quantity: item.quantity,
          },
        })
      }

      await tx.notifications.create({
        data: {
          user_id: item.provider_profiles.user_id,
          type: 'booking_confirmed',
          title: 'Nueva reserva pagada',
          body: `Reserva ${booking.booking_number} lista para validar con QR.`,
          link: '/provider/bookings',
          metadata: {
            bookingId: booking.id,
            bookingItemId: item.id,
            experienceId: item.experience_id,
          },
        },
      })
    }

    await tx.notifications.create({
      data: {
        user_id: booking.user_id,
        type: 'booking_confirmed',
        title: 'Tus tickets estan listos',
        body: `Reserva ${booking.booking_number} confirmada. Abre tu wallet para ver los QR.`,
        link: '/wallet',
        metadata: { bookingId: booking.id },
      },
    })
  })

  for (const item of booking.booking_items) {
    const provider = item.provider_profiles
    if (!provider.stripe_account_id || !provider.stripe_onboarding_complete) continue

    const existingTransfer = await prisma.payments.findFirst({
      where: {
        booking_id: booking.id,
        booking_item_id: item.id,
        type: 'transfer',
      },
      select: { id: true },
    })
    if (existingTransfer) continue

    const payoutAmount =
      Number(item.subtotal) * (1 + STRIPE_CONFIG.sellerServiceSharePercentage / 100)

    const transfer = await stripe.transfers.create({
      amount: Math.round(payoutAmount * 100),
      currency: booking.currency.toLowerCase(),
      destination: provider.stripe_account_id,
      transfer_group: booking.booking_number,
      metadata: {
        bookingId: booking.id,
        bookingItemId: item.id,
        providerId: provider.id,
      },
    })

    await prisma.payments.create({
      data: {
        booking_id: booking.id,
        booking_item_id: item.id,
        type: 'transfer',
        status: 'succeeded',
        amount: payoutAmount,
        currency: booking.currency,
        stripe_transfer_id: transfer.id,
      },
    })
  }

  return NextResponse.json(
    { received: true },
    { status: 200 }
  )
}
