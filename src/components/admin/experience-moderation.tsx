'use client'

import { useActionState } from 'react'
import { approveExperienceAction, rejectExperienceAction, toggleFeaturedAction, type AdminActionState } from '@/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Compass, CheckCircle2, XCircle, Star } from 'lucide-react'

type ExperienceRow = {
  id: string
  title: string
  slug: string
  status: string
  is_featured?: boolean
  price_amount: number
  price_currency: string
  created_at: string
  provider_profiles: { business_name: string } | null
  categories: { name: string } | null
}

interface ExperienceModerationProps {
  experiences: ExperienceRow[]
  showActions?: boolean
  emptyMessage?: string
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Borrador', variant: 'outline' },
  pending_review: { label: 'En revision', variant: 'secondary' },
  active: { label: 'Activa', variant: 'default' },
  paused: { label: 'Pausada', variant: 'outline' },
  rejected: { label: 'Rechazada', variant: 'destructive' },
  archived: { label: 'Archivada', variant: 'outline' },
}

export function ExperienceModeration({ experiences, showActions, emptyMessage }: ExperienceModerationProps) {
  if (experiences.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Compass className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">
            {emptyMessage || 'No hay experiencias.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {experiences.map((exp) => (
        <ExperienceRow key={exp.id} experience={exp} showActions={showActions} />
      ))}
    </div>
  )
}

function ExperienceRow({
  experience,
  showActions,
}: {
  experience: ExperienceRow
  showActions?: boolean
}) {
  const [approveState, approveAction, isApproving] = useActionState<AdminActionState, FormData>(
    approveExperienceAction,
    {}
  )
  const [rejectState, rejectAction, isRejecting] = useActionState<AdminActionState, FormData>(
    rejectExperienceAction,
    {}
  )
  const [featuredState, featuredAction, isTogglingFeatured] = useActionState<AdminActionState, FormData>(
    toggleFeaturedAction,
    {}
  )

  const status = statusLabels[experience.status] || { label: experience.status, variant: 'outline' as const }
  const message = approveState.success || approveState.error || rejectState.success || rejectState.error || featuredState.success || featuredState.error

  const formatPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: experience.price_currency || 'MXN',
    minimumFractionDigits: 0,
  }).format(Number(experience.price_amount))

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{experience.title}</CardTitle>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <span>{experience.provider_profiles?.business_name || 'Proveedor desconocido'}</span>
              <span>&middot;</span>
              <span>{experience.categories?.name}</span>
              <span>&middot;</span>
              <span>{formatPrice}</span>
            </div>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
          {message && (
            <div className={`rounded-md p-2 text-sm ${
              approveState.success || rejectState.success
                ? 'bg-green-500/10 text-green-700'
                : 'bg-destructive/10 text-destructive'
            }`}>
              {message}
            </div>
          )}

          {showActions && (
            <div className="flex gap-2">
              <form action={approveAction}>
                <input type="hidden" name="experience_id" value={experience.id} />
                <Button size="sm" disabled={isApproving}>
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  {isApproving ? 'Aprobando...' : 'Aprobar'}
                </Button>
              </form>
              <form action={rejectAction} className="flex gap-2">
                <input type="hidden" name="experience_id" value={experience.id} />
                <Input
                  name="rejection_reason"
                  placeholder="Motivo de rechazo..."
                  className="w-56"
                />
                <Button variant="destructive" size="sm" disabled={isRejecting}>
                  <XCircle className="mr-1 h-4 w-4" />
                  {isRejecting ? 'Rechazando...' : 'Rechazar'}
                </Button>
              </form>
            </div>
          )}

          {/* Featured toggle — visible for active experiences */}
          {experience.status === 'active' && (
            <form action={featuredAction}>
              <input type="hidden" name="experience_id" value={experience.id} />
              <input type="hidden" name="is_featured" value={String(experience.is_featured ?? false)} />
              <Button
                variant={experience.is_featured ? 'default' : 'outline'}
                size="sm"
                disabled={isTogglingFeatured}
              >
                <Star className={`mr-1 h-4 w-4 ${experience.is_featured ? 'fill-current' : ''}`} />
                {experience.is_featured ? 'En recomendaciones' : 'Agregar a recomendaciones'}
              </Button>
            </form>
          )}
        </CardContent>
    </Card>
  )
}
