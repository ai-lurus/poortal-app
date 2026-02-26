'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'

export type AdminActionState = {
  error?: string
  success?: string
}

// Helper to perform typed updates bypassing strict generic inference
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateTable(supabase: SupabaseClient<any>, table: string, data: Record<string, unknown>) {
  return supabase.from(table).update(data)
}

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = (profile as { role: string } | null)?.role
  if (role !== 'admin') return null

  return { supabase, userId: user.id }
}

export async function approveProviderAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) {
    return { error: 'No tienes permisos de administrador.' }
  }

  const providerId = formData.get('provider_id') as string
  if (!providerId) {
    return { error: 'ID de proveedor no proporcionado.' }
  }

  const { error } = await updateTable(admin.supabase, 'provider_profiles', {
    status: 'approved_incomplete',
    approved_at: new Date().toISOString(),
    approved_by: admin.userId,
  }).eq('id', providerId)

  if (error) {
    return { error: 'Error al aprobar proveedor.' }
  }

  revalidatePath('/admin/providers')
  return { success: 'Proveedor aprobado correctamente.' }
}

export async function rejectProviderAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) {
    return { error: 'No tienes permisos de administrador.' }
  }

  const providerId = formData.get('provider_id') as string
  const reason = formData.get('rejection_reason') as string

  if (!providerId) {
    return { error: 'ID de proveedor no proporcionado.' }
  }

  const { error } = await updateTable(admin.supabase, 'provider_profiles', {
    status: 'rejected',
    rejection_reason: reason || 'No se proporciono motivo.',
  }).eq('id', providerId)

  if (error) {
    return { error: 'Error al rechazar proveedor.' }
  }

  revalidatePath('/admin/providers')
  return { success: 'Proveedor rechazado.' }
}

export async function suspendProviderAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) {
    return { error: 'No tienes permisos de administrador.' }
  }

  const providerId = formData.get('provider_id') as string
  const reason = formData.get('reason') as string

  const { error } = await updateTable(admin.supabase, 'provider_profiles', {
    status: 'suspended',
    rejection_reason: reason || null,
  }).eq('id', providerId)

  if (error) {
    return { error: 'Error al suspender proveedor.' }
  }

  revalidatePath('/admin/providers')
  return { success: 'Proveedor suspendido.' }
}

export async function approveExperienceAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) {
    return { error: 'No tienes permisos de administrador.' }
  }

  const experienceId = formData.get('experience_id') as string

  const { error } = await updateTable(admin.supabase, 'experiences', {
    status: 'active',
    published_at: new Date().toISOString(),
  }).eq('id', experienceId)

  if (error) {
    return { error: 'Error al aprobar experiencia.' }
  }

  revalidatePath('/admin/experiences')
  return { success: 'Experiencia aprobada y publicada.' }
}

export async function addRecommendationAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const destinationId = formData.get('destination_id') as string
  const experienceId = formData.get('experience_id') as string

  if (!destinationId || !experienceId) return { error: 'Datos incompletos.' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.supabase as any)
    .from('destination_recommendations')
    .insert({ destination_id: destinationId, experience_id: experienceId })

  if (error) return { error: 'Error al agregar recomendacion.' }

  revalidatePath(`/admin/destinations`)
  return { success: 'Recomendacion agregada.' }
}

export async function removeRecommendationAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const destinationId = formData.get('destination_id') as string
  const experienceId = formData.get('experience_id') as string

  if (!destinationId || !experienceId) return { error: 'Datos incompletos.' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.supabase as any)
    .from('destination_recommendations')
    .delete()
    .eq('destination_id', destinationId)
    .eq('experience_id', experienceId)

  if (error) return { error: 'Error al eliminar recomendacion.' }

  revalidatePath(`/admin/destinations`)
  return { success: 'Recomendacion eliminada.' }
}

export async function toggleFeaturedAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const experienceId = formData.get('experience_id') as string
  const isFeatured = formData.get('is_featured') === 'true'

  const { error } = await updateTable(admin.supabase, 'experiences', {
    is_featured: !isFeatured,
  }).eq('id', experienceId)

  if (error) return { error: 'Error al actualizar estado featured.' }

  revalidatePath('/admin/experiences')
  return { success: !isFeatured ? 'Marcada como recomendada.' : 'Quitada de recomendadas.' }
}

export async function rejectExperienceAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) {
    return { error: 'No tienes permisos de administrador.' }
  }

  const experienceId = formData.get('experience_id') as string
  const reason = formData.get('rejection_reason') as string

  const { error } = await updateTable(admin.supabase, 'experiences', {
    status: 'rejected',
    rejection_reason: reason || 'No se proporciono motivo.',
  }).eq('id', experienceId)

  if (error) {
    return { error: 'Error al rechazar experiencia.' }
  }

  revalidatePath('/admin/experiences')
  return { success: 'Experiencia rechazada.' }
}
