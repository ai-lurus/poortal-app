import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { CollectionWithExperiences, DestinationCollection } from '@/types'

const EXPERIENCE_FIELDS = `
  id,
  title,
  slug,
  short_description,
  price_amount,
  price_currency,
  average_rating,
  review_count,
  duration_minutes,
  experience_images ( url, is_cover )
`

export async function getDestinationCollections(
  destinationId: string
): Promise<CollectionWithExperiences[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('destination_collections')
    .select(`
      *,
      collection_experiences (
        *,
        experiences ( ${EXPERIENCE_FIELDS} )
      )
    `)
    .eq('destination_id', destinationId)
    .eq('is_active', true)
    .order('sort_order')
    .order('sort_order', { referencedTable: 'collection_experiences' })

  return (data as CollectionWithExperiences[] | null) ?? []
}

export async function getCollectionById(
  collectionId: string
): Promise<CollectionWithExperiences | null> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('destination_collections')
    .select(`
      *,
      collection_experiences (
        *,
        experiences ( ${EXPERIENCE_FIELDS} )
      )
    `)
    .eq('id', collectionId)
    .order('sort_order', { referencedTable: 'collection_experiences' })
    .single()

  return data as CollectionWithExperiences | null
}

export async function getCollectionsByDestinationAdmin(
  destinationId: string
): Promise<CollectionWithExperiences[]> {
  const supabase = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('destination_collections')
    .select(`
      *,
      collection_experiences (
        *,
        experiences ( ${EXPERIENCE_FIELDS} )
      )
    `)
    .eq('destination_id', destinationId)
    .order('sort_order')
    .order('sort_order', { referencedTable: 'collection_experiences' })

  if (error) console.error('[getCollectionsByDestinationAdmin] error:', error)

  return (data as CollectionWithExperiences[] | null) ?? []
}

export async function getAllCollections(): Promise<DestinationCollection[]> {
  const supabase = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('destination_collections')
    .select('*')
    .order('destination_id')
    .order('sort_order')

  if (error) console.error('[getAllCollections] error:', error)

  return (data as DestinationCollection[] | null) ?? []
}
