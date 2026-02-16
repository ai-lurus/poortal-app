'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Bell, ClipboardList } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()

  const isHome =
    pathname === '/' || pathname.startsWith('/destinations')
  const isWallet = pathname.startsWith('/wallet') || pathname.startsWith('/bookings')

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex h-16 items-center justify-around">
        {/* Home */}
        <Link
          href={ROUTES.home}
          className={cn(
            'flex flex-col items-center gap-0.5 text-[10px]',
            isHome ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        {/* POORTAL bell — accent highlight */}
        <Link
          href={ROUTES.home}
          className="flex flex-col items-center gap-0.5 text-[10px]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
            <Bell className="h-5 w-5 text-accent-foreground" />
          </span>
        </Link>

        {/* Bookings / list */}
        <Link
          href={ROUTES.wallet}
          className={cn(
            'flex flex-col items-center gap-0.5 text-[10px]',
            isWallet ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <ClipboardList className="h-5 w-5" />
          <span>Tickets</span>
        </Link>
      </div>
    </nav>
  )
}
