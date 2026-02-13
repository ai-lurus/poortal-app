'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Search, ShoppingCart, Ticket, User } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const tabs = [
  { href: ROUTES.home, icon: Bell, label: 'Inicio' },
  { href: ROUTES.explore, icon: Search, label: 'Explorar' },
  { href: ROUTES.cart, icon: ShoppingCart, label: 'Carrito' },
  { href: ROUTES.wallet, icon: Ticket, label: 'Wallet' },
  { href: ROUTES.profile, icon: User, label: 'Perfil' },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const itemCount = useCartStore((s) => s.items.length)

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex h-16 items-center justify-around">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === '/'
              ? pathname === '/' || pathname.startsWith('/destinations')
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 text-[10px]',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <span className="relative">
                <Icon className="h-5 w-5" />
                {href === ROUTES.cart && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {itemCount}
                  </span>
                )}
              </span>
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
