import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Ticket } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export const metadata = {
  title: 'Detalle del Boleto',
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.wallet}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Wallet
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Detalle del Boleto</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reserva #{bookingId}
          </p>
        </div>
        <Badge variant="outline">Pendiente</Badge>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* QR Code area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Codigo QR
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="flex h-64 w-64 items-center justify-center rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                QR Code placeholder
              </p>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Presenta este codigo al proveedor para validar tu reserva
            </p>
          </CardContent>
        </Card>

        {/* Booking details */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Reserva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Experiencia</p>
              <p className="font-medium">--</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Proveedor</p>
              <p className="font-medium">--</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Fecha del servicio</p>
              <p className="font-medium">--</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Cantidad de personas</p>
              <p className="font-medium">--</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Total pagado</p>
              <p className="font-medium">$-- MXN</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge variant="outline">Pendiente</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
