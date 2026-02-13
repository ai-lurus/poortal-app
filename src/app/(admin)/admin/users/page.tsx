import type { Metadata } from 'next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gestion de Usuarios',
}

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion de Usuarios
        </h1>
        <p className="mt-1 text-muted-foreground">
          Administra los usuarios registrados en la plataforma
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o telefono..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Total: 1,284</Badge>
          <Badge variant="secondary">Turistas: 1,230</Badge>
          <Badge variant="secondary">Proveedores: 47</Badge>
          <Badge variant="secondary">Admins: 7</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-6 gap-4 border-b bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground">
              <div>Nombre</div>
              <div>Email</div>
              <div>Rol</div>
              <div>Registro</div>
              <div>Estado</div>
              <div>Acciones</div>
            </div>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">
                Tabla de usuarios
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                El listado completo de usuarios registrados se cargara aqui
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
