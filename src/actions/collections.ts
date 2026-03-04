'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type CollectionActionState = {
  error?: string
  success?: string
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

  return { supabase: createAdminClient() }
}

export async function createCollectionAction(
  _prevState: CollectionActionState,
  formData: FormData
): Promise<CollectionActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const destinationId = formData.get('destination_id') as string
  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || null
  const icon = (formData.get('icon') as string)?.trim() || null
  const sortOrder = parseInt(formData.get('sort_order') as string) || 0

  if (!destinationId || !name) {
    return { error: 'El nombre y el destino son obligatorios.' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.supabase as any)
    .from('destination_collections')
    .insert({ destination_id: destinationId, name, description, icon, sort_order: sortOrder })

  if (error) {
    console.error('[createCollectionAction] error:', error)
    return { error: `Error al crear la coleccion: ${error.message}` }
  }

  revalidatePath('/admin/destinations', 'layout')
  return { success: 'Coleccion creada correctamente.' }
}

export async function updateCollectionAction(
  _prevState: CollectionActionState,
  formData: FormData
): Promise<CollectionActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const collectionId = formData.get('collection_id') as string
  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || null
  const icon = (formData.get('icon') as string)?.trim() || null
  const sortOrder = parseInt(formData.get('sort_order') as string) || 0
  const isActive = formData.get('is_active') !== 'false'

  if (!collectionId || !name) {
    return { error: 'El nombre es obligatorio.' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.supabase as any)
    .from('destination_collections')
    .update({ name, description, icon, sort_order: sortOrder, is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', collectionId)

  if (error) return { error: 'Error al actualizar la coleccion.' }

  revalidatePath('/admin/destinations', 'layout')
  return { success: 'Coleccion actualizada.' }
}

export async function deleteCollectionAction(
  _prevState: CollectionActionState,
  formData: FormData
): Promise<CollectionActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const collectionId = formData.get('collection_id') as string
  if (!collectionId) return { error: 'ID de coleccion no proporcionado.' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.supabase as any)
    .from('destination_collections')
    .delete()
    .eq('id', collectionId)

  if (error) return { error: 'Error al eliminar la coleccion.' }

  revalidatePath('/admin/destinations', 'layout')
  return { success: 'Coleccion eliminada.' }
}

export async function addExperienceToCollectionAction(
  _prevState: CollectionActionState,
  formData: FormData
): Promise<CollectionActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const collectionId = formData.get('collection_id') as string
  const experienceId = formData.get('experience_id') as string

  if (!collectionId || !experienceId) return { error: 'Datos incompletos.' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.supabase as any)
    .from('collection_experiences')
    .insert({ collection_id: collectionId, experience_id: experienceId })

  if (error?.code === '23505') {
    return { error: 'Esta experiencia ya esta en la coleccion.' }
  }
  if (error) return { error: 'Error al agregar la experiencia.' }

  revalidatePath('/admin/destinations', 'layout')
  return { success: 'Experiencia agregada a la coleccion.' }
}

export async function removeExperienceFromCollectionAction(
  _prevState: CollectionActionState,
  formData: FormData
): Promise<CollectionActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const collectionId = formData.get('collection_id') as string
  const experienceId = formData.get('experience_id') as string

  if (!collectionId || !experienceId) return { error: 'Datos incompletos.' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.supabase as any)
    .from('collection_experiences')
    .delete()
    .eq('collection_id', collectionId)
    .eq('experience_id', experienceId)

  if (error) return { error: 'Error al eliminar la experiencia.' }

  revalidatePath('/admin/destinations', 'layout')
  return { success: 'Experiencia eliminada de la coleccion.' }
}
