'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function RestaurantsSearchPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10 shadow-sm border-b border-slate-100">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform"
                >
                    <ChevronLeft className="h-8 w-8" strokeWidth={3} />
                </button>
                <div className="border border-slate-200 bg-white rounded-full px-10 py-3 shadow-sm absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                        RESTAURANTS
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-6">

                {/* Filter Row */}
                <div className="w-full flex items-center gap-3 mb-6">
                    <button className="flex items-center gap-2 bg-[#1b6d72] text-white rounded-full px-4 py-1.5 text-sm font-medium shadow-sm active:scale-95 transition-transform">
                        Order A-Z
                        <ChevronDown className="h-4 w-4 opacity-80" strokeWidth={3} />
                    </button>
                    <button className="flex items-center gap-2 bg-white border border-slate-300 text-teal-700 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm active:scale-95 transition-transform">
                        Budget
                        <ChevronDown className="h-4 w-4 opacity-80" strokeWidth={3} />
                    </button>
                </div>

                {/* List Container */}
                <div className="w-full flex flex-col gap-5 pb-8">
                    {/* Mock repeating the same restaurant card */}
                    {[1, 2, 3, 4].map((idx) => (
                        <Link
                            href={`/restaurants/${idx}`}
                            key={idx}
                            className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-all border border-slate-100"
                        >
                            {/* Image Header */}
                            <div className="h-40 bg-slate-200 relative w-full overflow-hidden">
                                <div className="absolute inset-0 bg-[#8c5230] mix-blend-multiply opacity-30"></div>
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col pointer-events-none">
                                    <h3 className="text-white font-bold text-lg mb-1 leading-none uppercase drop-shadow-md">
                                        ROLANDIS {idx}
                                    </h3>
                                    <p className="text-white/90 text-[10px] leading-snug drop-shadow-sm font-medium">
                                        Lorem Imposum, lorem<br />
                                        lorem lorem lorem lorem
                                    </p>
                                </div>
                                {/* Mock dots */}
                                <div className="absolute right-4 bottom-4 flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                                </div>
                            </div>

                            {/* Card Footer Info */}
                            <div className="p-4 flex items-center justify-between bg-white text-slate-800">
                                <span className="font-semibold text-sm">$$$</span>
                                <span className="text-[10px] font-medium text-slate-500 uppercase">Tuesday - Sunday</span>
                            </div>
                        </Link>
                    ))}
                </div>

            </main>
        </div>
    )
}
