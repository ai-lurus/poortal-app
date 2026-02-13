-- ============================================================
-- POORTAL Seed Data — Cancun
-- ============================================================
-- Run with: supabase db reset (applies migrations + seed)

-- Disable FK checks and triggers for seeding
SET session_replication_role = 'replica';

-- ============================================================
-- 1. DESTINATION
-- ============================================================
insert into public.destinations (id, name, slug, description, country, state, city, latitude, longitude, is_active)
values
  ('d0000000-0000-0000-0000-000000000001', 'Cancun', 'cancun',
   'Playas de arena blanca, aguas turquesa y cultura maya. Cancun es el destino turistico mas popular de Mexico con aventuras acuaticas, ruinas arqueologicas y vida nocturna vibrante.',
   'Mexico', 'Quintana Roo', 'Cancun', 21.1619, -86.8515, true);

-- ============================================================
-- 2. CATEGORIES
-- ============================================================
insert into public.categories (id, name, slug, description, icon, sort_order) values
  ('c0000001-0000-0000-0000-000000000001', 'Tours y Excursiones', 'tours', 'Tours guiados, excursiones y actividades organizadas', 'Compass', 1),
  ('c0000001-0000-0000-0000-000000000002', 'Deportes Acuaticos', 'deportes-acuaticos', 'Snorkel, buceo, kayak, parasailing y mas', 'Waves', 2),
  ('c0000001-0000-0000-0000-000000000003', 'Renta de Vehiculos', 'renta-vehiculos', 'Autos, motos y scooters', 'Car', 3),
  ('c0000001-0000-0000-0000-000000000004', 'Restaurantes', 'restaurantes', 'Gastronomia local e internacional', 'Utensils', 4),
  ('c0000001-0000-0000-0000-000000000005', 'Bienestar y Spa', 'bienestar-spa', 'Masajes, temazcal y relajacion', 'Heart', 5),
  ('c0000001-0000-0000-0000-000000000006', 'Vida Nocturna', 'vida-nocturna', 'Bares, clubs y fiestas', 'Moon', 6),
  ('c0000001-0000-0000-0000-000000000007', 'Transporte', 'transporte', 'Traslados y transporte privado', 'Bus', 7),
  ('c0000001-0000-0000-0000-000000000008', 'Cultura', 'experiencias-culturales', 'Ruinas mayas, museos y tradiciones', 'Landmark', 8);

-- ============================================================
-- 3. SUBCATEGORIES
-- ============================================================
insert into public.subcategories (id, category_id, name, slug, sort_order) values
  -- Tours
  ('50000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Tours Arqueologicos', 'tours-arqueologicos', 1),
  ('50000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'Tours en Lancha', 'tours-en-lancha', 2),
  ('50000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001', 'Tours de Naturaleza', 'tours-naturaleza', 3),
  ('50000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000001', 'Tours Privados', 'tours-privados', 4),
  -- Deportes Acuaticos
  ('50000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000002', 'Snorkel', 'snorkel', 1),
  ('50000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000002', 'Buceo', 'buceo', 2),
  ('50000001-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000002', 'Parasailing', 'parasailing', 3),
  ('50000001-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000002', 'Kayak y Paddleboard', 'kayak-paddleboard', 4),
  -- Renta de Vehiculos
  ('50000001-0000-0000-0000-000000000009', 'c0000001-0000-0000-0000-000000000003', 'Autos', 'autos', 1),
  ('50000001-0000-0000-0000-000000000010', 'c0000001-0000-0000-0000-000000000003', 'Motos y Scooters', 'motos-scooters', 2),
  -- Restaurantes
  ('50000001-0000-0000-0000-000000000011', 'c0000001-0000-0000-0000-000000000004', 'Mariscos', 'mariscos', 1),
  ('50000001-0000-0000-0000-000000000012', 'c0000001-0000-0000-0000-000000000004', 'Cocina Mexicana', 'cocina-mexicana', 2),
  ('50000001-0000-0000-0000-000000000013', 'c0000001-0000-0000-0000-000000000004', 'Internacional', 'internacional', 3),
  -- Bienestar
  ('50000001-0000-0000-0000-000000000014', 'c0000001-0000-0000-0000-000000000005', 'Spa y Masajes', 'spa-masajes', 1),
  ('50000001-0000-0000-0000-000000000015', 'c0000001-0000-0000-0000-000000000005', 'Yoga', 'yoga', 2),
  ('50000001-0000-0000-0000-000000000016', 'c0000001-0000-0000-0000-000000000005', 'Temazcal', 'temazcal', 3),
  -- Vida Nocturna
  ('50000001-0000-0000-0000-000000000017', 'c0000001-0000-0000-0000-000000000006', 'Bares', 'bares', 1),
  ('50000001-0000-0000-0000-000000000018', 'c0000001-0000-0000-0000-000000000006', 'Clubs', 'clubs', 2),
  -- Transporte
  ('50000001-0000-0000-0000-000000000019', 'c0000001-0000-0000-0000-000000000007', 'Traslados Aeropuerto', 'traslados-aeropuerto', 1),
  ('50000001-0000-0000-0000-000000000020', 'c0000001-0000-0000-0000-000000000007', 'Taxi Privado', 'taxi-privado', 2),
  -- Cultura
  ('50000001-0000-0000-0000-000000000021', 'c0000001-0000-0000-0000-000000000008', 'Ruinas Mayas', 'ruinas-mayas', 1),
  ('50000001-0000-0000-0000-000000000022', 'c0000001-0000-0000-0000-000000000008', 'Museos', 'museos', 2),
  ('50000001-0000-0000-0000-000000000023', 'c0000001-0000-0000-0000-000000000008', 'Talleres Artesanales', 'talleres-artesanales', 3);

-- ============================================================
-- 4. DESTINATION ↔ CATEGORIES
-- ============================================================
insert into public.destination_categories (destination_id, category_id)
select 'd0000000-0000-0000-0000-000000000001', id from public.categories;

-- ============================================================
-- 5. PROFILES
-- ============================================================
-- Admin
insert into public.profiles (id, email, full_name, phone, role, preferred_language) values
  ('a0000001-0000-0000-0000-000000000001', 'admin@poortal.com', 'Ana Martinez', '+52 998 100 0001', 'admin', 'es');

-- Providers
insert into public.profiles (id, email, full_name, phone, role, preferred_language) values
  ('a0000001-0000-0000-0000-000000000010', 'carlos@caribetours.mx', 'Carlos Gonzalez', '+52 998 200 0001', 'provider', 'es'),
  ('a0000001-0000-0000-0000-000000000011', 'maria@aquacancun.mx', 'Maria Lopez', '+52 998 200 0002', 'provider', 'es'),
  ('a0000001-0000-0000-0000-000000000012', 'roberto@mayaexplorer.mx', 'Roberto Hernandez', '+52 998 200 0003', 'provider', 'es'),
  ('a0000001-0000-0000-0000-000000000013', 'lucia@saborcancun.mx', 'Lucia Ramirez', '+52 998 200 0004', 'provider', 'es'),
  ('a0000001-0000-0000-0000-000000000014', 'diego@zenresort.mx', 'Diego Torres', '+52 998 200 0005', 'provider', 'es');

-- Tourists
insert into public.profiles (id, email, full_name, phone, role, nationality, preferred_language) values
  ('a0000001-0000-0000-0000-000000000020', 'sofia@gmail.com', 'Sofia Vargas', '+52 55 3000 0001', 'tourist', 'MX', 'es'),
  ('a0000001-0000-0000-0000-000000000021', 'john@gmail.com', 'John Smith', '+1 512 400 0001', 'tourist', 'US', 'en'),
  ('a0000001-0000-0000-0000-000000000022', 'emma@gmail.com', 'Emma Wilson', '+1 305 500 0001', 'tourist', 'US', 'en'),
  ('a0000001-0000-0000-0000-000000000023', 'pedro@gmail.com', 'Pedro Sanchez', '+52 33 6000 0001', 'tourist', 'MX', 'es');

-- ============================================================
-- 6. PROVIDER PROFILES
-- ============================================================
insert into public.provider_profiles (id, user_id, destination_id, business_name, representative_name, phone, location, category_id, short_description, status, approved_at, approved_by) values
  ('f0000001-0000-0000-0000-000000000001',
   'a0000001-0000-0000-0000-000000000010',
   'd0000000-0000-0000-0000-000000000001',
   'Caribe Tours Cancun', 'Carlos Gonzalez', '+52 998 200 0001',
   'Zona Hotelera, Cancun',
   'c0000001-0000-0000-0000-000000000001',
   'Tours guiados a las mejores ruinas mayas y cenotes de la Riviera Maya. Mas de 10 anos de experiencia.',
   'active', now() - interval '30 days', 'a0000001-0000-0000-0000-000000000001'),

  ('f0000001-0000-0000-0000-000000000002',
   'a0000001-0000-0000-0000-000000000011',
   'd0000000-0000-0000-0000-000000000001',
   'Aqua Cancun Adventures', 'Maria Lopez', '+52 998 200 0002',
   'Playa Delfines, Cancun',
   'c0000001-0000-0000-0000-000000000002',
   'Snorkel, buceo y parasailing en las aguas cristalinas del Caribe mexicano.',
   'active', now() - interval '25 days', 'a0000001-0000-0000-0000-000000000001'),

  ('f0000001-0000-0000-0000-000000000003',
   'a0000001-0000-0000-0000-000000000012',
   'd0000000-0000-0000-0000-000000000001',
   'Maya Explorer', 'Roberto Hernandez', '+52 998 200 0003',
   'Centro, Cancun',
   'c0000001-0000-0000-0000-000000000008',
   'Experiencias culturales autenticas: ruinas mayas, museos y talleres de artesanias.',
   'active', now() - interval '20 days', 'a0000001-0000-0000-0000-000000000001'),

  ('f0000001-0000-0000-0000-000000000004',
   'a0000001-0000-0000-0000-000000000013',
   'd0000000-0000-0000-0000-000000000001',
   'Sabor Cancun', 'Lucia Ramirez', '+52 998 200 0004',
   'Zona Hotelera, Cancun',
   'c0000001-0000-0000-0000-000000000004',
   'Restaurante de cocina mexicana contemporanea con ingredientes locales y vista al mar.',
   'active', now() - interval '15 days', 'a0000001-0000-0000-0000-000000000001'),

  ('f0000001-0000-0000-0000-000000000005',
   'a0000001-0000-0000-0000-000000000014',
   'd0000000-0000-0000-0000-000000000001',
   'Zen Spa & Wellness', 'Diego Torres', '+52 998 200 0005',
   'Punta Cancun',
   'c0000001-0000-0000-0000-000000000005',
   'Spa de lujo con temazcal, masajes y tratamientos holisticos frente al mar.',
   'active', now() - interval '10 days', 'a0000001-0000-0000-0000-000000000001');

-- ============================================================
-- 7. EXPERIENCES
-- ============================================================
insert into public.experiences (
  id, provider_id, destination_id, category_id, subcategory_id,
  title, slug, description, short_description,
  highlights, includes, excludes, requirements,
  meeting_point, meeting_point_lat, meeting_point_lng,
  duration_minutes, max_capacity, min_capacity,
  pricing_type, price_amount, price_currency,
  cancellation_policy, status, average_rating, review_count, published_at
) values
  -- 1. Chichen Itza Tour
  ('e0000001-0000-0000-0000-000000000001',
   'f0000001-0000-0000-0000-000000000001',
   'd0000000-0000-0000-0000-000000000001',
   'c0000001-0000-0000-0000-000000000001',
   '50000001-0000-0000-0000-000000000001',
   'Tour a Chichen Itza con Cenote', 'tour-chichen-itza-cenote',
   'Visita una de las 7 Maravillas del Mundo Moderno con guia certificado. Incluye parada en cenote para nadar y almuerzo buffet de cocina yucateca. Recorrido por la piramide de Kukulkan, el Templo de los Guerreros y el Juego de Pelota.',
   'Tour completo a Chichen Itza con cenote y almuerzo incluido',
   array['Guia certificado bilingue', 'Parada en cenote Ik Kil', 'Almuerzo buffet yucateco', 'Tiempo libre para compras de artesanias'],
   array['Transporte climatizado ida y vuelta', 'Guia certificado', 'Entrada a Chichen Itza', 'Entrada a cenote', 'Almuerzo buffet', 'Seguro de viajero'],
   array['Propinas', 'Bebidas alcoholicas', 'Fotos profesionales'],
   array['Llevar protector solar y sombrero', 'Zapatos comodos', 'Traje de bano para cenote'],
   'Lobby del hotel o punto de encuentro en Zona Hotelera', 21.1350, -86.7520,
   720, 40, 2, 'per_person', 1200.00, 'MXN',
   'moderate', 'active', 4.70, 28, now() - interval '28 days'),

  -- 2. Snorkel en Isla Mujeres
  ('e0000001-0000-0000-0000-000000000002',
   'f0000001-0000-0000-0000-000000000002',
   'd0000000-0000-0000-0000-000000000001',
   'c0000001-0000-0000-0000-000000000002',
   '50000001-0000-0000-0000-000000000005',
   'Snorkel en Isla Mujeres y MUSA', 'snorkel-isla-mujeres-musa',
   'Navega en catamaran a Isla Mujeres con paradas para snorkel en el arrecife y el Museo Subacuatico de Arte (MUSA). Incluye barra libre y tiempo libre en Playa Norte, una de las mejores playas del mundo.',
   'Catamaran a Isla Mujeres con snorkel en arrecife y museo subacuatico',
   array['Snorkel en MUSA', 'Playa Norte tiempo libre', 'Barra libre incluida', 'Musica en vivo a bordo'],
   array['Catamaran con barra libre', 'Equipo de snorkel', 'Chaleco salvavidas', 'Guia de snorkel', 'Almuerzo ligero'],
   array['Transporte al muelle', 'Fotos subacuaticas', 'Propinas'],
   array['Saber nadar', 'Protector solar biodegradable', 'Toalla personal'],
   'Marina Aquatours, Km 6.5 Zona Hotelera', 21.1180, -86.7610,
   420, 60, 4, 'per_person', 1800.00, 'MXN',
   'flexible', 'active', 4.85, 42, now() - interval '25 days'),

  -- 3. Buceo en arrecifes
  ('e0000001-0000-0000-0000-000000000003',
   'f0000001-0000-0000-0000-000000000002',
   'd0000000-0000-0000-0000-000000000001',
   'c0000001-0000-0000-0000-000000000002',
   '50000001-0000-0000-0000-000000000006',
   'Buceo en Arrecifes de Cancun (2 tanques)', 'buceo-arrecifes-cancun',
   'Inmersion de 2 tanques en los mejores arrecifes de Cancun. Ideal para buzos certificados. Explora formaciones coralinas, tortugas marinas y una gran diversidad de peces tropicales.',
   'Buceo de 2 tanques en arrecifes con tortugas y corales',
   array['2 inmersiones en arrecifes diferentes', 'Tortugas y vida marina abundante', 'Grupos reducidos'],
   array['Equipo completo de buceo', 'Tanques y plomos', 'Guia divemaster', 'Snack y agua', 'Seguro de buceo'],
   array['Transporte al muelle', 'Certificacion PADI (costo adicional)'],
   array['Certificacion Open Water vigente', 'Buena condicion de salud'],
   'Aqua Cancun Dive Shop, Playa Delfines', 21.0790, -86.7720,
   240, 8, 2, 'per_person', 2800.00, 'MXN',
   'strict', 'active', 4.90, 15, now() - interval '22 days'),

  -- 4. Ruinas de Tulum + Cenote
  ('e0000001-0000-0000-0000-000000000004',
   'f0000001-0000-0000-0000-000000000003',
   'd0000000-0000-0000-0000-000000000001',
   'c0000001-0000-0000-0000-000000000008',
   '50000001-0000-0000-0000-000000000021',
   'Ruinas de Tulum + Gran Cenote', 'ruinas-tulum-gran-cenote',
   'Explora las ruinas mayas frente al mar Caribe en Tulum y refrescate en el espectacular Gran Cenote. Guia especializado en historia maya con explicacion detallada de la civilizacion.',
   'Visita las ruinas mayas de Tulum con vista al Caribe y nada en Gran Cenote',
   array['Ruinas de Tulum con vista al mar', 'Gran Cenote para nadar', 'Guia especializado en cultura maya', 'Fotos en los mejores spots'],
   array['Transporte climatizado', 'Guia especializado', 'Entradas a Tulum', 'Entrada a Gran Cenote', 'Almuerzo'],
   array['Propinas', 'Recuerdos'],
   array['Protector solar biodegradable', 'Zapatos comodos', 'Traje de bano'],
   'Lobby del hotel, Zona Hotelera', 21.1350, -86.7520,
   600, 30, 2, 'per_person', 1500.00, 'MXN',
   'moderate', 'active', 4.65, 35, now() - interval '18 days'),

  -- 5. Cena Gourmet
  ('e0000001-0000-0000-0000-000000000005',
   'f0000001-0000-0000-0000-000000000004',
   'd0000000-0000-0000-0000-000000000001',
   'c0000001-0000-0000-0000-000000000004',
   '50000001-0000-0000-0000-000000000012',
   'Cena Mexicana Gourmet con Vista al Mar', 'cena-mexicana-gourmet-vista-mar',
   'Disfruta de una experiencia gastronomica de 5 tiempos con cocina mexicana contemporanea. Cada platillo maridado con mezcal o vino mexicano. Vista panoramica al mar Caribe al atardecer.',
   'Cena de 5 tiempos de cocina mexicana contemporanea con vista al mar',
   array['Menu de 5 tiempos', 'Maridaje con mezcal o vino', 'Vista panoramica al Caribe', 'Chef ejecutivo Lucia Ramirez'],
   array['Cena de 5 tiempos', 'Maridaje de 3 bebidas', 'Cafe o te', 'Valet parking'],
   array['Bebidas adicionales', 'Propina'],
   array['Reservar con 24h de anticipacion', 'Codigo de vestimenta smart casual'],
   'Sabor Cancun, Blvd Kukulcan Km 12.5, Zona Hotelera', 21.1020, -86.7680,
   150, 24, 2, 'per_person', 2200.00, 'MXN',
   'moderate', 'active', 4.80, 22, now() - interval '14 days'),

  -- 6. Parasailing
  ('e0000001-0000-0000-0000-000000000006',
   'f0000001-0000-0000-0000-000000000002',
   'd0000000-0000-0000-0000-000000000001',
   'c0000001-0000-0000-0000-000000000002',
   '50000001-0000-0000-0000-000000000007',
   'Parasailing en la Zona Hotelera', 'parasailing-zona-hotelera',
   'Vuela sobre las aguas turquesa del Caribe mexicano. El parasailing te eleva hasta 80 metros de altura con vistas espectaculares de la Zona Hotelera y la Laguna Nichupte.',
   'Vuelo en parasailing con vistas increibles del Caribe',
   array['Vistas aereas de la Zona Hotelera', 'Hasta 80m de altura', 'Vuelo individual o en pareja'],
   array['Equipo de parasailing', 'Lancha y tripulacion', 'Chaleco salvavidas', 'Instruccion de seguridad'],
   array['Fotos y video (cargo extra)', 'Transporte'],
   array['Peso maximo 120 kg', 'No apto para embarazadas', 'Mayores de 12 anos'],
   'Playa Chac Mool, Zona Hotelera', 21.1280, -86.7540,
   30, 4, 1, 'per_person', 1400.00, 'MXN',
   'flexible', 'active', 4.55, 18, now() - interval '12 days'),

  -- 7. Temazcal
  ('e0000001-0000-0000-0000-000000000007',
   'f0000001-0000-0000-0000-000000000005',
   'd0000000-0000-0000-0000-000000000001',
   'c0000001-0000-0000-0000-000000000005',
   '50000001-0000-0000-0000-000000000016',
   'Ritual de Temazcal al Atardecer', 'ritual-temazcal-atardecer',
   'Vive un ritual ancestral de purificacion en nuestro temazcal frente al mar. Guiado por un chaman certificado, la ceremonia incluye hierbas medicinales, cantos y meditacion. Termina con un bano de arcilla y relajacion junto a la alberca.',
   'Ceremonia ancestral de temazcal frente al mar con chaman',
   array['Chaman certificado', 'Hierbas medicinales', 'Vista al mar al atardecer', 'Bano de arcilla incluido'],
   array['Ceremonia de temazcal', 'Hierbas y aromaterapia', 'Bano de arcilla', 'Te de bienvenida', 'Acceso a alberca y regaderas'],
   array['Propinas', 'Tratamientos adicionales de spa'],
   array['No recomendado para personas con problemas cardiacos', 'Llevar traje de bano', 'Llegar 15 min antes'],
   'Zen Spa & Wellness, Punta Cancun', 21.1380, -86.7440,
   120, 12, 2, 'per_group', 3500.00, 'MXN',
   'strict', 'active', 4.95, 12, now() - interval '8 days'),

  -- 8. Ruta 3 Cenotes
  ('e0000001-0000-0000-0000-000000000008',
   'f0000001-0000-0000-0000-000000000001',
   'd0000000-0000-0000-0000-000000000001',
   'c0000001-0000-0000-0000-000000000001',
   '50000001-0000-0000-0000-000000000003',
   'Ruta de 3 Cenotes Secretos', 'ruta-3-cenotes-secretos',
   'Descubre 3 cenotes escondidos lejos del turismo masivo. Nada en cavernas con estalactitas, cenotes a cielo abierto y rios subterraneos. Incluye guia local que conoce los mejores rincones.',
   'Visita 3 cenotes escondidos con guia local experto',
   array['3 cenotes diferentes', 'Lejos del turismo masivo', 'Guia local experto', 'Experiencia autentica'],
   array['Transporte en van', 'Guia local', 'Entradas a 3 cenotes', 'Equipo de snorkel', 'Lunch artesanal', 'Agua y fruta'],
   array['Propinas', 'Fotos con drone (disponible)'],
   array['Saber nadar', 'Protector solar biodegradable', 'Zapatos acuaticos recomendados'],
   'Parque de las Palapas, Centro Cancun', 21.1630, -86.8280,
   480, 15, 2, 'per_person', 1600.00, 'MXN',
   'flexible', 'active', 4.75, 31, now() - interval '26 days');

-- ============================================================
-- 8. EXPERIENCE IMAGES
-- ============================================================
insert into public.experience_images (experience_id, url, alt_text, sort_order, is_cover) values
  ('e0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800', 'Piramide de Kukulkan en Chichen Itza', 0, true),
  ('e0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1570737543098-0c32dc3f9560?w=800', 'Cenote Ik Kil', 1, false),
  ('e0000001-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', 'Snorkel en aguas cristalinas', 0, true),
  ('e0000001-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', 'Playa Norte Isla Mujeres', 1, false),
  ('e0000001-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800', 'Buceo en arrecife de Cancun', 0, true),
  ('e0000001-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800', 'Ruinas de Tulum frente al mar', 0, true),
  ('e0000001-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1583225173760-4f7755b12ead?w=800', 'Gran Cenote', 1, false),
  ('e0000001-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', 'Cena gourmet mexicana', 0, true),
  ('e0000001-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800', 'Parasailing en Cancun', 0, true),
  ('e0000001-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800', 'Temazcal ceremonial', 0, true),
  ('e0000001-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1583225173760-4f7755b12ead?w=800', 'Cenote a cielo abierto', 0, true),
  ('e0000001-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1570737543098-0c32dc3f9560?w=800', 'Cenote subterraneo con estalactitas', 1, false);

-- ============================================================
-- 9. EXPERIENCE AVAILABILITY (next 14 days)
-- ============================================================
do $$
declare
  exp record;
  d integer;
  start_t time;
begin
  for exp in select id, max_capacity, duration_minutes from public.experiences where status = 'active'
  loop
    if exp.duration_minutes >= 480 then start_t := '07:00';
    elsif exp.duration_minutes >= 120 then start_t := '09:00';
    else start_t := '10:00';
    end if;

    for d in 1..14 loop
      insert into public.experience_availability (experience_id, date, start_time, total_spots, booked_spots, is_blocked)
      values (exp.id, current_date + d, start_t, exp.max_capacity, 0, false);
    end loop;
  end loop;
end;
$$;

-- ============================================================
-- 10. BOOKINGS & BOOKING ITEMS
-- ============================================================
insert into public.bookings (id, booking_number, user_id, status, total_amount, platform_fee, currency) values
  ('b0000001-0000-0000-0000-000000000001', 'POORTAL-A1B2C3', 'a0000001-0000-0000-0000-000000000020', 'completed', 2400.00, 360.00, 'MXN'),
  ('b0000001-0000-0000-0000-000000000002', 'POORTAL-D4E5F6', 'a0000001-0000-0000-0000-000000000021', 'completed', 3600.00, 540.00, 'MXN'),
  ('b0000001-0000-0000-0000-000000000003', 'POORTAL-G7H8I9', 'a0000001-0000-0000-0000-000000000022', 'confirmed', 4400.00, 660.00, 'MXN'),
  ('b0000001-0000-0000-0000-000000000004', 'POORTAL-J1K2L3', 'a0000001-0000-0000-0000-000000000023', 'paid', 1600.00, 240.00, 'MXN');

insert into public.booking_items (id, booking_id, experience_id, provider_id, status, quantity, unit_price, subtotal, service_date, service_time) values
  -- Sofia: 2x Chichen Itza
  ('b1000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001',
   'completed', 2, 1200.00, 2400.00, current_date - 5, '07:00'),
  -- John: 2x Snorkel Isla Mujeres
  ('b1000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000002', 'e0000001-0000-0000-0000-000000000002', 'f0000001-0000-0000-0000-000000000002',
   'completed', 2, 1800.00, 3600.00, current_date - 3, '09:00'),
  -- Emma: 2x Cena Gourmet
  ('b1000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000003', 'e0000001-0000-0000-0000-000000000005', 'f0000001-0000-0000-0000-000000000004',
   'confirmed', 2, 2200.00, 4400.00, current_date + 3, '19:00'),
  -- Pedro: 1x Ruta 3 Cenotes
  ('b1000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000004', 'e0000001-0000-0000-0000-000000000008', 'f0000001-0000-0000-0000-000000000001',
   'pending', 1, 1600.00, 1600.00, current_date + 5, '08:00');

-- ============================================================
-- 11. REVIEWS
-- ============================================================
insert into public.reviews (experience_id, booking_item_id, user_id, rating, comment, provider_response, provider_responded_at) values
  ('e0000001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000020',
   5, 'Increible experiencia! El guia Carlos fue muy profesional y el cenote Ik Kil es espectacular. Totalmente recomendado.',
   'Gracias Sofia! Fue un placer recibirte. Te esperamos en tu proximo viaje a Cancun.', now() - interval '3 days'),

  ('e0000001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000021',
   5, 'Amazing snorkeling experience! The underwater museum was incredible and Playa Norte is paradise. Best day in Cancun!',
   'Thank you John! We are glad you enjoyed MUSA and Isla Mujeres. Hope to see you again!', now() - interval '1 day');

-- ============================================================
-- 12. TICKETS
-- ============================================================
insert into public.tickets (booking_item_id, user_id, experience_id, provider_id, qr_code, status, service_date, service_time, quantity) values
  ('b1000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000020', 'e0000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001',
   'POORTAL-TK-001-A1B2C3D4', 'used', current_date - 5, '07:00', 2),
  ('b1000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000021', 'e0000001-0000-0000-0000-000000000002', 'f0000001-0000-0000-0000-000000000002',
   'POORTAL-TK-002-E5F6G7H8', 'used', current_date - 3, '09:00', 2),
  ('b1000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000022', 'e0000001-0000-0000-0000-000000000005', 'f0000001-0000-0000-0000-000000000004',
   'POORTAL-TK-003-I9J1K2L3', 'active', current_date + 3, '19:00', 2);

-- ============================================================
-- 13. PAYMENTS
-- ============================================================
insert into public.payments (booking_id, booking_item_id, type, status, amount, currency) values
  ('b0000001-0000-0000-0000-000000000001', null, 'charge', 'succeeded', 2400.00, 'MXN'),
  ('b0000001-0000-0000-0000-000000000001', null, 'platform_fee', 'succeeded', 360.00, 'MXN'),
  ('b0000001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001', 'transfer', 'succeeded', 2040.00, 'MXN'),
  ('b0000001-0000-0000-0000-000000000002', null, 'charge', 'succeeded', 3600.00, 'MXN'),
  ('b0000001-0000-0000-0000-000000000002', null, 'platform_fee', 'succeeded', 540.00, 'MXN'),
  ('b0000001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000002', 'transfer', 'succeeded', 3060.00, 'MXN'),
  ('b0000001-0000-0000-0000-000000000003', null, 'charge', 'succeeded', 4400.00, 'MXN'),
  ('b0000001-0000-0000-0000-000000000004', null, 'charge', 'succeeded', 1600.00, 'MXN');

-- ============================================================
-- 14. NOTIFICATIONS
-- ============================================================
insert into public.notifications (user_id, type, title, body, link, is_read) values
  ('a0000001-0000-0000-0000-000000000020', 'booking_confirmed', 'Reserva confirmada',
   'Tu reserva POORTAL-A1B2C3 para Tour a Chichen Itza ha sido confirmada.', '/wallet', true),
  ('a0000001-0000-0000-0000-000000000021', 'booking_confirmed', 'Booking confirmed',
   'Your booking POORTAL-D4E5F6 for Snorkel en Isla Mujeres has been confirmed.', '/wallet', true),
  ('a0000001-0000-0000-0000-000000000022', 'booking_created', 'Reserva creada',
   'Tu reserva POORTAL-G7H8I9 para Cena Mexicana Gourmet esta pendiente de confirmacion.', '/bookings', false),
  ('a0000001-0000-0000-0000-000000000010', 'review_received', 'Nueva resena recibida',
   'Sofia Vargas dejo una resena de 5 estrellas en Tour a Chichen Itza.', '/provider/bookings', false),
  ('a0000001-0000-0000-0000-000000000011', 'review_received', 'Nueva resena recibida',
   'John Smith dejo una resena de 5 estrellas en Snorkel en Isla Mujeres.', '/provider/bookings', false);

-- Re-enable FK checks and triggers
SET session_replication_role = 'origin';
