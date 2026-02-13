import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ProviderProfile, Category, Destination } from '@/types'
import { ExperienceForm } from '@/components/provider/experience-form'

export const metadata = {
  title: 'Nueva Experiencia',
}

export default async function NewExperiencePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: provider } = await supabase
    .from('provider_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const typedProvider = provider as ProviderProfile | null
  if (!typedProvider) redirect('/register/provider')
  if (typedProvider.status !== 'active' && typedProvider.status !== 'approved_incomplete') {
    redirect('/provider/onboarding')
  }

  const [{ data: categories }, { data: destinations }] = await Promise.all([
    supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('destinations').select('*').eq('is_active', true).order('name'),
  ])

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nueva Experiencia</h1>
        <p className="text-muted-foreground">
          Completa los datos de tu experiencia. Podras agregar imagenes y disponibilidad despues.
        </p>
      </div>

      <ExperienceForm
        categories={(categories as Category[] | null) ?? []}
        destinations={(destinations as Destination[] | null) ?? []}
      />
    </div>
  )
}
