import { createClient } from '@/lib/supabase/server'
import type { ProviderProfile } from '@/types'

export async function getProviderByUserId(userId: string): Promise<ProviderProfile | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('provider_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  return data as ProviderProfile | null
}

export async function getProviderById(id: string): Promise<ProviderProfile | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('provider_profiles')
    .select('*')
    .eq('id', id)
    .single()

  return data as ProviderProfile | null
}

export type ProviderWithProfile = ProviderProfile & {
  profiles: { full_name: string; email: string; avatar_url: string | null } | null
  categories: { name: string; slug: string } | null
}

export async function getProvidersByStatus(
  status: ProviderProfile['status']
): Promise<ProviderWithProfile[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('provider_profiles')
    .select(`
      *,
      profiles:user_id (full_name, email, avatar_url),
      categories:category_id (name, slug)
    `)
    .eq('status', status)
    .order('created_at', { ascending: false })

  return (data as ProviderWithProfile[] | null) ?? []
}

export async function getAllProviders(): Promise<ProviderWithProfile[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('provider_profiles')
    .select(`
      *,
      profiles:user_id (full_name, email, avatar_url),
      categories:category_id (name, slug)
    `)
    .order('created_at', { ascending: false })

  return (data as ProviderWithProfile[] | null) ?? []
}

export async function getProviderExperienceCount(providerId: string): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('experiences')
    .select('*', { count: 'exact', head: true })
    .eq('provider_id', providerId)

  return count ?? 0
}
