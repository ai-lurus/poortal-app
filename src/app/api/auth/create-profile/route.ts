import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  // Verify the caller is authenticated
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userId, full_name, email, phone } = await request.json() as {
    userId: string
    full_name: string
    email: string
    phone?: string
  }

  // Only allow creating a profile for the authenticated user
  if (session.user.id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const existing = await prisma.profiles.findFirst({ where: { user_id: userId } })
  if (existing) {
    return NextResponse.json({ profile: existing })
  }

  const profile = await prisma.profiles.create({
    data: {
      full_name,
      email,
      phone: phone || null,
      role: 'tourist',
      user_id: userId,
    },
  })

  return NextResponse.json({ profile })
}
