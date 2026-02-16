import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getDestinationBySlug, getDestinationCategories } from '@/queries/destinations'
import { getExperiencesByDestination } from '@/queries/experiences'
import { ExperienceCardCompact } from '@/components/experiences/experience-card-compact'
import { DynamicIcon } from '@/lib/lucide-icon-map'
import { Search, Mic, MessageCircle, ShoppingCart, ArrowRight } from 'lucide-react'
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
    <div className="mx-auto max-w-md pb-24 md:max-w-7xl md:px-8">
      {/* Inline header — mobile only */}
      <header className="flex items-center justify-between px-5 pt-4 md:hidden">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="POORTAL"
            width={28}
            height={28}
            className="rounded"
          />
          <span className="text-lg font-bold tracking-tight text-primary">
            POORTAL
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Avatar placeholder */}
          <div className="h-8 w-8 rounded-full bg-amber-200" />
          <Link href={ROUTES.cart}>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </Link>
        </div>
      </header>

      {/* Welcome */}
      <section className="px-5 pt-6 md:pt-10 md:text-center">
        <h1 className="text-2xl font-bold md:text-4xl">
          Welcome to{' '}
          <span className="text-primary">{destination.name}!</span>
        </h1>
        <div className="mt-1 inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary md:mt-2 md:text-xs">
          POORTAL
        </div>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          I&apos;m your digital <strong>concierge</strong> so...
        </p>
      </section>

      {/* Search pill — mobile only */}
      <div className="px-5 py-4 md:hidden">
        <Link
          href={ROUTES.explore}
          className="flex items-center gap-3 rounded-full border bg-muted/50 px-4 py-2.5"
        >
          <span className="flex-1 text-sm font-medium text-muted-foreground">
            ASK ANYTHING
          </span>
          <Mic className="h-4 w-4 text-muted-foreground" />
          <Search className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      {/* Category grid — 2 columns */}
      {categories.length > 0 && (
        <section className="px-5 md:mt-8">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${ROUTES.explore}?category=${cat.slug}`}
                className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <DynamicIcon
                  name={cat.icon}
                  className="h-5 w-5 shrink-0 text-primary"
                />
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Concierge button */}
      <div className="flex justify-center py-5 md:py-10">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-105"
        >
          <MessageCircle className="h-4 w-4" />
          concierge
        </button>
      </div>

      {/* Recommended for you */}
      {experiences.length > 0 && (
        <section className="px-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Recommended for you</h2>
            <Link
              href={ROUTES.explore}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              See all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
            {experiences.map((exp) => (
              <ExperienceCardCompact
                key={exp.id}
                experience={exp}
                className="md:w-full"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
