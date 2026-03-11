/**
 * Script to create a test provider user for development.
 *
 * Usage:
 *   node scripts/seed-test-provider.js
 *
 * Creates:
 *   - Auth user: proveedor@test.poortal.mx / TestProvider123!
 *   - Profile with role: provider
 *   - Provider profile with status: active
 *   - 2 sample experiences (draft)
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const TEST_EMAIL = 'proveedor@test.poortal.mx'
const TEST_PASSWORD = 'TestProvider123!'

async function main() {
  console.log('Creating test provider user...\n')

  // 1. Get or create auth user
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  let userId = existingUsers?.users?.find((u) => u.email === TEST_EMAIL)?.id

  if (userId) {
    console.log(`Auth user already exists: ${userId}`)
  } else {
    const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
    })
    if (authError) {
      console.error('Error creating auth user:', authError.message)
      process.exit(1)
    }
    userId = newUser.user.id
    console.log(`Auth user created: ${userId}`)
  }

  // 2. Upsert profile with provider role
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: TEST_EMAIL,
      full_name: 'Carlos Mendez (Test)',
      phone: '+529981234567',
      role: 'provider',
    }, { onConflict: 'id' })

  if (profileError) {
    console.error('Error upserting profile:', profileError.message)
    process.exit(1)
  }
  console.log('Profile upserted with role: provider')

  // 3. Get first destination (for experience assignment)
  const { data: destination } = await supabase
    .from('destinations')
    .select('id, name, slug')
    .eq('is_active', true)
    .limit(1)
    .single()

  if (!destination) {
    console.warn('No active destination found — skipping experience creation.')
  }

  // 4. Get first category
  const { data: category } = await supabase
    .from('categories')
    .select('id, name')
    .eq('is_active', true)
    .limit(1)
    .single()

  // 5. Upsert provider profile
  const { data: existingProvider } = await supabase
    .from('provider_profiles')
    .select('id')
    .eq('user_id', userId)
    .single()

  let providerId = existingProvider?.id

  if (!providerId) {
    const { data: newProvider, error: providerError } = await supabase
      .from('provider_profiles')
      .insert({
        user_id: userId,
        destination_id: destination?.id ?? null,
        business_name: 'Aventuras Caribe MX',
        representative_name: 'Carlos Mendez',
        phone: '+529981234567',
        location: 'Cancun, Quintana Roo',
        category_id: category?.id ?? null,
        short_description: 'Tours y aventuras en el Caribe mexicano. Experiencias unicas para toda la familia.',
        status: 'active',
        legal_name: 'Aventuras Caribe MX S.A. de C.V.',
        tax_id: 'ACM123456789',
        full_address: 'Blvd. Kukulcan Km 12, Zona Hotelera, Cancun, Q.R., 77500',
        website: 'https://aventurascaribe.mx',
        stripe_onboarding_complete: false,
        approved_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (providerError) {
      console.error('Error creating provider profile:', providerError.message)
      process.exit(1)
    }
    providerId = newProvider.id
    console.log(`Provider profile created: ${providerId}`)
  } else {
    console.log(`Provider profile already exists: ${providerId}`)
  }

  // 6. Create sample experiences if we have a destination and category
  if (destination && category) {
    const sampleExperiences = [
      {
        provider_id: providerId,
        destination_id: destination.id,
        category_id: category.id,
        title: 'Tour en lancha por la laguna Nichupte',
        slug: `tour-lancha-laguna-nichupte-${Date.now()}`,
        description: 'Descubre la laguna Nichupte en una emocionante lancha a alta velocidad. Conoce los manglares, avista cocodrilos y disfrutamos de los mejores paisajes del destino.',
        short_description: 'Emocionante tour en lancha por la laguna Nichupte con avistamiento de fauna.',
        highlights: ['Guia experto incluido', 'Equipo de seguridad', 'Bebidas a bordo'],
        includes: ['Lancha privada', 'Chaleco salvavidas', 'Agua y refrescos'],
        excludes: ['Propinas', 'Comida', 'Transporte al punto de encuentro'],
        requirements: ['Edad minima 5 anos', 'Saber nadar recomendado'],
        meeting_point: 'Embarcadero Laguna Nichupte, Km 8, Zona Hotelera',
        duration_minutes: 90,
        max_capacity: 8,
        min_capacity: 2,
        pricing_type: 'per_person',
        price_amount: 850,
        price_currency: 'MXN',
        cancellation_policy: 'moderate',
        status: 'draft',
      },
      {
        provider_id: providerId,
        destination_id: destination.id,
        category_id: category.id,
        title: 'Snorkel en el arrecife Mesoamericano',
        slug: `snorkel-arrecife-mesoamericano-${Date.now()}`,
        description: 'Explora el segundo arrecife de coral mas grande del mundo. Nada junto a peces tropicales, tortugas marinas y una biodiversidad increible en aguas cristalinas del Caribe.',
        short_description: 'Snorkel en el arrecife de coral mas grande de America.',
        highlights: ['Equipo profesional incluido', 'Instructor certificado', 'Fotos y video del tour'],
        includes: ['Mascara y snorkel', 'Aletas', 'Chaleco de flotacion', 'Traje de neopreno opcional'],
        excludes: ['Propinas', 'Transporte al puerto'],
        requirements: ['Saber nadar', 'No tener enfermedades cardiacas'],
        meeting_point: 'Puerto Juarez, Cancun',
        duration_minutes: 240,
        max_capacity: 12,
        min_capacity: 4,
        pricing_type: 'per_person',
        price_amount: 1200,
        price_currency: 'MXN',
        cancellation_policy: 'flexible',
        status: 'draft',
      },
    ]

    for (const exp of sampleExperiences) {
      const { error: expError } = await supabase.from('experiences').insert(exp)
      if (expError) {
        if (expError.code === '23505') {
          console.log(`Experience "${exp.title}" slug conflict — skipped.`)
        } else {
          console.warn(`Could not create experience "${exp.title}":`, expError.message)
        }
      } else {
        console.log(`Experience created: "${exp.title}" (draft)`)
      }
    }
  }

  console.log('\n✓ Done!\n')
  console.log('Test provider credentials:')
  console.log(`  Email:    ${TEST_EMAIL}`)
  console.log(`  Password: ${TEST_PASSWORD}`)
  console.log(`  URL:      http://localhost:3000/provider/dashboard\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
