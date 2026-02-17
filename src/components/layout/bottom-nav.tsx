'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Wallet, Info } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()

  const isHome =
    pathname === '/' || pathname.startsWith('/destinations')
  const isWallet = pathname.startsWith('/wallet') || pathname.startsWith('/bookings')

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex h-16 items-center justify-around px-6">
        {/* Info / Help */}
        <Link
          href="#"
          className="flex flex-col items-center gap-0.5 text-muted-foreground"
        >
          <Info className="h-6 w-6" />
        </Link>

        {/* Home - Bell Center */}
        <Link
          href={ROUTES.home}
          className="relative -top-5"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg ring-4 ring-background">
            <Bell className="h-7 w-7 fill-current" />
          </span>
        </Link>

        {/* Wallet */}
        <Link
          href={ROUTES.wallet}
          className={cn(
            'flex flex-col items-center gap-0.5',
            isWallet ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <Wallet className="h-6 w-6" />
        </Link>
      </div>
    </nav>
  )
}
