import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ProviderProfile } from '@/types'
import { OnboardingClient } from './onboarding-client'

export const metadata = {
  title: 'Onboarding Proveedor',
}

export default async function ProviderOnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data } = await supabase
    .from('provider_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const provider = data as ProviderProfile | null

  if (!provider) redirect('/register/provider')

  return <OnboardingClient provider={provider} />
}
