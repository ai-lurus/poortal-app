'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { experienceSchema, availabilitySchema } from '@/lib/validations/experience'
import type { SupabaseClient } from '@supabase/supabase-js'

export type ExperienceActionState = {
  error?: string
  success?: string
  experienceId?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function insertInto(supabase: SupabaseClient<any>, table: string, data: Record<string, unknown>) {
  return supabase.from(table).insert(data)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateTable(supabase: SupabaseClient<any>, table: string, data: Record<string, unknown>) {
  return supabase.from(table).update(data)
}

export async function createExperienceAction(
  _prevState: ExperienceActionState,
  formData: FormData
): Promise<ExperienceActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Debes iniciar sesion.' }
  }

  // Get provider profile
  const { data: providerData } = await supabase
    .from('provider_profiles')
    .select('id, status')
    .eq('user_id', user.id)
    .single()

  const provider = providerData as { id: string; status: string } | null
  if (!provider) {
    return { error: 'No tienes un perfil de proveedor.' }
  }

  if (provider.status !== 'active' && provider.status !== 'approved_incomplete') {
    return { error: 'Tu cuenta de proveedor no esta activa.' }
  }

  const rawData = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    short_description: (formData.get('short_description') as string) || '',
    destination_id: formData.get('destination_id') as string,
    category_id: formData.get('category_id') as string,
    subcategory_id: (formData.get('subcategory_id') as string) || '',
    highlights: formData.getAll('highlights').filter(Boolean) as string[],
    includes: formData.getAll('includes').filter(Boolean) as string[],
    excludes: formData.getAll('excludes').filter(Boolean) as string[],
    requirements: formData.getAll('requirements').filter(Boolean) as string[],
    meeting_point: (formData.get('meeting_point') as string) || '',
    duration_minutes: formData.get('duration_minutes') as string,
    max_capacity: formData.get('max_capacity') as string,
    min_capacity: formData.get('min_capacity') as string,
    pricing_type: formData.get('pricing_type') as string,
    price_amount: formData.get('price_amount') as string,
    price_currency: (formData.get('price_currency') as string) || 'MXN',
    cancellation_policy: formData.get('cancellation_policy') as string,
  }

  const parsed = experienceSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { data: experience, error } = await insertInto(supabase, 'experiences', {
    provider_id: provider.id,
    destination_id: parsed.data.destination_id,
    category_id: parsed.data.category_id,
    subcategory_id: parsed.data.subcategory_id || null,
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    short_description: parsed.data.short_description || null,
    highlights: parsed.data.highlights || [],
    includes: parsed.data.includes || [],
    excludes: parsed.data.excludes || [],
    requirements: parsed.data.requirements || [],
    meeting_point: parsed.data.meeting_point || null,
    duration_minutes: parsed.data.duration_minutes || null,
    max_capacity: parsed.data.max_capacity,
    min_capacity: parsed.data.min_capacity || 1,
    pricing_type: parsed.data.pricing_type,
    price_amount: parsed.data.price_amount,
    price_currency: parsed.data.price_currency,
    cancellation_policy: parsed.data.cancellation_policy,
    status: 'pending_review',
  }).select('id').single()

  if (error) {
    return { error: 'Error al crear la experiencia. Intenta de nuevo.' }
  }

  redirect(`/provider/experiences/${(experience as { id: string }).id}/edit`)
}

export async function updateExperienceAction(
  _prevState: ExperienceActionState,
  formData: FormData
): Promise<ExperienceActionState> {
  const experienceId = formData.get('experience_id') as string
  if (!experienceId) {
    return { error: 'ID de experiencia no proporcionado.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Debes iniciar sesion.' }
  }

  // Verify ownership
  const { data: providerData2 } = await supabase
    .from('provider_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const provider2 = providerData2 as { id: string } | null
  if (!provider2) {
    return { error: 'No tienes un perfil de proveedor.' }
  }

  const { data: experienceData } = await supabase
    .from('experiences')
    .select('id, provider_id')
    .eq('id', experienceId)
    .single()

  const existingExp = experienceData as { id: string; provider_id: string } | null
  if (!existingExp || existingExp.provider_id !== provider2.id) {
    return { error: 'No tienes permiso para editar esta experiencia.' }
  }

  const rawData = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    short_description: (formData.get('short_description') as string) || '',
    destination_id: formData.get('destination_id') as string,
    category_id: formData.get('category_id') as string,
    subcategory_id: (formData.get('subcategory_id') as string) || '',
    highlights: formData.getAll('highlights').filter(Boolean) as string[],
    includes: formData.getAll('includes').filter(Boolean) as string[],
    excludes: formData.getAll('excludes').filter(Boolean) as string[],
    requirements: formData.getAll('requirements').filter(Boolean) as string[],
    meeting_point: (formData.get('meeting_point') as string) || '',
    duration_minutes: formData.get('duration_minutes') as string,
    max_capacity: formData.get('max_capacity') as string,
    min_capacity: formData.get('min_capacity') as string,
    pricing_type: formData.get('pricing_type') as string,
    price_amount: formData.get('price_amount') as string,
    price_currency: (formData.get('price_currency') as string) || 'MXN',
    cancellation_policy: formData.get('cancellation_policy') as string,
  }

  const parsed = experienceSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await updateTable(supabase, 'experiences', {
    destination_id: parsed.data.destination_id,
    category_id: parsed.data.category_id,
    subcategory_id: parsed.data.subcategory_id || null,
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    short_description: parsed.data.short_description || null,
    highlights: parsed.data.highlights || [],
    includes: parsed.data.includes || [],
    excludes: parsed.data.excludes || [],
    requirements: parsed.data.requirements || [],
    meeting_point: parsed.data.meeting_point || null,
    duration_minutes: parsed.data.duration_minutes || null,
    max_capacity: parsed.data.max_capacity,
    min_capacity: parsed.data.min_capacity || 1,
    pricing_type: parsed.data.pricing_type,
    price_amount: parsed.data.price_amount,
    price_currency: parsed.data.price_currency,
    cancellation_policy: parsed.data.cancellation_policy,
  }).eq('id', experienceId)

  if (error) {
    return { error: 'Error al actualizar la experiencia.' }
  }

  return { success: 'Experiencia actualizada correctamente.', experienceId }
}

export async function addAvailabilityAction(
  _prevState: ExperienceActionState,
  formData: FormData
): Promise<ExperienceActionState> {
  const experienceId = formData.get('experience_id') as string

  const rawData = {
    date: formData.get('date') as string,
    start_time: formData.get('start_time') as string,
    end_time: (formData.get('end_time') as string) || '',
    total_spots: formData.get('total_spots') as string,
    price_override: formData.get('price_override') as string,
  }

  const parsed = availabilitySchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Debes iniciar sesion.' }
  }

  // Verify ownership
  const { data: providerData3 } = await supabase
    .from('provider_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!providerData3) {
    return { error: 'No tienes un perfil de proveedor.' }
  }

  const { error } = await insertInto(supabase, 'experience_availability', {
    experience_id: experienceId,
    date: parsed.data.date,
    start_time: parsed.data.start_time,
    end_time: parsed.data.end_time || null,
    total_spots: parsed.data.total_spots,
    price_override: parsed.data.price_override || null,
  })

  if (error) {
    return { error: 'Error al agregar disponibilidad.' }
  }

  return { success: 'Disponibilidad agregada.', experienceId }
}

export async function submitExperienceForReviewAction(experienceId: string): Promise<ExperienceActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Debes iniciar sesion.' }
  }

  const { error } = await updateTable(supabase, 'experiences', {
    status: 'pending_review',
  }).eq('id', experienceId)

  if (error) {
    return { error: 'Error al enviar para revision.' }
  }

  return { success: 'Experiencia enviada para revision.' }
}
