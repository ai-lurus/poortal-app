import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Ticket } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export const metadata = {
  title: 'Mi Wallet',
}

export default function WalletPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Mi Wallet</h1>
        <p className="mt-1 text-muted-foreground">
          Tus boletos digitales y codigos QR para acceder a tus experiencias
        </p>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-20">
        <Ticket className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">No tienes boletos aun</h2>
        <p className="mt-2 max-w-sm text-center text-muted-foreground">
          Cuando completes una reserva, tus boletos digitales y codigos QR
          aparecaran aqui para un acceso rapido
        </p>
        <Button className="mt-6" asChild>
          <Link href={ROUTES.explore}>Explorar experiencias</Link>
        </Button>
      </div>

      {/* Placeholder ticket cards - hidden by default, shown when tickets exist */}
      {/* Example of how a ticket card would look */}
      <div className="hidden">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
              <Ticket className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold">Nombre de Experiencia</h3>
              <p className="text-sm text-muted-foreground">
                Fecha del servicio
              </p>
            </div>
            <Badge>Activo</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
