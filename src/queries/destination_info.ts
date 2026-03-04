import { createClient } from '@/lib/supabase/server'

export type DestinationInfoCategory = {
    id: string
    destination_id: string
    slug: string
    title: string
    icon: string
    color: string
    subtitle: string
    sort_order: number
}

export type DestinationInfoItem = {
    id: string
    category_id: string
    title: string
    description: string[]
    author: string | null
    date: string | null
    images_count: number | null
    actions: Record<string, boolean>
    sort_order: number
}

export async function getDestinationInfoCategories(destinationId: string): Promise<DestinationInfoCategory[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('destination_info_categories')
        .select('*')
        .eq('destination_id', destinationId)
        .order('sort_order', { ascending: true })

    if (error) {
        console.error('Error fetching destination info categories:', error)
        return []
    }

    return data as DestinationInfoCategory[]
}

export async function getDestinationInfoCategory(destinationId: string, slug: string): Promise<DestinationInfoCategory | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('destination_info_categories')
        .select('*')
        .eq('destination_id', destinationId)
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching destination info category:', error)
        return null
    }

    return data as DestinationInfoCategory
}

export async function getDestinationInfoItems(categoryId: string): Promise<DestinationInfoItem[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('destination_info_items')
        .select('*')
        .eq('category_id', categoryId)
        .order('sort_order', { ascending: true })

    if (error) {
        console.error('Error fetching destination info items:', error)
        return []
    }

    return data as DestinationInfoItem[]
}
