import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ProviderProfile, Category, Destination, Experience } from '@/types'
import { ExperienceForm } from '@/components/provider/experience-form'
import { AvailabilityManager } from '@/components/provider/availability-manager'

export const metadata = {
  title: 'Editar Experiencia',
}

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: provider } = await supabase
    .from('provider_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const typedProvider = provider as { id: string } | null
  if (!typedProvider) redirect('/register/provider')

  const { data: experience } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .eq('provider_id', typedProvider.id)
    .single()

  if (!experience) notFound()

  const [{ data: categories }, { data: destinations }, { data: availability }] = await Promise.all([
    supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('destinations').select('*').eq('is_active', true).order('name'),
    supabase
      .from('experience_availability')
      .select('*')
      .eq('experience_id', id)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date'),
  ])

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Editar Experiencia</h1>
        <p className="text-muted-foreground">
          {(experience as Experience).title}
        </p>
      </div>

      <div className="space-y-8">
        <ExperienceForm
          categories={(categories as Category[] | null) ?? []}
          destinations={(destinations as Destination[] | null) ?? []}
          experience={experience as Experience}
        />

        <AvailabilityManager
          experienceId={id}
          availability={(availability ?? []) as Array<{
            id: string
            date: string
            start_time: string
            end_time: string | null
            total_spots: number
            booked_spots: number
            price_override: number | null
            is_blocked: boolean
          }>}
        />
      </div>
    </div>
  )
}
