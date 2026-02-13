import type { Metadata } from 'next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Plus, Compass, Building2, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gestion de Destinos',
}

export default function AdminDestinationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion de Destinos
          </h1>
          <p className="mt-1 text-muted-foreground">
            Administra los destinos disponibles en la plataforma
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Destino
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Cancun
              </CardTitle>
              <Badge>Activo</Badge>
            </div>
            <CardDescription>
              Quintana Roo, Mexico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Compass className="h-4 w-4" />
                  Experiencias
                </span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Proveedores
                </span>
                <span className="font-medium">47</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Visitantes este mes
                </span>
                <span className="font-medium">1,284</span>
              </div>
              <div className="pt-3 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  Administrar destino
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
