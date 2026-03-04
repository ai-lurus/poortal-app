import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if ((profile as { role: string } | null)?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = request.nextUrl
  const query = searchParams.get('q') ?? ''
  const destinationId = searchParams.get('destination_id')
  const categoryId = searchParams.get('category_id')

  let dbQuery = (supabase as any)
    .from('experiences')
    .select('id, title, slug, price_amount, price_currency, average_rating, duration_minutes, status, categories(id, name)')
    .neq('status', 'archived')
    .limit(50)

  if (query.length >= 2) {
    dbQuery = dbQuery.ilike('title', `%${query}%`)
  }

  if (destinationId) {
    dbQuery = dbQuery.eq('destination_id', destinationId)
  }

  if (categoryId) {
    dbQuery = dbQuery.eq('category_id', categoryId)
  }

  const { data, error } = await dbQuery

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data ?? [])
}
