'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createInfoItem(
    data: {
        category_id: string
        title: string
        description: string[]
        author: string | null
        date: string | null
        images_count: number | null
        actions: Record<string, boolean>
    },
    destinationId: string
) {
    const supabase = await createClient()

    // Find max sort order
    const { data: items } = await supabase
        .from('destination_info_items')
        .select('sort_order')
        .eq('category_id', data.category_id)
        .order('sort_order', { ascending: false })
        .limit(1)

    const maxOrder = items?.[0]?.sort_order ?? 0

    const { error } = await supabase
        .from('destination_info_items')
        .insert({
            ...data,
            sort_order: maxOrder + 1,
        })

    if (error) {
        console.error('Error creating info item:', error)
        return { success: false, error: 'Error al crear elemento de información' }
    }

    revalidatePath(`/admin/destinations/${destinationId}`)
    return { success: true }
}

export async function updateInfoItem(
    id: string,
    data: {
        title?: string
        description?: string[]
        author?: string | null
        date?: string | null
        images_count?: number | null
        actions?: Record<string, boolean>
    },
    destinationId: string
) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('destination_info_items')
        .update(data)
        .eq('id', id)

    if (error) {
        console.error('Error updating info item:', error)
        return { success: false, error: 'Error al actualizar elemento' }
    }

    revalidatePath(`/admin/destinations/${destinationId}`)
    return { success: true }
}

export async function deleteInfoItem(id: string, destinationId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('destination_info_items')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting info item:', error)
        return { success: false, error: 'Error al eliminar elemento' }
    }

    revalidatePath(`/admin/destinations/${destinationId}`)
    return { success: true }
}

export async function updateInfoItemsOrder(
    orderedIds: string[],
    destinationId: string
) {
    const supabase = await createClient()

    const updates = orderedIds.map((id, index) => ({
        id,
        sort_order: index,
    }))

    const { error } = await supabase
        .from('destination_info_items')
        .upsert(updates)

    if (error) {
        console.error('Error updating info items order:', error)
        return { success: false, error: 'Error al reordenar elementos' }
    }

    revalidatePath(`/admin/destinations/${destinationId}`)
    return { success: true }
}
