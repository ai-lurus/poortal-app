import Link from 'next/link'
import { ChevronLeft, Heart, MapPin, Share2, Ticket } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export default async function RestaurantDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    // We are mocking this flow specifically for the ID '1' or any ID
    const { id } = await params

    return (
        <div className="min-h-screen bg-white pb-24">
            {/* Minimal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <Link
                    href="/destinations/cancun/info/restaurants" // Ideally dynamic, but hardcoded for this mock flow
                    className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform"
                >
                    <ChevronLeft className="h-8 w-8" strokeWidth={3} />
                </Link>
                <div className="border border-slate-200 rounded-full px-12 py-3 shadow-sm">
                    <h1 className="text-base font-bold text-slate-800 tracking-wide uppercase">
                        ROLANDIS
                    </h1>
                </div>
                <div className="w-8"></div> {/* Spacer for centering */}
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col gap-6">
                {/* Hero Image Block */}
                <div className="relative w-full aspect-[4/5] bg-slate-200 rounded-2xl overflow-hidden mt-2">
                    {/* Placeholder for the actual image, mimicking the dark lighting of the mockup */}
                    <div className="absolute inset-0 bg-[#8c5230] mix-blend-multiply opacity-40"></div>

                    {/* Gradient overlay for bottom text */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>

                    {/* Image inner content */}
                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-2">
                        <h2 className="text-white text-lg font-bold">Title of image</h2>
                        <p className="text-white text-[11px] leading-snug max-w-[90%] font-medium">
                            Lorem Imposum Lorem Imposum Lorem Imposum Lore Imposum Lorem Imposum Lorem Imposum Lorem Imp Lorem Imposum Lorem Imposum <span className="underline decoration-white underline-offset-2">... more</span>
                        </p>
                        <div className="absolute bottom-6 right-6">
                            <button className="text-white active:scale-95 transition-transform">
                                <Heart className="h-7 w-7" strokeWidth={2} />
                            </button>
                        </div>

                        {/* Carousel Indicators */}
                        <div className="flex justify-center gap-1.5 mt-2">
                            <div className="w-2 h-2 rounded-full bg-[#25C68A]"></div>
                            <div className="w-2 h-2 rounded-full border border-slate-300"></div>
                            <div className="w-2 h-2 rounded-full border border-slate-300"></div>
                            <div className="w-2 h-2 rounded-full border border-slate-300"></div>
                        </div>
                    </div>
                </div>

                {/* Primary Action Button */}
                <div className="flex justify-center -mt-2">
                    <Link
                        href={`/restaurants/${id}/book`}
                        className="flex items-center justify-center gap-2 bg-teal-800 text-white rounded-md px-10 py-3 active:scale-95 transition-transform shadow-md"
                    >
                        <Ticket className="h-5 w-5" />
                        <span className="text-sm font-semibold">Tickets</span>
                    </Link>
                </div>

                {/* Info Card Block */}
                <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm p-5 w-full gap-5 mt-2">
                    {/* Card Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4 items-center">
                            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">
                                NAME OF REST
                            </h3>
                            <span className="font-bold text-sm text-slate-800">$$$</span>
                        </div>
                        <div className="text-[10px] text-right text-slate-500 leading-tight">
                            <div>Tuesday - Sunday</div>
                            <div>21:00 pm - 3:00 am</div>
                        </div>
                    </div>

                    {/* Description Skeletons */}
                    <div className="flex flex-col gap-3">
                        <div className="text-xs text-slate-700 font-medium">General description of the place</div>
                        <div className="flex flex-col gap-2">
                            <div className="w-full h-4 bg-slate-100 rounded-full"></div>
                            <div className="w-full h-4 bg-slate-100 rounded-full"></div>
                            <div className="w-[80%] h-4 bg-slate-100 rounded-full"></div>
                        </div>
                    </div>

                    {/* Tags Skeletons */}
                    <div className="flex flex-col gap-3">
                        <div className="text-xs text-slate-700 font-medium">Tags</div>
                        <div className="w-full h-4 bg-slate-100 rounded-full"></div>
                    </div>

                    {/* More Info Link */}
                    <div className="flex justify-end mt-1">
                        <Link
                            href="#"
                            className="text-xs font-medium text-slate-800 underline decoration-slate-800 underline-offset-2 hover:text-slate-600"
                        >
                            more info
                        </Link>
                    </div>

                    {/* Divider */}
                    <hr className="border-slate-100" />

                    {/* Location Footer */}
                    <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-800" fill="currentColor" />
                            <span className="text-xs text-slate-600">Location description</span>
                        </div>
                        <button className="text-teal-600 active:scale-95 transition-transform">
                            <Share2 className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
