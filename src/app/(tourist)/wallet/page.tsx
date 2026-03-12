import { Ticket } from 'lucide-react'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { HomeHeader } from '@/components/home/home-header'
import { WalletTickets } from './wallet-tickets'

export const metadata = { title: 'Mi Wallet' }

export default async function WalletPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return (
      <>
        <HomeHeader />
        {/* Mobile empty */}
        <div className="flex flex-col items-center justify-center py-20 text-center md:hidden">
          <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-slate-500">Inicia sesión para ver tus tickets</p>
        </div>
        {/* Desktop empty */}
        <div className="hidden md:flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
            <Ticket className="h-9 w-9 text-slate-300" />
          </div>
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Sign in to view your tickets</h2>
          <p className="text-slate-400">Your booked experiences will appear here.</p>
        </div>
      </>
    )
  }

  const profile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
    select: { id: true },
  })

  const ticketRows = profile
    ? await prisma.tickets.findMany({
        where: { user_id: profile.id },
        select: {
          id: true,
          qr_code: true,
          status: true,
          service_date: true,
          service_time: true,
          quantity: true,
          experiences: { select: { title: true } },
          provider_profiles: { select: { business_name: true } },
        },
        orderBy: { created_at: 'desc' },
      })
    : []

  const tickets = ticketRows.map((t) => ({
    ...t,
    service_date: t.service_date.toISOString().split('T')[0],
    service_time: t.service_time
      ? `${t.service_time.getUTCHours().toString().padStart(2, '0')}:${t.service_time.getUTCMinutes().toString().padStart(2, '0')}:${t.service_time.getUTCSeconds().toString().padStart(2, '0')}`
      : null,
  }))

  return (
    <div className="bg-background pb-20">
      {/* Mobile header */}
      <HomeHeader />

      {/* Desktop page hero */}
      <div className="hidden md:block border-b bg-white">
        <div className="container mx-auto max-w-6xl px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-800">My Wallet</h1>
          <p className="text-slate-500 mt-1">All your booked experiences in one place</p>
        </div>
      </div>

      {/* Mobile content */}
      <div className="md:hidden container mx-auto max-w-md px-6 pt-4">
        <WalletTickets tickets={tickets} />
      </div>

      {/* Desktop content */}
      <div className="hidden md:block container mx-auto max-w-6xl px-8 pt-8">
        <WalletTickets tickets={tickets} />
      </div>
    </div>
  )
}
