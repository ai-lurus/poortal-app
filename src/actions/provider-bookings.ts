'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'

export type BookingActionResult = { success?: string; error?: string }

async function getProviderIdForUser(profileId: string): Promise<string | null> {
  const provider = await prisma.provider_profiles.findFirst({
    where: { user_id: profileId },
    select: { id: true },
  })
  return provider?.id ?? null
}

async function verifyBookingItemOwnership(bookingItemId: string, providerId: string): Promise<boolean> {
  const item = await prisma.booking_items.findFirst({
    where: { id: bookingItemId },
    select: { provider_id: true },
  })
  return item?.provider_id === providerId
}

async function getCurrentProviderId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const profile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
    select: { id: true },
  })
  if (!profile) return null

  return getProviderIdForUser(profile.id)
}

export async function confirmBookingItemAction(
  bookingItemId: string,
  message?: string
): Promise<BookingActionResult> {
  const providerId = await getCurrentProviderId()
  if (!providerId) return { error: 'No autorizado o no tienes perfil de proveedor.' }

  const isOwner = await verifyBookingItemOwnership(bookingItemId, providerId)
  if (!isOwner) return { error: 'No tienes permiso para esta reserva.' }

  await prisma.booking_items.update({
    where: { id: bookingItemId },
    data: {
      status: 'confirmed',
      provider_message: message ?? null,
      responded_at: new Date(),
    },
  })

  revalidatePath('/provider/bookings')
  return { success: 'Reserva confirmada.' }
}

export async function rejectBookingItemAction(
  bookingItemId: string,
  message: string
): Promise<BookingActionResult> {
  if (!message.trim()) return { error: 'Debes proporcionar un motivo de rechazo.' }

  const providerId = await getCurrentProviderId()
  if (!providerId) return { error: 'No autorizado o no tienes perfil de proveedor.' }

  const isOwner = await verifyBookingItemOwnership(bookingItemId, providerId)
  if (!isOwner) return { error: 'No tienes permiso para esta reserva.' }

  await prisma.booking_items.update({
    where: { id: bookingItemId },
    data: {
      status: 'rejected',
      provider_message: message,
      responded_at: new Date(),
    },
  })

  revalidatePath('/provider/bookings')
  return { success: 'Reserva rechazada.' }
}

export async function cancelBookingItemAction(
  bookingItemId: string,
  reason: string
): Promise<BookingActionResult> {
  if (!reason.trim()) return { error: 'Debes proporcionar un motivo de cancelacion.' }

  const providerId = await getCurrentProviderId()
  if (!providerId) return { error: 'No autorizado o no tienes perfil de proveedor.' }

  const isOwner = await verifyBookingItemOwnership(bookingItemId, providerId)
  if (!isOwner) return { error: 'No tienes permiso para esta reserva.' }

  await prisma.booking_items.update({
    where: { id: bookingItemId },
    data: {
      status: 'cancelled',
      provider_message: reason,
      responded_at: new Date(),
    },
  })

  revalidatePath('/provider/bookings')
  revalidatePath('/provider/cancellations')
  return { success: 'Reserva cancelada.' }
}
