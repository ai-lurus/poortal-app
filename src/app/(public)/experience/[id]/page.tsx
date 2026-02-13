import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getExperienceById, getExperienceAvailability } from '@/queries/experiences'
import { Badge } from '@/components/ui/badge'
import { ImageCarousel } from '@/components/shared/image-carousel'
import { StarRating } from '@/components/shared/star-rating'
import { BookingSidebar } from './booking-sidebar'
import {
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  Store,
} from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const experience = await getExperienceById(id)
  return {
    title: experience?.title || 'Experiencia',
  }
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const experience = await getExperienceById(id)

  if (!experience || (experience.status !== 'active' && experience.status !== 'pending_review')) {
    notFound()
  }

  const availability = await getExperienceAvailability(id)

  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: experience.price_currency || 'MXN',
    minimumFractionDigits: 0,
  }).format(Number(experience.price_amount))

  const pricingLabel =
    experience.pricing_type === 'per_person'
      ? 'por persona'
      : experience.pricing_type === 'per_group'
        ? 'por grupo'
        : 'tarifa fija'

  const cancellationLabels: Record<string, string> = {
    flexible: 'Flexible - Reembolso total hasta 48h antes',
    moderate: 'Moderada - Reembolso total hasta 5 dias antes',
    strict: 'Estricta - Reembolso parcial hasta 7 dias antes',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Carousel */}
          <ImageCarousel images={experience.experience_images || []} />

          {/* Title & meta */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {experience.categories?.name && (
                <Badge variant="secondary">{experience.categories.name}</Badge>
              )}
              {experience.subcategories?.name && (
                <Badge variant="outline">{experience.subcategories.name}</Badge>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-bold">{experience.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <StarRating
                rating={Number(experience.average_rating)}
                reviewCount={experience.review_count}
              />
              {experience.duration_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {experience.duration_minutes >= 60
                    ? `${Math.floor(experience.duration_minutes / 60)}h${experience.duration_minutes % 60 > 0 ? ` ${experience.duration_minutes % 60}m` : ''}`
                    : `${experience.duration_minutes} min`}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Hasta {experience.max_capacity} personas
              </span>
            </div>

            {/* Provider */}
            {experience.provider_profiles && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Por</span>
                <span className="font-medium">{experience.provider_profiles.business_name}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold">Descripcion</h2>
            <p className="mt-2 whitespace-pre-line text-muted-foreground">
              {experience.description}
            </p>
          </div>

          {/* Highlights */}
          {experience.highlights && (experience.highlights as string[]).length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">Puntos destacados</h2>
              <ul className="mt-3 space-y-2">
                {(experience.highlights as string[]).map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Includes / Excludes */}
          <div className="grid gap-6 sm:grid-cols-2">
            {experience.includes && (experience.includes as string[]).length > 0 && (
              <div>
                <h3 className="font-semibold">Incluye</h3>
                <ul className="mt-2 space-y-1.5">
                  {(experience.includes as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {experience.excludes && (experience.excludes as string[]).length > 0 && (
              <div>
                <h3 className="font-semibold">No incluye</h3>
                <ul className="mt-2 space-y-1.5">
                  {(experience.excludes as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Requirements */}
          {experience.requirements && (experience.requirements as string[]).length > 0 && (
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                Requisitos
              </h3>
              <ul className="mt-2 space-y-1.5">
                {(experience.requirements as string[]).map((req, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    &bull; {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meeting point */}
          {experience.meeting_point && (
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Punto de encuentro
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{experience.meeting_point}</p>
            </div>
          )}

          {/* Cancellation policy */}
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Politica de cancelacion
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {cancellationLabels[experience.cancellation_policy] || experience.cancellation_policy}
            </p>
          </div>
        </div>

        {/* Booking sidebar */}
        <div>
          <BookingSidebar
            experience={{
              id: experience.id,
              title: experience.title,
              shortDescription: experience.short_description,
              coverImageUrl: experience.experience_images?.find(i => i.is_cover)?.url || experience.experience_images?.[0]?.url || null,
              providerName: experience.provider_profiles?.business_name || '',
              providerId: experience.provider_profiles?.id || '',
              priceAmount: Number(experience.price_amount),
              priceCurrency: experience.price_currency,
              pricingType: experience.pricing_type,
              maxCapacity: experience.max_capacity,
            }}
            availability={availability}
            formattedPrice={formattedPrice}
            pricingLabel={pricingLabel}
          />
        </div>
      </div>
    </div>
  )
}
