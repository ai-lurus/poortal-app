import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarCheck, Clock, CheckCircle2, CircleCheck } from 'lucide-react'

export const metadata = {
  title: 'Gestionar Reservas',
}

function EmptyTabContent({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <CalendarCheck className="h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  )
}

export default function ProviderBookingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <CalendarCheck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Gestionar Reservas</h1>
          <p className="text-muted-foreground">
            Administra las reservas de tus experiencias
          </p>
        </div>
      </div>

      <Tabs defaultValue="pendientes">
        <TabsList>
          <TabsTrigger value="pendientes" className="gap-1.5">
            <Clock className="h-4 w-4" />
            Pendientes
          </TabsTrigger>
          <TabsTrigger value="confirmadas" className="gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            Confirmadas
          </TabsTrigger>
          <TabsTrigger value="completadas" className="gap-1.5">
            <CircleCheck className="h-4 w-4" />
            Completadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes">
          <EmptyTabContent message="No tienes reservas pendientes por confirmar." />
        </TabsContent>

        <TabsContent value="confirmadas">
          <EmptyTabContent message="No tienes reservas confirmadas en este momento." />
        </TabsContent>

        <TabsContent value="completadas">
          <EmptyTabContent message="Aun no tienes reservas completadas." />
        </TabsContent>
      </Tabs>
    </div>
  )
}
