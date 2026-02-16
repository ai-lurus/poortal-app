import {
  Compass,
  Waves,
  Car,
  Utensils,
  Music,
  ShoppingBag,
  Camera,
  Tent,
  Bike,
  Ship,
  TreePalm,
  Dumbbell,
  Heart,
  Sparkles,
  Sun,
  Mountain,
  Plane,
  Landmark,
  Palette,
  Wine,
  MapPin,
  Moon,
  Bus,
  Store,
  type LucideProps,
} from 'lucide-react'
import type { ComponentType } from 'react'

const iconMap: Record<string, ComponentType<LucideProps>> = {
  Compass,
  Waves,
  Car,
  Utensils,
  Music,
  ShoppingBag,
  Camera,
  Tent,
  Bike,
  Ship,
  TreePalm,
  Dumbbell,
  Heart,
  Sparkles,
  Sun,
  Mountain,
  Plane,
  Landmark,
  Palette,
  Wine,
  MapPin,
  Moon,
  Bus,
  Store,
}

interface DynamicIconProps extends Omit<LucideProps, 'name'> {
  name: string | null
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const Icon = (name && iconMap[name]) || MapPin
  return <Icon {...props} />
}
