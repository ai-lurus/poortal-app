"use client"

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}

function RegisterForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || ''
  const router = useRouter()

  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const form = e.currentTarget
    const full_name = (form.elements.namedItem('full_name') as HTMLInputElement).value
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const confirm_password = (form.elements.namedItem('confirm_password') as HTMLInputElement).value

    if (password !== confirm_password) {
      setError('Las contrasenas no coinciden.')
      setIsPending(false)
      return
    }

    if (password.length < 8) {
      setError('La contrasena debe tener al menos 8 caracteres.')
      setIsPending(false)
      return
    }

    const { data, error: authErr } = await authClient.signUp.email({
      email,
      password,
      name: full_name,
    })

    if (authErr) {
      if (authErr.message?.includes('already')) {
        setError('Este correo ya esta registrado. Intenta iniciar sesion.')
      } else {
        setError('Error al crear la cuenta. Intenta de nuevo.')
      }
      setIsPending(false)
      return
    }

    // Create profile via API route (can't use prisma directly in client)
    if (data?.user?.id) {
      await fetch('/api/auth/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: data.user.id, full_name, email, phone }),
      })
    }

    router.push(redirectTo || '/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
          <CardDescription>
            Registrate en POORTAL para reservar experiencias increibles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="relative">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              Registrate con email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre completo</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Tu nombre completo"
                required
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electronico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefono (opcional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+52 624 123 4567"
                autoComplete="tel"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contrasena</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimo 8 caracteres"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirmar contrasena</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Repite tu contrasena"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="accept_terms" name="accept_terms" required />
              <Label htmlFor="accept_terms" className="text-sm leading-tight">
                Acepto los{' '}
                <Link href="#" className="text-primary hover:underline">
                  Terminos y Condiciones
                </Link>{' '}
                y la{' '}
                <Link href="#" className="text-primary hover:underline">
                  Politica de Privacidad
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Ya tienes cuenta?{' '}
            <Link
              href={`/login${redirectTo ? `?redirectTo=${redirectTo}` : ''}`}
              className="font-medium text-primary hover:underline"
            >
              Iniciar sesion
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
