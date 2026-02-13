"use client"

import { Suspense, useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { registerProviderAction, type ProviderActionState } from '@/actions/providers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Store } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import type { Category } from '@/types'

export default function ProviderRegistrationPage() {
  return (
    <Suspense>
      <ProviderRegistrationForm />
    </Suspense>
  )
}

function ProviderRegistrationForm() {
  const [state, formAction, isPending] = useActionState<ProviderActionState, FormData>(
    registerProviderAction,
    {}
  )
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data) setCategories(data as Category[])
      })
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Registra tu Negocio</CardTitle>
          <CardDescription>
            Unete a POORTAL y conecta con miles de turistas. Completa los siguientes datos para iniciar tu solicitud.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            {/* 1. Business Name */}
            <div className="space-y-2">
              <Label htmlFor="business_name">Nombre del negocio o marca *</Label>
              <Input
                id="business_name"
                name="business_name"
                placeholder="Ej: Cabo Adventures"
                required
              />
            </div>

            {/* 2. Representative Name */}
            <div className="space-y-2">
              <Label htmlFor="representative_name">Nombre del representante *</Label>
              <Input
                id="representative_name"
                name="representative_name"
                placeholder="Nombre completo"
                required
              />
            </div>

            {/* 3. Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electronico *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contacto@negocio.com"
                required
              />
            </div>

            {/* 4. Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Numero de telefono *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+52 624 123 4567"
                required
              />
            </div>

            {/* 5. Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Ubicacion principal *</Label>
              <Input
                id="location"
                name="location"
                placeholder="Ej: Cabo San Lucas, BCS"
                required
              />
            </div>

            {/* 6. Category */}
            <div className="space-y-2">
              <Label>Categoria del servicio *</Label>
              <Select
                name="category_id"
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="category_id" value={selectedCategory} />
            </div>

            {/* 7. Short Description */}
            <div className="space-y-2">
              <Label htmlFor="short_description">
                Descripcion breve del servicio * ({charCount}/300)
              </Label>
              <Textarea
                id="short_description"
                name="short_description"
                placeholder="Describe brevemente los servicios que ofreces..."
                maxLength={300}
                rows={3}
                required
                onChange={(e) => setCharCount(e.target.value.length)}
              />
            </div>

            {/* 8. Terms */}
            <div className="flex items-start space-x-2">
              <Checkbox id="accept_terms" name="accept_terms" required />
              <Label htmlFor="accept_terms" className="text-sm leading-tight">
                Acepto los{' '}
                <Link href="#" className="text-primary hover:underline">
                  Terminos y Condiciones para Proveedores
                </Link>{' '}
                y la{' '}
                <Link href="#" className="text-primary hover:underline">
                  Politica de Privacidad
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Enviando solicitud...' : 'Enviar Solicitud'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Iniciar sesion
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
