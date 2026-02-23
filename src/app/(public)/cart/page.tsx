'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Percent } from 'lucide-react'
import Image from 'next/image'

export default function CartPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10 border-b border-slate-100 mb-2">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform"
        >
          <ChevronLeft className="h-8 w-8" strokeWidth={3} />
        </button>
        <div className="border border-slate-200 bg-white rounded-full px-12 py-3 shadow-sm">
          <h1 className="text-base font-bold text-slate-800 tracking-wide uppercase">
            CART
          </h1>
        </div>
        <div className="w-8"></div> {/* Spacer */}
      </div>

      <main className="container mx-auto px-6 flex flex-col gap-5 mt-4 max-w-md">

        {/* Cart Item 1 */}
        <div className="flex bg-white border border-slate-200 rounded-lg shadow-sm p-4 relative">
          <div className="w-24 h-24 bg-slate-200 rounded-lg shrink-0 overflow-hidden relative mr-4">
            {/* Placeholder for Isla Mujeres Tour image */}
            <div className="absolute inset-0 bg-blue-400 opacity-60 mix-blend-multiply"></div>
          </div>
          <div className="flex flex-col flex-1 justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between w-[90%]">
                <span className="text-xs font-bold text-slate-900 w-12 shrink-0">XP</span>
                <span className="text-xs text-slate-700 flex-1 truncate">Isla Mujeres Tour</span>
              </div>
              <div className="flex items-center justify-between w-[90%]">
                <span className="text-xs font-bold text-slate-900 w-12 shrink-0">Date</span>
                <span className="text-xs text-slate-700 flex-1">15/06/22</span>
              </div>
              <div className="flex items-center justify-between w-[90%]">
                <span className="text-xs font-bold text-slate-900 w-12 shrink-0">Time</span>
                <span className="text-xs text-slate-700 flex-1">8:00 PM</span>
              </div>
            </div>
            {/* Item Total */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">TOTAL:</span>
              <span className="text-sm font-bold text-slate-800">$ 600.00 USD</span>
            </div>
          </div>
        </div>

        {/* Cart Item 2 */}
        <div className="flex bg-white border border-slate-200 rounded-lg shadow-sm p-4 relative">
          <div className="w-24 h-24 bg-slate-200 rounded-lg shrink-0 overflow-hidden relative mr-4">
            {/* Placeholder for Isla Mujeres Tour image */}
            <div className="absolute inset-0 bg-blue-400 opacity-60 mix-blend-multiply"></div>
          </div>
          <div className="flex flex-col flex-1 justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between w-[90%]">
                <span className="text-xs font-bold text-slate-900 w-12 shrink-0">XP</span>
                <span className="text-xs text-slate-700 flex-1 truncate">Isla Mujeres Tour</span>
              </div>
              <div className="flex items-center justify-between w-[90%]">
                <span className="text-xs font-bold text-slate-900 w-12 shrink-0">Date</span>
                <span className="text-xs text-slate-700 flex-1">15/06/22</span>
              </div>
              <div className="flex items-center justify-between w-[90%]">
                <span className="text-xs font-bold text-slate-900 w-12 shrink-0">Time</span>
                <span className="text-xs text-slate-700 flex-1">8:00 PM</span>
              </div>
            </div>
            {/* Item Total */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">TOTAL:</span>
              <span className="text-sm font-bold text-slate-800">$ 600.00 USD</span>
            </div>
          </div>
        </div>

        {/* Checkout Ticket Card */}
        <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col mt-2">
          <div className="py-3 px-4 text-center">
            <h3 className="font-bold text-sm text-slate-800">Checkout Ticket</h3>
          </div>
          {/* Dashed Line */}
          <div className="border-t border-dashed border-slate-300 mx-4"></div>

          <div className="px-8 py-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 w-24 text-right">Experiences:</span>
              <span className="text-slate-600 w-20 text-left">4</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 w-24 text-right">Discount:</span>
              <span className="text-slate-600 w-20 text-left">0</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 w-24 text-right">Subtotal:</span>
              <span className="text-slate-600 w-20 text-left">$ 504.00</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 w-24 text-right">Service Fee:</span>
              <span className="text-slate-600 w-20 text-left">0</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 w-24 text-right">IVA (16%):</span>
              <span className="text-slate-600 w-20 text-left">$ 96.00</span>
            </div>
          </div>

          {/* Dashed Line */}
          <div className="border-t border-dashed border-slate-300 mx-4"></div>

          <div className="py-4 px-8 flex justify-center items-center gap-4">
            <span className="font-bold text-sm text-slate-800 tracking-wide uppercase">TOTAL:</span>
            <span className="font-bold text-sm text-slate-800">$ 600.00 USD</span>
          </div>
        </div>

        {/* Coupon Code */}
        <div className="flex justify-center mt-2">
          <button className="flex items-center gap-1.5 active:scale-95 transition-transform">
            <Percent className="h-4 w-4 text-teal-600" strokeWidth={3} />
            <span className="text-[10px] font-medium text-slate-800 underline decoration-slate-800 underline-offset-2">coupon code</span>
          </button>
        </div>

        {/* Terms and conditions */}
        <div className="flex justify-center mt-2 px-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="w-5 h-5 border-2 border-[#A8CCC9] rounded-sm flex items-center justify-center bg-white shrink-0">
              {/* Empty checkbox visually */}
            </div>
            <span className="text-[11px] text-slate-800 font-medium">
              I have read and agree to this <span className="underline font-bold decoration-slate-800">Terms and Conditions</span>
            </span>
          </label>
        </div>

        {/* Payment Options */}
        <div className="flex flex-col items-center mt-6 mb-8">
          <span className="text-sm font-bold text-slate-800 mb-4">Select payment option</span>
          <div className="flex items-center justify-center gap-4">
            {/* Mock Apple Pay */}
            <div className="w-16 h-10 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center overflow-hidden">
              <div className="w-10 h-10 bg-black rounded-full scale-[1.2] translate-y-2 translate-x-1"></div>
            </div>
            {/* Mock Mercado Pago */}
            <div className="w-16 h-10 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center overflow-hidden">
              <div className="w-[120%] h-3 border-t-[3px] border-slate-700 rounded-t-[50%] -translate-y-1"></div>
              <div className="w-[120%] h-3 border-b-[3px] border-slate-700 rounded-b-[50%] translate-y-1 absolute"></div>
            </div>
            {/* Mock Visa/Mastercard */}
            <div className="w-16 h-10 bg-white border border-slate-200 shadow-sm rounded-full flex flex-col items-center justify-center">
              <span className="font-extrabold text-[10px] italic">VISA</span>
              <div className="flex gap-1 mt-0.5">
                <div className="w-2 h-0.5 bg-slate-400"></div>
                <div className="w-2 h-0.5 bg-slate-400"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
