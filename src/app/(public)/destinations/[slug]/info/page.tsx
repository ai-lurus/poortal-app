import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDestinationBySlug, getDestinationCategories } from '@/queries/destinations'
import { ROUTES } from '@/lib/constants'
import { HomeHeader } from '@/components/home/home-header'
import { DynamicIcon } from '@/lib/lucide-icon-map'
import {
    Shield,
    Ambulance,
    DollarSign,
    Lock,
    Landmark,
    Building,
    Bus,
    Plane,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORY_COLORS: Record<string, string> = {
    tours: 'text-indigo-500',
    sea: 'text-cyan-500',
    ride: 'text-rose-800',
    food: 'text-teal-600',
    stay: 'text-pink-500',
    party: 'text-amber-400',
    sports: 'text-orange-500',
    culture: 'text-stone-800',
    shopping: 'text-fuchsia-500',
    wellness: 'text-emerald-500',
}

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

    const categories = await getDestinationCategories(destination.id)

    // Define the grid items for "secure information"
    const secureInfoItems = [
        { icon: DollarSign, label: 'money exchange', slug: 'money-exchange', color: 'text-emerald-500' },
        { icon: Lock, label: 'local tips', slug: 'local-tips', color: 'text-teal-700' },
        { icon: Landmark, label: 'consulates', slug: 'consulates', color: 'text-slate-500' },
        { icon: Building, label: 'real estate', slug: 'real-estate', color: 'text-fuchsia-500' },
        { icon: Bus, label: 'local transport', slug: 'local-transport', color: 'text-rose-800' },
        { icon: Plane, label: 'airport', slug: 'airport', color: 'text-blue-700' },
    ]

    return (
        <div className="bg-background pb-20">
            <HomeHeader />

            <main className="container mx-auto max-w-md md:max-w-2xl px-6 pt-4">
                {/* Title */}
                <h1 className="text-[22px] md:text-3xl font-light text-center mb-5 text-foreground leading-tight">
                    <span className="text-primary font-medium">{destination.name}</span> in your pocket
                </h1>

                {/* Emergency Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    <button className="flex flex-col items-center justify-center py-3 rounded-xl bg-blue-500 text-white shadow-sm active:scale-95 transition-transform">
                        <Shield className="h-5 w-5 mb-1" />
                        <span className="text-sm font-medium">911</span>
                    </button>

                    <button className="flex flex-col items-center justify-center py-3 rounded-xl bg-red-500 text-white shadow-sm active:scale-95 transition-transform">
                        <Ambulance className="h-5 w-5 mb-1" />
                        <span className="text-sm font-medium">ambulance</span>
                    </button>
                </div>

                {/* Secure Information */}
                <div className="mb-5">
                    <h2 className="text-center text-sm font-medium text-foreground mb-2.5">secure information</h2>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {secureInfoItems.map((item, idx) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    href={ROUTES.destinationInfoCategory(destination.slug, item.slug)}
                                    key={idx}
                                    className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border bg-white shadow-sm aspect-[5/4] active:scale-95 transition-transform"
                                >
                                    <Icon className={cn("h-8 w-8", item.color)} strokeWidth={1.25} />
                                    <span className="text-[9px] font-medium text-muted-foreground text-center leading-tight">{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Recommendations */}
                {categories.length > 0 && (
                    <div className="mb-2">
                        <h2 className="text-center text-sm font-medium text-foreground mb-2.5">recommendations</h2>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {categories.map((cat) => (
                                <Link
                                    href={ROUTES.destinationInfoCategory(destination.slug, cat.slug)}
                                    key={cat.id}
                                    className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border bg-white shadow-sm aspect-[5/4] active:scale-95 transition-transform"
                                >
                                    <DynamicIcon
                                        name={cat.icon}
                                        className={cn('h-8 w-8', CATEGORY_COLORS[cat.slug] || 'text-slate-500')}
                                        strokeWidth={1.25}
                                    />
                                    <span className="text-[9px] font-medium text-muted-foreground text-center leading-tight">{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
