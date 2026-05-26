import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import { getProviderBookingStats } from '@/queries/bookings'
import { getMonthlyBookingStats } from '@/queries/analytics'
import prisma from '@/lib/prisma'
import { POORTAL_FEE_PERCENTAGE, SELLER_SERVICE_SHARE_PERCENTAGE } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, TrendingUp, Wallet, Calendar } from 'lucide-react'
import { PaymentsRevenueChart } from '@/components/provider/payments-chart'

export const metadata = { title: 'Mis Pagos' }

function formatMoney(amount: number, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(amount)
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default async function ProviderPaymentsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) redirect('/register/provider')

  const [stats, transferPayments, monthlyStats] = await Promise.all([
    getProviderBookingStats(provider.id),
    prisma.payments.findMany({
      where: {
        type: 'transfer',
        booking_items: { provider_id: provider.id },
      },
      include: {
        booking_items: {
          include: {
            experiences: { select: { title: true } },
            bookings: {
              select: {
                booking_number: true,
                profiles: { select: { full_name: true, email: true } },
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    }),
    getMonthlyBookingStats(provider.id, 6),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <CreditCard className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Mis Pagos</h1>
          <p className="text-muted-foreground">Historial de ingresos y resumen financiero</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del mes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(stats.netMonthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Bruto: {formatMoney(stats.monthlyRevenue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(stats.netRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalBookings} reservas completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Balance disponible</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {provider.stripe_onboarding_complete ? formatMoney(0) : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              {provider.stripe_onboarding_complete
                ? 'Disponible para retiro'
                : 'Configura Stripe para recibir pagos'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Modelo Poortal</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{POORTAL_FEE_PERCENTAGE}% / {SELLER_SERVICE_SHARE_PERCENTAGE}%</div>
            <p className="text-xs text-muted-foreground">Poortal / share adicional al proveedor</p>
          </CardContent>
        </Card>
      </div>

      {!provider.stripe_onboarding_complete && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Configura tu cuenta Stripe</strong> para empezar a recibir pagos directamente en tu cuenta bancaria.
          Completa el proceso de onboarding desde la seccion de configuracion.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Ingresos netos — últimos 6 meses</CardTitle>
          <p className="text-xs text-muted-foreground">Precio publicado + {SELLER_SERVICE_SHARE_PERCENTAGE}% cuando el pago se transfiere</p>
        </CardHeader>
        <CardContent>
          <PaymentsRevenueChart data={monthlyStats} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          {transferPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">
                Aun no hay transferencias registradas para este proveedor.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <div className="grid grid-cols-5 gap-4 border-b bg-muted/50 px-4 py-3 text-xs font-medium text-muted-foreground">
                <span className="col-span-2">Experiencia / Fecha servicio</span>
                <span>Cliente</span>
                <span>Estado</span>
                <span className="text-right">Monto neto</span>
              </div>
              <div className="divide-y">
                {transferPayments.map((payment) => {
                  const item = payment.booking_items
                  if (!item) return null
                  return (
                    <div key={payment.id} className="grid grid-cols-5 gap-4 px-4 py-3 text-sm items-center">
                      <div className="col-span-2">
                        <p className="font-medium truncate">{item.experiences?.title ?? 'Experiencia'}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(item.service_date)}</p>
                      </div>
                      <span className="text-sm text-muted-foreground truncate">
                        {item.bookings?.profiles?.full_name ?? item.bookings?.profiles?.email ?? '--'}
                      </span>
                      <Badge variant="outline" className="w-fit text-xs">
                        {payment.status === 'succeeded' ? 'Transferida' : payment.status}
                      </Badge>
                      <span className="text-right font-medium text-green-700 dark:text-green-400">
                        {formatMoney(Number(payment.amount), payment.currency)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
