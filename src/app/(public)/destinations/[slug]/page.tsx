import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDestinationBySlug, getDestinationCategories } from '@/queries/destinations'
import { getExperiencesByDestination } from '@/queries/experiences'
import { ExperienceGrid } from '@/components/experiences/experience-grid'
import { ExperienceCardCompact } from '@/components/experiences/experience-card-compact'
import { DynamicIcon } from '@/lib/lucide-icon-map'
import { MapPin, Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)
  return {
    title: destination?.name || 'Destino',
  }
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)

  if (!destination) notFound()

  const [categories, experiences] = await Promise.all([
    getDestinationCategories(destination.id),
    getExperiencesByDestination(destination.id),
  ])

  return (
    <div>
      {/* Header compacto */}
      <header className="pt-4 pb-2 md:pt-8 md:pb-4">
        <div className="w-full px-4 md:container md:mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs">{destination.country}</span>
              </div>
              <h1 className="mt-1 text-xl font-bold md:text-3xl">
                {destination.name}
              </h1>
            </div>
            <Link href={ROUTES.explore}>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {destination.description && (
            <p className="mt-2 hidden text-muted-foreground md:block md:max-w-2xl">
              {destination.description}
            </p>
          )}
        </div>
      </header>

      {/* Barra de busqueda (mobile) */}
      <div className="px-4 py-3 md:hidden">
        <Link
          href={ROUTES.explore}
          className="flex items-center gap-3 rounded-full border bg-muted/50 px-4 py-2.5 w-full max-w-full"
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground shadow-sm" />
          <span className="text-sm text-muted-foreground truncate min-w-0">
            Que quieres hacer en {destination.name}?
          </span>
        </Link>
      </div>

      {/* Grid de categorias */}
      {categories.length > 0 && (
        <section className="py-4 md:py-8">
          <div className="w-full px-4 md:container md:mx-auto">
            <h2 className="text-lg font-bold md:text-2xl">Categorias</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 md:mt-4 md:flex md:flex-wrap md:gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`${ROUTES.explore}?category=${cat.slug}`}
                  className="flex flex-col items-center gap-1.5 min-w-0 w-full"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 md:h-16 md:w-16">
                    <DynamicIcon
                      name={cat.icon}
                      className="h-6 w-6 text-primary md:h-7 md:w-7"
                    />
                  </div>
                  <span className="text-center text-[11px] font-medium leading-tight md:text-xs w-full break-words px-1">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experiencias populares */}
      <section className="py-4 md:py-8">
        <div className="w-full px-4 md:container md:mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold md:text-2xl">
              Experiencias populares
            </h2>
            <Button variant="ghost" size="sm" asChild className="shrink-0">
              <Link href={ROUTES.explore}>
                Ver todo <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll horizontal (mobile) */}
        {experiences.length > 0 ? (
          <>
            <div className="mt-3 flex gap-3 overflow-x-auto px-4 scrollbar-hide md:hidden w-full max-w-full">
              {experiences.map((exp) => (
                <ExperienceCardCompact key={exp.id} experience={exp} />
              ))}
            </div>

            {/* Grid normal (desktop) */}
            <div className="container mx-auto mt-6 hidden px-4 md:block">
              <ExperienceGrid
                experiences={experiences}
                emptyMessage="Pronto habra experiencias disponibles en este destino."
              />
            </div>
          </>
        ) : (
          <div className="container mx-auto mt-4 px-4">
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
              <p className="text-sm text-muted-foreground">
                Pronto habra experiencias disponibles en este destino.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
