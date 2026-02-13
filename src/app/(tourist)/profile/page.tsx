import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getCurrentProfile } from '@/queries/profiles'
import { User } from 'lucide-react'

export const metadata = {
  title: 'Mi Perfil',
}

export default async function ProfilePage() {
  const profile = await getCurrentProfile()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="mt-1 text-muted-foreground">
          Administra tu informacion personal
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Avatar area */}
        <Card>
          <CardContent className="flex flex-col items-center py-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">
              {profile?.full_name || 'Usuario'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {profile?.role || 'tourist'}
            </p>
          </CardContent>
        </Card>

        {/* Profile form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informacion Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Nombre completo
              </label>
              <div className="rounded-md border px-3 py-2 text-sm">
                {profile?.full_name || '--'}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Correo electronico
              </label>
              <div className="rounded-md border px-3 py-2 text-sm">
                {profile?.email || '--'}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Telefono
              </label>
              <div className="rounded-md border px-3 py-2 text-sm">
                {profile?.phone || '--'}
              </div>
            </div>

            <Separator />

            <Button disabled>
              Editar perfil
            </Button>
            <p className="text-xs text-muted-foreground">
              La edicion de perfil se habilitara proximamente
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
