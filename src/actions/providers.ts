'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { providerRegistrationSchema, providerCompleteProfileSchema } from '@/lib/validations/provider'
import type { SupabaseClient } from '@supabase/supabase-js'

export type ProviderActionState = {
  error?: string
  success?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function insertInto(supabase: SupabaseClient<any>, table: string, data: Record<string, unknown>) {
  return supabase.from(table).insert(data)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateTable(supabase: SupabaseClient<any>, table: string, data: Record<string, unknown>) {
  return supabase.from(table).update(data)
}

export async function registerProviderAction(
  _prevState: ProviderActionState,
  formData: FormData
): Promise<ProviderActionState> {
  const rawData = {
    business_name: formData.get('business_name') as string,
    representative_name: formData.get('representative_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    location: formData.get('location') as string,
    category_id: formData.get('category_id') as string,
    short_description: formData.get('short_description') as string,
    accept_terms: formData.get('accept_terms') === 'on',
  }

  const parsed = providerRegistrationSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Debes iniciar sesion para registrar tu negocio.' }
  }

  // Check if already registered
  const { data: existing } = await supabase
    .from('provider_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (existing) {
    return { error: 'Ya tienes un perfil de proveedor registrado.' }
  }

  // Get default destination (Cancun)
  const { data: destData } = await supabase
    .from('destinations')
    .select('id')
    .eq('slug', 'cancun')
    .single()
  const destination = destData as { id: string } | null

  // Create provider profile
  const { error } = await insertInto(supabase, 'provider_profiles', {
    user_id: user.id,
    destination_id: destination?.id ?? null,
    business_name: parsed.data.business_name,
    representative_name: parsed.data.representative_name,
    phone: parsed.data.phone,
    location: parsed.data.location,
    category_id: parsed.data.category_id,
    short_description: parsed.data.short_description,
    status: 'pending_review',
  })

  if (error) {
    return { error: 'Error al registrar tu negocio. Intenta de nuevo.' }
  }

  // Update user role to provider
  await updateTable(supabase, 'profiles', { role: 'provider' }).eq('id', user.id)

  redirect('/provider/onboarding')
}

export async function completeProviderProfileAction(
  _prevState: ProviderActionState,
  formData: FormData
): Promise<ProviderActionState> {
  const rawData = {
    legal_name: formData.get('legal_name') as string,
    tax_id: (formData.get('tax_id') as string) || '',
    full_address: formData.get('full_address') as string,
    customer_phone: formData.get('customer_phone') as string,
    website: (formData.get('website') as string) || '',
    operating_hours: (formData.get('operating_hours') as string) || '',
  }

  const parsed = providerCompleteProfileSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Debes iniciar sesion.' }
  }

  const { error } = await updateTable(supabase, 'provider_profiles', {
    legal_name: parsed.data.legal_name,
    tax_id: parsed.data.tax_id || null,
    full_address: parsed.data.full_address,
    customer_phone: parsed.data.customer_phone,
    website: parsed.data.website || null,
    operating_hours: parsed.data.operating_hours ? { description: parsed.data.operating_hours } : null,
  }).eq('user_id', user.id)

  if (error) {
    return { error: 'Error al actualizar tu perfil. Intenta de nuevo.' }
  }

  return { success: 'Perfil actualizado correctamente.' }
}
