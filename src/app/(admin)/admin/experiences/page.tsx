import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { ExperienceModeration } from '@/components/admin/experience-moderation'

export const metadata: Metadata = {
  title: 'Moderacion de Experiencias',
}

type ExperienceRow = {
  id: string
  title: string
  slug: string
  status: string
  price_amount: number
  price_currency: string
  created_at: string
  provider_profiles: { business_name: string } | null
  categories: { name: string } | null
}

export default async function AdminExperiencesPage() {
  const supabase = await createClient()

  const [{ data: pending }, { data: active }, { data: rejected }] = await Promise.all([
    supabase
      .from('experiences')
      .select('id, title, slug, status, price_amount, price_currency, created_at, provider_profiles (business_name), categories (name)')
      .eq('status', 'pending_review')
      .order('created_at', { ascending: false }),
    supabase
      .from('experiences')
      .select('id, title, slug, status, price_amount, price_currency, created_at, provider_profiles (business_name), categories (name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false }),
    supabase
      .from('experiences')
      .select('id, title, slug, status, price_amount, price_currency, created_at, provider_profiles (business_name), categories (name)')
      .in('status', ['rejected', 'draft', 'paused'])
      .order('created_at', { ascending: false }),
  ])

  const pendingList = (pending as ExperienceRow[] | null) ?? []
  const activeList = (active as ExperienceRow[] | null) ?? []
  const rejectedList = (rejected as ExperienceRow[] | null) ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Moderacion de Experiencias
        </h1>
        <p className="mt-1 text-muted-foreground">
          Revisa y modera las experiencias publicadas en la plataforma
        </p>
      </div>

      <Tabs defaultValue="pendientes">
        <TabsList>
          <TabsTrigger value="pendientes">
            <Clock className="mr-1 h-4 w-4" />
            En revision
            {pendingList.length > 0 && (
              <Badge variant="secondary" className="ml-2">{pendingList.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="activas">
            <CheckCircle className="mr-1 h-4 w-4" />
            Activas
            <Badge variant="secondary" className="ml-2">{activeList.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="otras">
            <AlertCircle className="mr-1 h-4 w-4" />
            Rechazadas/Otras
            <Badge variant="secondary" className="ml-2">{rejectedList.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes" className="mt-6">
          <ExperienceModeration
            experiences={pendingList}
            showActions
            emptyMessage="No hay experiencias pendientes de revision."
          />
        </TabsContent>

        <TabsContent value="activas" className="mt-6">
          <ExperienceModeration
            experiences={activeList}
            emptyMessage="No hay experiencias activas todavia."
          />
        </TabsContent>

        <TabsContent value="otras" className="mt-6">
          <ExperienceModeration
            experiences={rejectedList}
            emptyMessage="No hay experiencias rechazadas."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
