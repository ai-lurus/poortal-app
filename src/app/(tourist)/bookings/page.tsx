import Link from 'next/link'
import { headers, cookies } from 'next/headers'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarCheck, Ticket } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'

export const metadata = {
  title: 'Mis Reservas',
}

function formatMoney(amount: unknown, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(Number(amount))
}

function formatDate(date: Date) {
  return date.toISOString().split('T')[0]
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending_payment: 'Pago pendiente',
    confirmed: 'Confirmada',
    paid: 'Pagada',
    completed: 'Completada',
    cancelled: 'Cancelada',
    refunded: 'Reembolsada',
    disputed: 'En disputa',
    in_progress: 'En proceso',
  }
  return labels[status] ?? status
}

const bookingInclude = {
  booking_items: {
    include: {
      experiences: { select: { title: true } },
      provider_profiles: { select: { business_name: true } },
      tickets: { select: { id: true, status: true } },
    },
  },
} satisfies Prisma.bookingsInclude

type BookingRow = Prisma.bookingsGetPayload<{ include: typeof bookingInclude }>

export default async function BookingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  let bookingRows: BookingRow[] = []

  if (session?.user) {
    const profile = await prisma.profiles.findFirst({
      where: { user_id: session.user.id },
      select: { id: true },
    })

    if (profile) {
      bookingRows = await prisma.bookings.findMany({
        where: { user_id: profile.id },
        include: bookingInclude,
        orderBy: { created_at: 'desc' },
      })
    }
  } else {
    const raw = (await cookies()).get('guest_tokens')?.value
    const guestTokens: string[] = raw ? JSON.parse(raw) : []

    if (guestTokens.length > 0) {
      bookingRows = await prisma.bookings.findMany({
        where: { guest_token: { in: guestTokens } },
        include: bookingInclude,
        orderBy: { created_at: 'desc' },
      })
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Mis Reservas</h1>
        <p className="mt-1 text-muted-foreground">
          Consulta el estado de tus reservas y accede a tus tickets QR.
        </p>
      </div>

      {bookingRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <CalendarCheck className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No tienes reservas aun</h2>
          <p className="mt-2 max-w-sm text-center text-muted-foreground">
            Cuando reserves una experiencia, podras ver el detalle y el estado aqui.
          </p>
          <Button className="mt-6" asChild>
            <Link href={ROUTES.explore}>Explorar experiencias</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookingRows.map((booking) => {
            const firstTicket = booking.booking_items.find((item) => item.tickets)?.tickets

            return (
              <Card key={booking.id}>
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-base">{booking.booking_number}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(booking.created_at)} · {formatMoney(booking.total_amount, booking.currency)}
                    </p>
                  </div>
                  <Badge variant={booking.status === 'cancelled' ? 'destructive' : 'outline'}>
                    {statusLabel(booking.status)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {booking.booking_items.map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-4 rounded-lg border p-3">
                        <div>
                          <p className="text-sm font-medium">{item.experiences?.title ?? 'Experiencia'}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.provider_profiles.business_name} · {formatDate(item.service_date)}
                          </p>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <p>{item.quantity} ticket{item.quantity === 1 ? '' : 's'}</p>
                          <p>{statusLabel(item.status)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button asChild variant="secondary" disabled={!firstTicket}>
                      <Link href={firstTicket ? ROUTES.walletTicket(firstTicket.id) : ROUTES.wallet}>
                        <Ticket className="mr-2 h-4 w-4" />
                        {firstTicket ? 'Ver QR' : 'Ver wallet'}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
