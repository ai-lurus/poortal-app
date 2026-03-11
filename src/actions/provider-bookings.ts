'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type BookingActionResult = { success?: string; error?: string }

async function getProviderIdForUser(userId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('provider_profiles')
    .select('id')
    .eq('user_id', userId)
    .single()
  return (data as { id: string } | null)?.id ?? null
}

async function verifyBookingItemOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bookingItemId: string,
  providerId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('booking_items')
    .select('provider_id')
    .eq('id', bookingItemId)
    .single()
  return (data as { provider_id: string } | null)?.provider_id === providerId
}

export async function confirmBookingItemAction(
  bookingItemId: string,
  message?: string
): Promise<BookingActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado.' }

  const providerId = await getProviderIdForUser(user.id)
  if (!providerId) return { error: 'No tienes perfil de proveedor.' }

  const isOwner = await verifyBookingItemOwnership(supabase, bookingItemId, providerId)
  if (!isOwner) return { error: 'No tienes permiso para esta reserva.' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('booking_items')
    .update({
      status: 'confirmed',
      provider_message: message ?? null,
      responded_at: new Date().toISOString(),
    })
    .eq('id', bookingItemId)

  if (error) return { error: 'Error al confirmar la reserva.' }

  revalidatePath('/provider/bookings')
  return { success: 'Reserva confirmada.' }
}

export async function rejectBookingItemAction(
  bookingItemId: string,
  message: string
): Promise<BookingActionResult> {
  if (!message.trim()) return { error: 'Debes proporcionar un motivo de rechazo.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado.' }

  const providerId = await getProviderIdForUser(user.id)
  if (!providerId) return { error: 'No tienes perfil de proveedor.' }

  const isOwner = await verifyBookingItemOwnership(supabase, bookingItemId, providerId)
  if (!isOwner) return { error: 'No tienes permiso para esta reserva.' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('booking_items')
    .update({
      status: 'rejected',
      provider_message: message,
      responded_at: new Date().toISOString(),
    })
    .eq('id', bookingItemId)

  if (error) return { error: 'Error al rechazar la reserva.' }

  revalidatePath('/provider/bookings')
  return { success: 'Reserva rechazada.' }
}

export async function cancelBookingItemAction(
  bookingItemId: string,
  reason: string
): Promise<BookingActionResult> {
  if (!reason.trim()) return { error: 'Debes proporcionar un motivo de cancelacion.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado.' }

  const providerId = await getProviderIdForUser(user.id)
  if (!providerId) return { error: 'No tienes perfil de proveedor.' }

  const isOwner = await verifyBookingItemOwnership(supabase, bookingItemId, providerId)
  if (!isOwner) return { error: 'No tienes permiso para esta reserva.' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('booking_items')
    .update({
      status: 'cancelled',
      provider_message: reason,
      responded_at: new Date().toISOString(),
    })
    .eq('id', bookingItemId)

  if (error) return { error: 'Error al cancelar la reserva.' }

  revalidatePath('/provider/bookings')
  revalidatePath('/provider/cancellations')
  return { success: 'Reserva cancelada.' }
}
