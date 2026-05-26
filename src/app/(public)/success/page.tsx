import Link from 'next/link'
import { CheckCircle2, Clock, Mail, Ticket } from 'lucide-react'
import { stripe } from '@/lib/stripe/config'
import prisma from '@/lib/prisma'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { ClearCartOnSuccess } from './success-client'

export const metadata = { title: 'Pago confirmado' }

type Props = {
  searchParams: Promise<{ session_id?: string }>
}

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams

  let booking:
    | {
        booking_number: string
        status: string
        guest_email: string | null
        total_amount: unknown
        currency: string
        booking_items: Array<{
          quantity: number
          service_date: Date
          service_time: Date | null
          experiences: { title: string } | null
          tickets: { id: string; status: string } | null
        }>
      }
    | null = null

  if (sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const bookingId = session.metadata?.bookingId
    if (bookingId) {
      booking = await prisma.bookings.findUnique({
        where: { id: bookingId },
        select: {
          booking_number: true,
          status: true,
          guest_email: true,
          total_amount: true,
          currency: true,
          booking_items: {
            select: {
              quantity: true,
              service_date: true,
              service_time: true,
              experiences: { select: { title: true } },
              tickets: { select: { id: true, status: true } },
            },
          },
        },
      })
    }
  }

  const ticketReady = booking?.booking_items.some((item) => item.tickets?.status === 'active') ?? false

  return (
    <div className="min-h-screen bg-white pb-24">
      <ClearCartOnSuccess />

      <main className="mx-auto flex max-w-md flex-col items-center px-6 pt-14 text-center md:max-w-2xl">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
          {ticketReady ? (
            <CheckCircle2 className="h-9 w-9 text-teal-700" />
          ) : (
            <Clock className="h-9 w-9 text-amber-500" />
          )}
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          {ticketReady ? 'Pago confirmado' : 'Estamos preparando tus tickets'}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {ticketReady
            ? 'Tus QR ya estan disponibles en tu wallet.'
            : 'Stripe confirmo el pago, pero el webhook aun esta terminando la reserva. Refresca tu wallet en unos segundos.'}
        </p>

        {booking && (
          <div className="mt-8 w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Reserva</p>
                <p className="font-bold text-slate-900">{booking.booking_number}</p>
              </div>
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700">
                {booking.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {booking.booking_items.map((item, index) => (
                <div key={`${item.experiences?.title}-${index}`} className="rounded-xl bg-white p-3">
                  <p className="text-sm font-semibold text-slate-800">
                    {item.experiences?.title ?? 'Experiencia'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.quantity} ticket{item.quantity === 1 ? '' : 's'} ·{' '}
                    {item.service_date.toISOString().split('T')[0]}
                  </p>
                </div>
              ))}
            </div>

            {booking.guest_email && (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Mail className="h-4 w-4" />
                <span>Confirmacion asociada a {booking.guest_email}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="rounded-full">
            <Link href={`${ROUTES.wallet}?confirmed=1`}>
              <Ticket className="mr-2 h-4 w-4" />
              Ver wallet
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href={ROUTES.explore}>Explorar mas</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
