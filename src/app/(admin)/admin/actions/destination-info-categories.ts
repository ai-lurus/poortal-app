'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createInfoCategory(data: {
    destination_id: string
    title: string
    slug: string
    icon: string | null
    color: string | null
    subtitle: string | null
}) {
    const supabase = await createClient()

    // Find max sort order
    const { data: categories } = await supabase
        .from('destination_info_categories')
        .select('sort_order')
        .eq('destination_id', data.destination_id)
        .order('sort_order', { ascending: false })
        .limit(1)

    const maxOrder = categories?.[0]?.sort_order ?? 0

    const { error } = await supabase
        .from('destination_info_categories')
        .insert({
            ...data,
            sort_order: maxOrder + 1,
        })

    if (error) {
        console.error('Error creating info category:', error)
        return { success: false, error: 'Error al crear categoría de información' }
    }

    revalidatePath(`/admin/destinations/${data.destination_id}`)
    return { success: true }
}

export async function updateInfoCategory(
    id: string,
    data: {
        title?: string
        slug?: string
        icon?: string | null
        color?: string | null
        subtitle?: string | null
    },
    destinationId: string
) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('destination_info_categories')
        .update(data)
        .eq('id', id)

    if (error) {
        console.error('Error updating info category:', error)
        return { success: false, error: 'Error al actualizar categoría de información' }
    }

    revalidatePath(`/admin/destinations/${destinationId}`)
    return { success: true }
}

export async function deleteInfoCategory(id: string, destinationId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('destination_info_categories')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting info category:', error)
        return { success: false, error: 'Error al eliminar categoría de información' }
    }

    revalidatePath(`/admin/destinations/${destinationId}`)
    return { success: true }
}

export async function updateInfoCategoriesOrder(
    orderedIds: string[],
    destinationId: string
) {
    const supabase = await createClient()

    const updates = orderedIds.map((id, index) => ({
        id,
        sort_order: index,
    }))

    const { error } = await supabase
        .from('destination_info_categories')
        .upsert(updates)

    if (error) {
        console.error('Error updating info categories order:', error)
        return { success: false, error: 'Error al reordenar categorías' }
    }

    revalidatePath(`/admin/destinations/${destinationId}`)
    return { success: true }
}
