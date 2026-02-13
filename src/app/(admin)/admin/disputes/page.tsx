import type { Metadata } from 'next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Disputas y Reclamaciones',
}

export default function AdminDisputesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Disputas y Reclamaciones
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona las disputas entre turistas y proveedores
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="destructive">Urgentes: 2</Badge>
        <Badge variant="secondary">En proceso: 1</Badge>
        <Badge variant="outline">Resueltas este mes: 8</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disputas activas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <h3 className="mt-6 text-lg font-medium">
              3 disputas requieren atencion
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Las disputas pendientes aparenceran aqui con los detalles del
              turista, proveedor y motivo de la reclamacion. Podras mediar
              y resolver cada caso.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
