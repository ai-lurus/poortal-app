import { createClient } from '@/lib/supabase/server'
import type { Category, Subcategory } from '@/types'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  return (data as Category[] | null) ?? []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  return data as Category | null
}

export async function getSubcategories(categoryId: string): Promise<Subcategory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('sort_order')

  return (data as Subcategory[] | null) ?? []
}
