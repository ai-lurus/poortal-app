'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function NightlifeSearchPage() {
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
                        NIGHTLIFE
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
                    {/* Mock repeating the same poster 6 times */}
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                        <Link
                            href={`/nightlife/${idx}`}
                            key={idx}
                            className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-900 relative shadow-sm active:scale-95 transition-transform"
                        >
                            {/* Abstract mock interpretation of the poster. 
                                In reality this would be an <Image src="..." /> */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-900 flex flex-col items-center justify-center p-3 text-center">
                                <span className="text-emerald-400 font-bold text-sm leading-tight drop-shadow-md">Beach PartY</span>
                                <span className="text-green-400 font-bold text-xs uppercase mb-auto drop-shadow-md">CoCo Bongo</span>

                                <span className="text-white font-black text-2xl uppercase italic tracking-tighter drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-green-300" style={{ WebkitTextStroke: '1px #000' }}>PARTY</span>
                            </div>
                        </Link>
                    ))}
                </div>

            </main>
        </div>
    )
}
