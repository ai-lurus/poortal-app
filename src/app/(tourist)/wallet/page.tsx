import { Ticket } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { HomeHeader } from '@/components/home/home-header'
import { WalletTickets } from './wallet-tickets'

export const metadata = { title: 'Mi Wallet' }

export default async function WalletPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tickets } = await (supabase as any)
    .from('tickets')
    .select(`
      id,
      qr_code,
      status,
      service_date,
      service_time,
      quantity,
      experiences (
        title
      ),
      provider_profiles (
        business_name
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

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
        <WalletTickets tickets={tickets ?? []} />
      </div>

      {/* Desktop content */}
      <div className="hidden md:block container mx-auto max-w-6xl px-8 pt-8">
        <WalletTickets tickets={tickets ?? []} />
      </div>
    </div>
  )
}
