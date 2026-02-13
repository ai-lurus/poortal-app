'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { AvailabilityPicker } from '@/components/booking/availability-picker'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

interface ExperienceInfo {
  id: string
  title: string
  shortDescription: string | null
  coverImageUrl: string | null
  providerName: string
  providerId: string
  priceAmount: number
  priceCurrency: string
  pricingType: 'per_person' | 'per_group' | 'flat_rate'
  maxCapacity: number
}

interface AvailabilitySlot {
  id: string
  date: string
  start_time: string
  end_time: string | null
  total_spots: number
  booked_spots: number
  price_override: number | null
}

interface BookingSidebarProps {
  experience: ExperienceInfo
  availability: AvailabilitySlot[]
  formattedPrice: string
  pricingLabel: string
}

export function BookingSidebar({
  experience,
  availability,
  formattedPrice,
  pricingLabel,
}: BookingSidebarProps) {
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()

  const effectivePrice = selectedSlot?.price_override ?? experience.priceAmount
  const availableSpots = selectedSlot
    ? selectedSlot.total_spots - selectedSlot.booked_spots
    : experience.maxCapacity

  const total =
    experience.pricingType === 'per_person'
      ? effectivePrice * quantity
      : effectivePrice

  const formattedTotal = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: experience.priceCurrency || 'MXN',
    minimumFractionDigits: 0,
  }).format(total)

  function handleAddToCart() {
    if (!selectedSlot) return

    addItem({
      experienceId: experience.id,
      availabilityId: selectedSlot.id,
      title: experience.title,
      shortDescription: experience.shortDescription,
      coverImageUrl: experience.coverImageUrl,
      providerName: experience.providerName,
      providerId: experience.providerId,
      quantity,
      unitPrice: effectivePrice,
      currency: experience.priceCurrency,
      serviceDate: selectedSlot.date,
      serviceTime: selectedSlot.start_time,
      pricingType: experience.pricingType,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6 space-y-6">
        <div>
          <div className="text-3xl font-bold text-primary">
            {formattedPrice}
          </div>
          <p className="text-sm text-muted-foreground">{pricingLabel}</p>
        </div>

        {/* Availability picker */}
        <div>
          <Label className="mb-2 block">Selecciona fecha y horario</Label>
          <AvailabilityPicker
            slots={availability}
            basePrice={experience.priceAmount}
            currency={experience.priceCurrency}
            onSelect={setSelectedSlot}
            selectedSlotId={selectedSlot?.id}
          />
        </div>

        {/* Quantity */}
        {selectedSlot && experience.pricingType === 'per_person' && (
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad de personas</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={availableSpots}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(availableSpots, Number(e.target.value))))}
            />
            <p className="text-xs text-muted-foreground">
              {availableSpots} {availableSpots === 1 ? 'lugar disponible' : 'lugares disponibles'}
            </p>
          </div>
        )}

        {/* Total */}
        {selectedSlot && (
          <div className="flex items-center justify-between border-t pt-4">
            <span className="font-medium">Total</span>
            <span className="text-xl font-bold">{formattedTotal}</span>
          </div>
        )}

        {/* Add to cart */}
        <Button
          className="w-full"
          size="lg"
          disabled={!selectedSlot}
          onClick={handleAddToCart}
        >
          {added ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Agregado al carrito
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Agregar al carrito
            </>
          )}
        </Button>

        {added && (
          <Button variant="outline" className="w-full" onClick={() => router.push('/cart')}>
            Ver carrito
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
