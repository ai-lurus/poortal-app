import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getProviderByUserId } from '@/queries/providers'
import { getExperiencesByProvider } from '@/queries/experiences'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  CalendarCheck,
  DollarSign,
  Star,
  Package,
  Plus,
  Pencil,
} from 'lucide-react'
import type { Experience } from '@/types'

export const metadata = {
  title: 'Dashboard Proveedor',
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Borrador', variant: 'outline' },
  pending_review: { label: 'En revision', variant: 'secondary' },
  active: { label: 'Activa', variant: 'default' },
  paused: { label: 'Pausada', variant: 'outline' },
  rejected: { label: 'Rechazada', variant: 'destructive' },
  archived: { label: 'Archivada', variant: 'outline' },
}

export default async function ProviderDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const provider = await getProviderByUserId(user.id)
  if (!provider) redirect('/register/provider')

  const experiences = await getExperiencesByProvider(provider.id)

  const activeCount = experiences.filter(e => e.status === 'active').length
  const avgRating = experiences.length
    ? (experiences.reduce((sum, e) => sum + Number(e.average_rating), 0) / experiences.length).toFixed(1)
    : '--'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">{provider.business_name}</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/provider/experiences/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Experiencia
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reservas del mes</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Disponible en Fase 3</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Disponible en Fase 3</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rating promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating}</div>
            <p className="text-xs text-muted-foreground">{experiences.length} experiencias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Experiencias activas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">de {experiences.length} totales</p>
          </CardContent>
        </Card>
      </div>

      {/* Experiences list */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Experiencias</CardTitle>
        </CardHeader>
        <CardContent>
          {experiences.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Aun no tienes experiencias</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Crea tu primera experiencia para empezar a recibir reservas.
              </p>
              <Button asChild className="mt-4">
                <Link href="/provider/experiences/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Experiencia
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {experiences.map((exp) => {
                const status = statusLabels[exp.status] || { label: exp.status, variant: 'outline' as const }
                return (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between rounded-md border p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{exp.title}</span>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        ${Number(exp.price_amount).toLocaleString()} {exp.price_currency}
                        {exp.review_count > 0 && (
                          <> &middot; {Number(exp.average_rating).toFixed(1)} ({exp.review_count} resenas)</>
                        )}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/provider/experiences/${exp.id}/edit`}>
                        <Pencil className="mr-1 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
