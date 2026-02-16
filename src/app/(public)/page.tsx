import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import {
  Compass,
  Waves,
  Car,
  Utensils,
  Heart,
  Moon,
  Dumbbell,
  Landmark,
  ShoppingBag,
  Sparkles,
  Search,
  ArrowRight,
} from 'lucide-react'

const categories = [
  { name: 'tours', icon: Compass, slug: 'tours' },
  { name: 'sea', icon: Waves, slug: 'sea' },
  { name: 'ride', icon: Car, slug: 'ride' },
  { name: 'food', icon: Utensils, slug: 'food' },
  { name: 'stay', icon: Heart, slug: 'stay' },
  { name: 'party', icon: Moon, slug: 'party' },
  { name: 'sports', icon: Dumbbell, slug: 'sports' },
  { name: 'culture', icon: Landmark, slug: 'culture' },
  { name: 'shopping', icon: ShoppingBag, slug: 'shopping' },
  { name: 'wellness', icon: Sparkles, slug: 'wellness' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Descubre experiencias
            <span className="block text-primary">increibles</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Tu concierge digital para Cancun. Tours, actividades, restaurantes y
            mas — todo verificado y en un solo lugar.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-xl">
            <Link href={ROUTES.explore}>
              <div className="flex items-center gap-2 rounded-full border bg-background px-6 py-3 shadow-sm transition-shadow hover:shadow-md">
                <Search className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Que quieres hacer en Cancun?
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Explora por categoria</h2>
            <p className="mt-1 text-muted-foreground">
              Encuentra exactamente lo que buscas
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href={ROUTES.explore}>
              Ver todo <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`${ROUTES.explore}?category=${category.slug}`}
            >
              <Card className="transition-shadow hover:shadow-md cursor-pointer">
                <CardContent className="flex flex-col items-center gap-3 p-6">
                  <div className="rounded-full bg-primary/10 p-3">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-center">
                    {category.name}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Destination CTA */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold">Cancun te espera</h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            Playas de arena blanca, aguas turquesa y cultura maya. Descubre
            aventuras acuaticas, gastronomia increible y vida nocturna vibrante.
          </p>
          <Button className="mt-6" size="lg" asChild>
            <Link href={ROUTES.destination('cancun')}>
              Explorar Cancun <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Provider CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center md:flex-row md:text-left">
            <div className="flex-1">
              <h3 className="text-xl font-bold">Eres proveedor de servicios turisticos?</h3>
              <p className="mt-2 text-muted-foreground">
                Registra tu negocio en POORTAL y llega a miles de turistas. Proceso
                simple, pagos seguros y herramientas para gestionar tus servicios.
              </p>
            </div>
            <Button variant="outline" size="lg" asChild>
              <Link href="/register/provider">Registrar mi negocio</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
