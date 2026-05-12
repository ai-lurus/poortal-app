'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'
import { providerRegistrationSchema, providerCompleteProfileSchema } from '@/lib/validations/provider'
import { stripe } from '@/lib/stripe/config'

export type ProviderActionState = {
  error?: string
  success?: string
}

async function getCurrentProfileId(): Promise<{ userId: string; profileId: string } | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const profile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
    select: { id: true },
  })
  if (!profile) return null

  return { userId: session.user.id, profileId: profile.id }
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
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const current = await getCurrentProfileId()
  if (!current) return { error: 'Debes iniciar sesion para registrar tu negocio.' }

  const existing = await prisma.provider_profiles.findFirst({
    where: { user_id: current.profileId },
    select: { id: true },
  })
  if (existing) return { error: 'Ya tienes un perfil de proveedor registrado.' }

  const destination = await prisma.destinations.findFirst({
    where: { slug: 'cancun' },
    select: { id: true },
  })

  await prisma.provider_profiles.create({
    data: {
      user_id: current.profileId,
      destination_id: destination?.id ?? null,
      business_name: parsed.data.business_name,
      representative_name: parsed.data.representative_name,
      phone: parsed.data.phone,
      location: parsed.data.location,
      category_id: parsed.data.category_id,
      short_description: parsed.data.short_description,
      status: 'pending_review',
    },
  })

  await prisma.profiles.update({
    where: { id: current.profileId },
    data: { role: 'provider' },
  })

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
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const current = await getCurrentProfileId()
  if (!current) return { error: 'Debes iniciar sesion.' }

  await prisma.provider_profiles.updateMany({
    where: { user_id: current.profileId },
    data: {
      legal_name: parsed.data.legal_name,
      tax_id: parsed.data.tax_id || null,
      full_address: parsed.data.full_address,
      customer_phone: parsed.data.customer_phone,
      website: parsed.data.website || null,
      operating_hours: parsed.data.operating_hours ? { description: parsed.data.operating_hours } : undefined,
    },
  })

  return { success: 'Perfil actualizado correctamente.' }
}

export async function createStripeConnectOnboardingAction(): Promise<void> {
  const current = await getCurrentProfileId()
  if (!current) redirect('/login')

  const provider = await prisma.provider_profiles.findFirst({
    where: { user_id: current.profileId },
    include: {
      profiles_provider_profiles_user_idToprofiles: {
        select: { email: true },
      },
    },
  })
  if (!provider) redirect('/register/provider')

  let stripeAccountId = provider.stripe_account_id
  if (!stripeAccountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'MX',
      email: provider.profiles_provider_profiles_user_idToprofiles.email,
      business_profile: {
        name: provider.business_name,
        product_description: provider.short_description,
      },
      capabilities: {
        transfers: { requested: true },
      },
      metadata: {
        providerId: provider.id,
        profileId: current.profileId,
      },
    })

    stripeAccountId = account.id
    await prisma.provider_profiles.update({
      where: { id: provider.id },
      data: { stripe_account_id: stripeAccountId },
    })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    type: 'account_onboarding',
    refresh_url: `${appUrl}/provider/onboarding?stripe=refresh`,
    return_url: `${appUrl}/provider/onboarding?stripe=return`,
  })

  redirect(accountLink.url)
}

export async function syncStripeConnectStatus(providerId: string) {
  const provider = await prisma.provider_profiles.findUnique({
    where: { id: providerId },
    select: { stripe_account_id: true },
  })

  if (!provider?.stripe_account_id) return

  const account = await stripe.accounts.retrieve(provider.stripe_account_id)
  const complete = Boolean(account.details_submitted && account.charges_enabled && account.payouts_enabled)

  await prisma.provider_profiles.update({
    where: { id: providerId },
    data: { stripe_onboarding_complete: complete },
  })
}
