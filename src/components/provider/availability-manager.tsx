'use client'

import { useActionState } from 'react'
import { addAvailabilityAction, type ExperienceActionState } from '@/actions/experiences'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Calendar, Clock, Plus } from 'lucide-react'

interface AvailabilitySlot {
  id: string
  date: string
  start_time: string
  end_time: string | null
  total_spots: number
  booked_spots: number
  price_override: number | null
  is_blocked: boolean
}

interface AvailabilityManagerProps {
  experienceId: string
  availability: AvailabilitySlot[]
}

export function AvailabilityManager({ experienceId, availability }: AvailabilityManagerProps) {
  const [state, formAction, isPending] = useActionState<ExperienceActionState, FormData>(
    addAvailabilityAction,
    {}
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00')
    return date.toLocaleDateString('es-MX', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Disponibilidad
        </CardTitle>
        <CardDescription>
          Agrega fechas y horarios en los que esta experiencia estara disponible.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {state.error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </div>
        )}
        {state.success && (
          <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700">
            {state.success}
          </div>
        )}

        {/* Existing slots */}
        {availability.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Fechas programadas</h4>
            {availability.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-md border p-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatDate(slot.date)}</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {slot.start_time.slice(0, 5)}
                    {slot.end_time && ` - ${slot.end_time.slice(0, 5)}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={slot.booked_spots > 0 ? 'default' : 'secondary'}>
                    {slot.booked_spots}/{slot.total_spots} reservados
                  </Badge>
                  {slot.price_override && (
                    <Badge variant="outline">
                      ${Number(slot.price_override).toLocaleString()}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add new slot */}
        <form action={formAction} className="space-y-4 rounded-md border p-4">
          <h4 className="flex items-center gap-2 text-sm font-medium">
            <Plus className="h-4 w-4" />
            Agregar disponibilidad
          </h4>
          <input type="hidden" name="experience_id" value={experienceId} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="avail_date">Fecha *</Label>
              <Input
                id="avail_date"
                name="date"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avail_start">Hora inicio *</Label>
              <Input
                id="avail_start"
                name="start_time"
                type="time"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="avail_end">Hora fin</Label>
              <Input
                id="avail_end"
                name="end_time"
                type="time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avail_spots">Lugares disponibles *</Label>
              <Input
                id="avail_spots"
                name="total_spots"
                type="number"
                min={1}
                defaultValue={10}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avail_price">Precio especial</Label>
              <Input
                id="avail_price"
                name="price_override"
                type="number"
                step="0.01"
                placeholder="Dejar vacio para precio base"
              />
            </div>
          </div>

          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? 'Agregando...' : 'Agregar Fecha'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
