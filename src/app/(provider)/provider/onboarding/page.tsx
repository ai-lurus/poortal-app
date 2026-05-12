import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import { OnboardingClient } from './onboarding-client'
import { syncStripeConnectStatus } from '@/actions/providers'

export const metadata = {
  title: 'Onboarding Proveedor',
}

export default async function ProviderOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ stripe?: string }>
}) {
  const { stripe } = await searchParams
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  let provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) redirect('/register/provider')

  if (stripe === 'return' && provider.stripe_account_id) {
    await syncStripeConnectStatus(provider.id)
    provider = await getProviderByAuthUserId(session.user.id)
    if (!provider) redirect('/register/provider')
  }

  return <OnboardingClient provider={provider} />
}
