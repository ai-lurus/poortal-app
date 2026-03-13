'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function markNotificationReadAction(notificationId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: 'No autorizado' }

  await prisma.notifications.updateMany({
    where: { id: notificationId, user_id: session.user.id },
    data: { is_read: true },
  })

  revalidatePath('/provider/notifications')
  return { success: true }
}

export async function markAllNotificationsReadAction() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: 'No autorizado' }

  await prisma.notifications.updateMany({
    where: { user_id: session.user.id, is_read: false },
    data: { is_read: true },
  })

  revalidatePath('/provider/notifications')
  return { success: true }
}

export async function deleteNotificationAction(notificationId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: 'No autorizado' }

  await prisma.notifications.deleteMany({
    where: { id: notificationId, user_id: session.user.id },
  })

  revalidatePath('/provider/notifications')
  return { success: true }
}
