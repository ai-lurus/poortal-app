import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDestinationBySlug, getDestinationCategories } from '@/queries/destinations'
import { HomeHeader } from '@/components/home/home-header'
import { CategoryGrid } from '@/components/home/category-grid'
import { Button } from '@/components/ui/button'
import { Search, MessageSquareText } from 'lucide-react'
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

  const categories = await getDestinationCategories(destination.id)

  return (
    <div className="min-h-screen bg-background pb-20">
      <HomeHeader />

      <main className="container mx-auto max-w-md">
        {/* Greeting */}
        <div className="px-6 mt-6 mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            Welcome to {destination.name}!
            <span className="block text-primary mt-1">- Poortal</span>
          </h1>
        </div>

        {/* Search */}
        <div className="px-6 mb-8">
          <div className="relative">
            <Link href={ROUTES.explore} className="block">
              <div className="w-full bg-white rounded-full border border-slate-200 py-3.5 pl-12 pr-4 shadow-sm flex items-center text-muted-foreground/50">
                <span className="text-sm font-bold tracking-widest">ASK ANYTHING</span>
              </div>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
            </Link>
          </div>
        </div>

        {/* Categories */}
        <CategoryGrid />
      </main>

      {/* Floating Concierge Button */}
      <div className="fixed bottom-24 left-0 right-0 flex justify-center px-4 z-20 pointer-events-none">
        <Button
          size="lg"
          className="w-full max-w-xs rounded-full bg-primary text-primary-foreground text-lg font-bold h-14 shadow-lg pointer-events-auto flex items-center justify-between px-8"
        >
          <span>concierge</span>
          <MessageSquareText className="h-6 w-6 fill-current" />
        </Button>
      </div>
    </div>
  )
}
