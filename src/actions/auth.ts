'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, registerSchema, forgotPasswordSchema } from '@/lib/validations/auth'

export type AuthActionState = {
  error?: string
  success?: string
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = loginSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { error: 'Credenciales invalidas. Verifica tu correo y contrasena.' }
  }

  const redirectTo = formData.get('redirectTo') as string
  redirect(redirectTo || '/')
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const rawData = {
    full_name: formData.get('full_name') as string,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || '',
    password: formData.get('password') as string,
    confirm_password: formData.get('confirm_password') as string,
    accept_terms: formData.get('accept_terms') === 'on',
  }

  const parsed = registerSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
        phone: parsed.data.phone,
      },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Este correo ya esta registrado. Intenta iniciar sesion.' }
    }
    return { error: 'Error al crear la cuenta. Intenta de nuevo.' }
  }

  const redirectTo = formData.get('redirectTo') as string
  redirect(redirectTo || '/')
}

export async function forgotPasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const rawData = {
    email: formData.get('email') as string,
  }

  const parsed = forgotPasswordSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/profile`,
  })

  if (error) {
    return { error: 'Error al enviar el correo. Intenta de nuevo.' }
  }

  return { success: 'Te enviamos un correo con instrucciones para restablecer tu contrasena.' }
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function signInWithGoogleAction() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    redirect('/login?error=oauth')
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithFacebookAction() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    redirect('/login?error=oauth')
  }

  if (data.url) {
    redirect(data.url)
  }
}
