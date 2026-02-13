"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { ROUTES } from '@/lib/constants'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Tu carrito esta vacio</h1>
        <p className="mt-2 text-muted-foreground">
          Explora nuestras experiencias y agrega algo a tu carrito
        </p>
        <Button className="mt-6" asChild>
          <Link href={ROUTES.explore}>Explorar experiencias</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Tu Carrito</h1>
      <p className="mt-1 text-muted-foreground">
        {items.length} {items.length === 1 ? 'experiencia' : 'experiencias'}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={`${item.experienceId}-${item.serviceDate}`}>
              <CardContent className="flex gap-4 p-4">
                <div className="h-24 w-24 shrink-0 rounded-md bg-muted" />
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.providerName} &middot; {item.serviceDate}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(
                            item.experienceId,
                            item.serviceDate,
                            item.quantity - 1
                          )
                        }
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(
                            item.experienceId,
                            item.serviceDate,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        ${(item.unitPrice * item.quantity).toLocaleString()} {item.currency}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() =>
                          removeItem(item.experienceId, item.serviceDate)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${getTotal().toLocaleString()} MXN</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Comision de servicio</span>
                <span>Calculada al pagar</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total estimado</span>
                <span>${getTotal().toLocaleString()} MXN</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" asChild>
                <Link href={ROUTES.checkout}>
                  Proceder al Pago
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
