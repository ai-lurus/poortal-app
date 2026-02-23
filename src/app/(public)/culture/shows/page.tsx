'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CultureShowsPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-white flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform"
                >
                    <ChevronLeft className="h-8 w-8" strokeWidth={3} />
                </button>
                <div className="border border-slate-200 bg-white rounded-full px-12 py-3 shadow-sm absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                        CULTURE
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-2">

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

                {/* Grid Container */}
                <div className="w-full grid grid-cols-2 gap-3 pb-8">
                    {/* Mock repeating the Andrea Bocelli poster 6 times */}
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                        <Link
                            href={`/culture/shows/${idx}`}
                            key={idx}
                            className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-900 relative shadow-sm active:scale-95 transition-transform"
                        >
                            {/* Abstract mockup interpretation for Andrea Bocelli poster */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 flex flex-col p-3 pt-5">
                                <div className="text-rose-200 font-serif text-lg leading-tight uppercase tracking-widest drop-shadow-md">ANDREA</div>
                                <div className="text-rose-200 font-serif text-lg leading-tight uppercase tracking-widest mb-2 drop-shadow-md">BOCELLI</div>
                                <span className="text-white font-bold text-[8px] uppercase tracking-wide">26 FEBRERO 2022</span>
                                <span className="text-slate-300 font-medium text-[6px] uppercase tracking-wide leading-tight mt-1">
                                    PLAYA MAROMA BEACH CLUB<br />RIVIERA MAYA, MEX
                                </span>
                                {/* Background flutist silhouette mock */}
                                <div className="absolute bottom-0 right-0 w-3/4 h-3/4 opacity-40 bg-gradient-to-t from-slate-900 to-transparent"></div>
                            </div>
                        </Link>
                    ))}
                </div>

            </main>
        </div>
    )
}
