import { createClient } from '@/lib/supabase/server'
import type { Experience, ExperienceSearchResult } from '@/types'

async function rpcSearch(params: {
  search_query?: string | null
  dest_id?: string | null
  cat_id?: string | null
  subcat_id?: string | null
  min_price?: number | null
  max_price?: number | null
  min_rating?: number | null
  available_date?: string | null
  sort_by?: string
  page_size?: number
  page_offset?: number
}): Promise<ExperienceSearchResult[]> {
  // Log params to server console for debugging
  console.log('[Experiences] Fetching with params:', JSON.stringify(params, null, 2))

  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc('search_experiences', params)

  if (error) {
    console.error('[Experiences] RPC Error:', error)
    throw new Error(`Failed to fetch experiences: ${error.message} (${error.code})`)
  }

  // Use type assertion as fallback if data is null (which RPC might return if no rows)
  return (data as ExperienceSearchResult[] | null) ?? []
}

export async function searchExperiences(params: {
  searchQuery?: string
  destinationId?: string
  categoryId?: string
  subcategoryId?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  availableDate?: string
  sortBy?: string
  pageSize?: number
  pageOffset?: number
}): Promise<ExperienceSearchResult[]> {
  return rpcSearch({
    search_query: params.searchQuery || null,
    dest_id: params.destinationId || null,
    cat_id: params.categoryId || null,
    subcat_id: params.subcategoryId || null,
    min_price: params.minPrice ?? null,
    max_price: params.maxPrice ?? null,
    min_rating: params.minRating ?? null,
    available_date: params.availableDate || null,
    sort_by: params.sortBy || 'relevance',
    page_size: params.pageSize || 20,
    page_offset: params.pageOffset || 0,
  })
}

export type ExperienceWithDetails = Experience & {
  provider_profiles: { id: string; business_name: string; user_id: string } | null
  destinations: { name: string; slug: string } | null
  categories: { name: string; slug: string; icon: string | null } | null
  subcategories: { name: string; slug: string } | null
  experience_images: Array<{ id: string; url: string; alt_text: string | null; sort_order: number; is_cover: boolean }>
}

export async function getExperienceById(id: string): Promise<ExperienceWithDetails | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('experiences')
    .select(`
      *,
      provider_profiles (id, business_name, user_id),
      destinations (name, slug),
      categories (name, slug, icon),
      subcategories (name, slug),
      experience_images (id, url, alt_text, sort_order, is_cover)
    `)
    .eq('id', id)
    .single()

  return data as ExperienceWithDetails | null
}

export async function getExperienceAvailability(experienceId: string, fromDate?: string) {
  const supabase = await createClient()
  const today = fromDate || new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('experience_availability')
    .select('*')
    .eq('experience_id', experienceId)
    .eq('is_blocked', false)
    .gte('date', today)
    .order('date')

  return (data as Array<{
    id: string
    experience_id: string
    date: string
    start_time: string
    end_time: string | null
    total_spots: number
    booked_spots: number
    price_override: number | null
    is_blocked: boolean
  }> | null) ?? []
}

export async function getExperiencesByProvider(providerId: string): Promise<Experience[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('experiences')
    .select('*')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })

  return (data as Experience[] | null) ?? []
}

export async function getExperiencesByDestination(
  destinationId: string,
  limit = 12
): Promise<ExperienceSearchResult[]> {
  return rpcSearch({
    dest_id: destinationId,
    sort_by: 'rating',
    page_size: limit,
    page_offset: 0,
  })
}

export async function getExperiencesByCategory(
  categoryId: string,
  limit = 12
): Promise<ExperienceSearchResult[]> {
  return rpcSearch({
    cat_id: categoryId,
    sort_by: 'rating',
    page_size: limit,
    page_offset: 0,
  })
}

export async function getDestinationRecommendations(
  destinationId: string
): Promise<ExperienceSearchResult[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('destination_recommendations')
    .select(`
      sort_order,
      experiences (
        id,
        title,
        short_description,
        price_amount,
        price_currency,
        average_rating,
        review_count,
        category_id,
        destination_id,
        experience_images (url, is_cover)
      )
    `)
    .eq('destination_id', destinationId)
    .order('sort_order')

  if (error || !data) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[]).map((row) => {
    const exp = row.experiences
    return {
      id: exp.id,
      title: exp.title,
      short_description: exp.short_description ?? '',
      price_amount: Number(exp.price_amount),
      price_currency: exp.price_currency,
      average_rating: Number(exp.average_rating),
      review_count: exp.review_count,
      category_id: exp.category_id,
      destination_id: exp.destination_id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cover_image_url: exp.experience_images?.find((img: any) => img.is_cover)?.url
        ?? exp.experience_images?.[0]?.url
        ?? null,
    } as unknown as ExperienceSearchResult
  })
}

export async function getFeaturedExperiencesByCategory(
  categoryId: string,
  limit = 10
): Promise<ExperienceSearchResult[]> {
  const supabase = await createClient()

  // Directly query the table for featured items since rpcSearch might not support is_featured flag yet
  const { data, error } = await supabase
    .from('experiences')
    .select(`
      id,
      title,
      short_description,
      price_amount,
      price_currency,
      average_rating,
      review_count,
      category_id,
      destination_id,
      experience_images(url, is_cover)
    `)
    .eq('category_id', categoryId)
    .eq('status', 'active')
    .eq('is_featured', true)
    .limit(limit)

  if (error || !data) return []

  // Map to the expected type format
  return (data as any[]).map(exp => ({
    id: exp.id,
    title: exp.title,
    short_description: exp.short_description || '',
    price_amount: Number(exp.price_amount) || 0,
    price_currency: exp.price_currency || 'MXN',
    average_rating: Number(exp.average_rating) || 0,
    review_count: exp.review_count || 0,
    category_id: exp.category_id,
    destination_id: exp.destination_id,
    cover_image_url: exp.experience_images?.find((img: any) => img.is_cover)?.url || exp.experience_images?.[0]?.url || null
  } as unknown)) as ExperienceSearchResult[]
}
