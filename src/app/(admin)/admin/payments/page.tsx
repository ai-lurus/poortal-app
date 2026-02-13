import type { Metadata } from 'next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  ArrowDownToLine,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pagos de la Plataforma',
}

const summaryCards = [
  {
    title: 'Ingresos totales',
    value: '$485,200 MXN',
    description: 'Este mes',
    icon: DollarSign,
  },
  {
    title: 'Comision POORTAL',
    value: '$48,520 MXN',
    description: '10% promedio',
    icon: TrendingUp,
  },
  {
    title: 'Pagos procesados',
    value: '342',
    description: 'Este mes',
    icon: CreditCard,
  },
  {
    title: 'Pagos a proveedores',
    value: '$436,680 MXN',
    description: 'Pendientes de liquidar: 12',
    icon: ArrowDownToLine,
  },
]

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Pagos de la Plataforma
        </h1>
        <p className="mt-1 text-muted-foreground">
          Resumen de transacciones, comisiones y pagos a proveedores
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-6 gap-4 border-b bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground">
              <div>ID</div>
              <div>Turista</div>
              <div>Proveedor</div>
              <div>Monto</div>
              <div>Comision</div>
              <div>Estado</div>
            </div>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">
                Historial de transacciones
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Las transacciones recientes se mostraran aqui
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
