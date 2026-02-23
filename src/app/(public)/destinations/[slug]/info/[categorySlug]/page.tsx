import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getDestinationBySlug } from '@/queries/destinations'
import { ROUTES } from '@/lib/constants'
import { InfoCard } from '@/components/destinations/info-card'
import { LocalTipCard } from '@/components/destinations/local-tip-card'
import { RestaurantCard } from '@/components/destinations/restaurant-card'
import { cn } from '@/lib/utils'

import {
    DollarSign,
    Landmark,
    Building,
    Lock,
    Bus,
    Plane,
    Utensils,
    Moon,
    HeartPulse,
    Star,
    Church,
    PawPrint
} from 'lucide-react'

// Define a type for our category data to avoid 'any'
type CategoryItem = {
    title: string;
    description: (string | React.ReactNode)[];
    visual?: React.ReactNode;
    author?: string;
    date?: string;
    images?: number;
    moreInfoLink?: string;
    actions?: {
        time?: boolean;
        share?: boolean;
        map?: boolean;
        phone?: boolean;
        web?: boolean;
    };
};

type CategoryData = {
    title: string;
    icon: React.ElementType;
    color: string;
    subtitle: string;
    items: CategoryItem[];
};

// Mock Data for Categories
const CATEGORY_DATA: Record<string, CategoryData> = {
    'money-exchange': {
        title: 'money exhcnage', // matching typo in mockup
        icon: DollarSign,
        color: 'text-emerald-500',
        subtitle: 'Near your location',
        items: [
            {
                title: 'AIRPORT ATM',
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem'],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'AIRPORT ATM',
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem'],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'AIRPORT ATM',
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem'],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'AIRPORT ATM',
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem'],
                actions: { time: true, share: true, map: true, phone: false }
            }
        ]
    },
    'consulates': {
        title: 'consulates',
        icon: Landmark,
        color: 'text-slate-500',
        subtitle: 'Your local support',
        items: [
            {
                title: 'UNITED STATES',
                visual: (
                    <div className="w-full h-full flex items-center justify-center p-1 bg-white border rounded">
                        {/* Generic American Flag approximation since we don't have the image asset */}
                        <div className="w-full h-full relative border border-slate-200" style={{ backgroundImage: 'linear-gradient(to bottom, #b22234 10%, white 10%, white 20%, #b22234 20%, #b22234 30%, white 30%, white 40%, #b22234 40%, #b22234 50%, white 50%, white 60%, #b22234 60%, #b22234 70%, white 70%, white 80%, #b22234 80%, #b22234 90%, white 90%)' }}>
                            <div className="absolute top-0 left-0 w-[40%] h-[50%] bg-[#3c3b6e]"></div>
                        </div>
                    </div>
                ),
                description: ['Quintanna Roo', 'Presencial solo con cita', 'Lorem Imposum, lorem', '', <span key="mail" className="font-semibold text-slate-800">mail: usacancun@hotmail.com</span>],
                actions: { time: true, share: true, map: true, phone: true }
            },
            {
                title: 'UNITED STATES',
                visual: (
                    <div className="w-full h-full flex items-center justify-center p-1 bg-white border rounded">
                        {/* Generic American Flag approximation */}
                        <div className="w-full h-full relative border border-slate-200" style={{ backgroundImage: 'linear-gradient(to bottom, #b22234 10%, white 10%, white 20%, #b22234 20%, #b22234 30%, white 30%, white 40%, #b22234 40%, #b22234 50%, white 50%, white 60%, #b22234 60%, #b22234 70%, white 70%, white 80%, #b22234 80%, #b22234 90%, white 90%)' }}>
                            <div className="absolute top-0 left-0 w-[40%] h-[50%] bg-[#3c3b6e]"></div>
                        </div>
                    </div>
                ),
                description: ['Quintanna Roo', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem', '', <span key="mail" className="font-semibold text-slate-800">mail: usacancun@hotmail.com</span>],
                actions: { time: true, share: true, map: true, phone: true }
            },
            {
                title: 'UNITED STATES',
                visual: (
                    <div className="w-full h-full flex items-center justify-center p-1 bg-white border rounded">
                        {/* Generic American Flag approximation */}
                        <div className="w-full h-full relative border border-slate-200" style={{ backgroundImage: 'linear-gradient(to bottom, #b22234 10%, white 10%, white 20%, #b22234 20%, #b22234 30%, white 30%, white 40%, #b22234 40%, #b22234 50%, white 50%, white 60%, #b22234 60%, #b22234 70%, white 70%, white 80%, #b22234 80%, #b22234 90%, white 90%)' }}>
                            <div className="absolute top-0 left-0 w-[40%] h-[50%] bg-[#3c3b6e]"></div>
                        </div>
                    </div>
                ),
                description: ['Quintanna Roo', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem', '', <span key="mail" className="font-semibold text-slate-800">mail: usacancun@hotmail.com</span>],
                actions: { time: true, share: true, map: true, phone: true }
            }
        ]
    },
    'real-estate': {
        title: 'real estate',
        icon: Building,
        color: 'text-fuchsia-500',
        subtitle: 'Best Value',
        items: [
            {
                title: 'LUXURY HOUSE',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'MY HOUSE',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: '365 REAL ESTATE',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'TULUMINATI',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'INHOUSE',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos'],
                actions: { time: true, share: true, map: false, phone: false }
            }
        ]
    },
    'local-tips': {
        title: 'local tips',
        icon: Lock,
        color: 'text-teal-700',
        subtitle: 'Just Ask',
        items: [
            {
                title: 'TOP 10 BUFFETS',
                author: 'Sergio Soto',
                date: '12/05/22',
                images: 3,
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem']
            },
            {
                title: 'HIDDEN SPOTS',
                author: 'au', // The mockup literally says "au"
                date: '',
                images: 3,
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem']
            },
            {
                title: 'MUSIC AT NIGHT',
                author: 'au',
                date: '',
                images: 3,
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem']
            }
        ]
    },
    'local-transport': {
        title: 'local transport',
        icon: Bus,
        color: 'text-rose-800',
        subtitle: 'All around you',
        items: [
            {
                title: 'BUS STOP A',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'BUS STOP A',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'BUS STOP A',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'BUS STOP A',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'BUS STOP A',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: true, phone: false }
            }
        ]
    },
    'airport': {
        title: 'airport',
        icon: Plane,
        color: 'text-blue-700',
        subtitle: 'Inside look',
        items: [
            {
                title: 'RENTAL CARS',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'SAFE CABS',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'MONEY EXCHANGE',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'TERMINAL 1',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'BUS STOP A',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos'],
                actions: { time: true, share: true, map: false, phone: false }
            }
        ]
    },
    'restaurants': {
        title: 'restaurants',
        icon: Utensils,
        color: 'text-teal-700',
        subtitle: 'Only the best',
        items: [
            {
                title: 'ROLANDIS',
                images: 3,
                moreInfoLink: '#',
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem']
            },
            {
                title: 'BOBBA GUMP',
                images: 3,
                moreInfoLink: '#',
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem']
            },
            {
                title: 'PORFIRIOS',
                images: 3,
                moreInfoLink: '#',
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem']
            }
        ]
    },
    'night-life': {
        title: 'nightlife',
        icon: Moon,
        color: 'text-indigo-600',
        subtitle: 'Dance all night',
        items: [
            {
                title: 'COCO BONGO',
                images: 3,
                moreInfoLink: '#',
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem']
            },
            {
                title: 'MANDALA',
                images: 3,
                moreInfoLink: '#',
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem']
            }
        ]
    },
    'wellness': {
        title: 'wellness',
        icon: HeartPulse,
        color: 'text-rose-500',
        subtitle: 'Relax and heal',
        items: [
            {
                title: 'SPA RESORT',
                images: 3,
                moreInfoLink: '#',
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem']
            }
        ]
    },
    'attractions': {
        title: 'attractions',
        icon: Star,
        color: 'text-amber-500',
        subtitle: 'Must see places',
        items: [
            {
                title: 'CHICHEN ITZA',
                images: 3,
                moreInfoLink: '#',
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem']
            },
            {
                title: 'XCARET',
                images: 3,
                moreInfoLink: '#',
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem']
            }
        ]
    },
    'religion': {
        title: 'religion',
        icon: Church,
        color: 'text-slate-400',
        subtitle: 'Near you',
        items: [
            {
                title: 'MEZQUITA',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem'],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'IGLESIA SANTA',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem'],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'JUDAISM',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem'],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'ISLAISM',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem'],
                actions: { time: true, share: true, map: true, phone: false }
            },
            {
                title: 'RELIGION 2',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['Lorem Imposum, lorem', 'lorem lorem lorem lorem', 'Lorem Imposum, lorem', 'lorem lorem lorem lorem'],
                actions: { time: true, share: true, map: true, phone: false }
            }
        ]
    },
    'pet-friendly': {
        title: 'pet friendly',
        icon: PawPrint,
        color: 'text-amber-800',
        subtitle: 'for your best pal',
        items: [
            {
                title: 'COCO PLACE',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: false, phone: false, web: true }
            },
            {
                title: 'MY PETLOVE',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: false, phone: false, web: true }
            },
            {
                title: 'TINY PAWS',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: false, phone: false, web: true }
            },
            {
                title: 'PETLAND',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos', <span key="mail" className="font-semibold text-slate-800 text-[10px]">mail: bustopcancun@gmail.com</span>, <span key="ph" className="font-semibold text-slate-800 text-[10px]">ph: 9988861052</span>],
                actions: { time: true, share: true, map: false, phone: false, web: true }
            },
            {
                title: 'CROQUETAS',
                visual: <div className="w-full h-full bg-slate-50 rounded"></div>,
                description: ['You can travel through the full', 'hotel zone for $60 pesos'],
                actions: { time: true, share: true, map: false, phone: false, web: false }
            }
        ]
    }
}


export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string, categorySlug: string }>
}) {
    const { slug, categorySlug } = await params
    const destination = await getDestinationBySlug(slug)
    const categoryName = CATEGORY_DATA[categorySlug]?.title || 'Info'

    return {
        title: `${categoryName} - ${destination?.name || 'Destino'}`,
    }
}

export default async function DestinationCategoryInfoPage({
    params,
}: {
    params: Promise<{ slug: string, categorySlug: string }>
}) {
    const { slug, categorySlug } = await params
    const destination = await getDestinationBySlug(slug)

    if (!destination) notFound()

    const categoryData = CATEGORY_DATA[categorySlug]

    // Fallback if category doesn't have mock data yet
    if (!categoryData) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center pb-24 px-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
                <p className="text-muted-foreground mb-8">Information for &quot;{categorySlug}&quot; is not available yet.</p>
                <Link
                    href={ROUTES.destinationInfo(slug)}
                    className="flex items-center text-primary font-medium"
                >
                    <ChevronLeft className="h-5 w-5 mr-1" /> Back to Info
                </Link>
            </div>
        )
    }

    const { title, icon: Icon, color, subtitle, items } = categoryData

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header Area */}
            <div className="pt-6 px-6">
                <Link
                    href={ROUTES.destinationInfo(slug)}
                    className="inline-flex items-center justify-center p-2 -ml-2 mb-2 text-slate-900 active:scale-95 transition-transform"
                >
                    <ChevronLeft className="h-8 w-8" strokeWidth={3} />
                </Link>

                <div className="flex flex-col items-center justify-center mb-8">
                    <Icon className={cn("h-12 w-12 mb-2", color)} strokeWidth={1.5} />
                    <h1 className="text-base text-slate-700 underline underline-offset-4 decoration-slate-400">
                        {title}
                    </h1>
                </div>

                <h2 className="text-teal-700 font-semibold mb-6">
                    {subtitle}
                </h2>
            </div>

            {/* List of Cards */}
            <main className="container mx-auto max-w-md px-4 flex flex-col gap-4">
                {items.map((item: CategoryItem, idx: number) => {
                    if (categorySlug === 'local-tips') {
                        return (
                            <LocalTipCard
                                key={idx}
                                title={item.title}
                                author={item.author || ''}
                                date={item.date || ''}
                                description={item.description}
                                images={item.images}
                            />
                        )
                    }

                    if (['restaurants', 'night-life', 'wellness', 'attractions'].includes(categorySlug)) {
                        return (
                            <RestaurantCard
                                key={idx}
                                title={item.title}
                                description={item.description}
                                images={item.images}
                                moreInfoLink={item.moreInfoLink}
                            />
                        )
                    }

                    return (
                        <InfoCard
                            key={idx}
                            title={item.title}
                            description={item.description}
                            visual={item.visual}
                            actions={item.actions}
                        />
                    )
                })}
            </main>
        </div>
    )
}
