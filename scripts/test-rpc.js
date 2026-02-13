const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
    const params = {
        search_query: null,
        dest_id: null,
        cat_id: null,
        subcat_id: null,
        min_price: null,
        max_price: null,
        min_rating: null,
        available_date: null,
        sort_by: 'relevance',
        page_size: 20,
        page_offset: 0
    }

    console.log('Testing search_experiences RPC with params:', params)
    const { data, error } = await supabase.rpc('search_experiences', params)

    if (error) {
        console.error('RPC Error:', error)
    } else {
        console.log('RPC Success. Data length:', data ? data.length : 0)
        if (data && data.length > 0) {
            console.log('First item:', data[0])
        } else {
            console.log('No data returned.')
        }
    }
}

test()
