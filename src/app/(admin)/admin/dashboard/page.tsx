import type { Metadata } from 'next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Users,
  Building2,
  Compass,
  CalendarCheck,
  DollarSign,
  AlertTriangle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
}

const stats = [
  {
    title: 'Total usuarios',
    value: '1,284',
    description: '+12% vs mes anterior',
    icon: Users,
  },
  {
    title: 'Proveedores activos',
    value: '47',
    description: '3 pendientes de aprobacion',
    icon: Building2,
  },
  {
    title: 'Experiencias activas',
    value: '156',
    description: '8 en revision',
    icon: Compass,
  },
  {
    title: 'Reservas del mes',
    value: '342',
    description: '+28% vs mes anterior',
    icon: CalendarCheck,
  },
  {
    title: 'Ingresos del mes',
    value: '$485,200 MXN',
    description: 'Comision: $48,520 MXN',
    icon: DollarSign,
  },
  {
    title: 'Disputas pendientes',
    value: '3',
    description: '2 urgentes',
    icon: AlertTriangle,
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Panel de Administracion
        </h1>
        <p className="mt-1 text-muted-foreground">
          Resumen general de la plataforma POORTAL
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
