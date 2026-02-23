import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDestinationBySlug } from '@/queries/destinations'
import { ROUTES } from '@/lib/constants'
import { HomeHeader } from '@/components/home/home-header'
import {
    Shield,
    Ambulance,
    DollarSign,
    Lock,
    Landmark,
    Building,
    Bus,
    Plane,
    Utensils,
    PartyPopper,
    Church,
    PawPrint,
    Apple,
    Mountain
} from 'lucide-react'
import { cn } from '@/lib/utils'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const destination = await getDestinationBySlug(slug)
    return {
        title: `Info - ${destination?.name || 'Destino'}`,
    }
}

export default async function DestinationInfoPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const destination = await getDestinationBySlug(slug)

    if (!destination) notFound()

    // Define the grid items for "secure information"
    const secureInfoItems = [
        { icon: DollarSign, label: 'money exchange', slug: 'money-exchange', color: 'text-emerald-500' },
        { icon: Lock, label: 'local tips', slug: 'local-tips', color: 'text-teal-700' },
        { icon: Landmark, label: 'consulates', slug: 'consulates', color: 'text-slate-500' },
        { icon: Building, label: 'real estate', slug: 'real-estate', color: 'text-fuchsia-500' },
        { icon: Bus, label: 'local transport', slug: 'local-transport', color: 'text-rose-800' },
        { icon: Plane, label: 'airport', slug: 'airport', color: 'text-blue-700' },
    ]

    // Define the grid items for "recommendations"
    const recommendationsItems = [
        { icon: Utensils, label: 'restaurants', slug: 'restaurants', color: 'text-teal-600' },
        { icon: PartyPopper, label: 'night life', slug: 'night-life', color: 'text-amber-400' },
        { icon: Church, label: 'religion', slug: 'religion', color: 'text-slate-400' },
        { icon: PawPrint, label: 'pet friendly', slug: 'pet-friendly', color: 'text-amber-800' },
        { icon: Apple, label: 'wellness', slug: 'wellness', color: 'text-red-500' },
        { icon: Mountain, label: 'attractions', slug: 'attractions', color: 'text-stone-800' },
    ]

    return (
        <div className="min-h-screen bg-background pb-24">
            <HomeHeader />

            <main className="container mx-auto max-w-md px-6 pt-6">
                {/* Title */}
                <h1 className="text-3xl font-light text-center mb-10 text-foreground">
                    <span className="text-primary font-medium">{destination.name}</span> in your pocket
                </h1>

                {/* Emergency Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button className="flex flex-col items-center justify-center py-4 rounded-xl bg-blue-500 text-white shadow-sm active:scale-95 transition-transform">
                        <Shield className="h-6 w-6 mb-1.5" />
                        <span className="text-sm font-medium">911</span>
                    </button>

                    <button className="flex flex-col items-center justify-center py-4 rounded-xl bg-red-500 text-white shadow-sm active:scale-95 transition-transform">
                        <Ambulance className="h-6 w-6 mb-1.5" />
                        <span className="text-sm font-medium">ambulance</span>
                    </button>
                </div>

                {/* Secure Information */}
                <div className="mb-8">
                    <h2 className="text-center text-sm text-foreground mb-4">secure information</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {secureInfoItems.map((item, idx) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    href={ROUTES.destinationInfoCategory(destination.slug, item.slug)}
                                    // Use 'border bg-white shadow-sm' to maintain the exact look
                                    key={idx}
                                    className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border bg-white shadow-sm aspect-square active:scale-95 transition-transform"
                                >
                                    <Icon className={cn("h-6 w-6", item.color)} strokeWidth={1.5} />
                                    <span className="text-[10px] text-muted-foreground text-center leading-tight">{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Recommendations */}
                <div>
                    <h2 className="text-center text-sm text-foreground mb-4">recommendations</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {recommendationsItems.map((item, idx) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    href={ROUTES.destinationInfoCategory(destination.slug, item.slug)}
                                    key={idx}
                                    className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border bg-white shadow-sm aspect-square active:scale-95 transition-transform"
                                >
                                    <Icon className={cn("h-6 w-6", item.color)} strokeWidth={1.5} />
                                    <span className="text-[10px] text-muted-foreground text-center leading-tight">{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </main>
        </div>
    )
}
