"use client"

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { signOutAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  ShoppingCart,
  Menu,
  User,
  Ticket,
  CalendarCheck,
  LogOut,
  LayoutDashboard,
  Store,
  Shield,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { useCartStore } from '@/stores/cart-store'

export function Header() {
  const { user, profile, loading } = useAuth()
  const itemCount = useCartStore((s) => s.items.length)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 md:container md:mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">POORTAL</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href={ROUTES.explore}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Explorar
          </Link>
          <Link
            href={ROUTES.destination('cancun')}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancun
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Cart */}
          <Link href={ROUTES.cart} className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {itemCount}
              </Badge>
            )}
          </Link>

          {/* Auth */}
          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : user && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
                    <AvatarFallback>
                      {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{profile.full_name}</p>
                    <p className="text-xs text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.profile}>
                    <User className="mr-2 h-4 w-4" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.wallet}>
                    <Ticket className="mr-2 h-4 w-4" />
                    Mi Wallet
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.bookings}>
                    <CalendarCheck className="mr-2 h-4 w-4" />
                    Mis Reservas
                  </Link>
                </DropdownMenuItem>

                {/* Provider links */}
                {(profile.role === 'provider' || profile.role === 'admin') && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.providerDashboard}>
                        <Store className="mr-2 h-4 w-4" />
                        Panel Proveedor
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                {/* Admin links */}
                {profile.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.adminDashboard}>
                        <Shield className="mr-2 h-4 w-4" />
                        Panel Admin
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action={signOutAction}>
                    <button type="submit" className="flex w-full items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesion
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center space-x-2 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href={ROUTES.login}>Iniciar Sesion</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={ROUTES.register}>Registrarse</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link href={ROUTES.explore} className="text-lg font-medium">
                  Explorar
                </Link>
                <Link href={ROUTES.destination('cancun')} className="text-lg font-medium">
                  Cancun
                </Link>
                {user && profile && (
                  <>
                    <hr />
                    <Link href={ROUTES.wallet} className="text-lg font-medium">
                      Mi Wallet
                    </Link>
                    <Link href={ROUTES.bookings} className="text-lg font-medium">
                      Mis Reservas
                    </Link>
                    <Link href={ROUTES.profile} className="text-lg font-medium">
                      Mi Perfil
                    </Link>
                  </>
                )}
                {!user && !loading && (
                  <>
                    <hr />
                    <Link href={ROUTES.login} className="text-lg font-medium">
                      Iniciar Sesion
                    </Link>
                    <Link href={ROUTES.register} className="text-lg font-medium">
                      Registrarse
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
