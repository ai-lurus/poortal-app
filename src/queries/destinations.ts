import { createClient } from '@/lib/supabase/server'
import type { Destination, Category } from '@/types'

export async function getDestinations(): Promise<Destination[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_active', true)
    .order('name')

  return (data as Destination[] | null) ?? []
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  return data as Destination | null
}

export async function getDestinationCategories(destinationId: string): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('destination_categories')
    .select(`
      category_id,
      categories (*)
    `)
    .eq('destination_id', destinationId)

  if (!data) return []

  return (data as Array<{ category_id: string; categories: Category }>)
    .map((dc) => dc.categories)
    .filter(Boolean)
}
