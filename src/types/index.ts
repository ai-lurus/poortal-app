export type { Database } from './database'
export type {
  UserRole,
  ProviderStatus,
  DocumentType,
  DocumentStatus,
  CancellationPolicy,
  ExperienceStatus,
  PricingType,
  BookingStatus,
  BookingItemStatus,
  TicketStatus,
  PaymentStatus,
  PaymentType,
  NotificationType,
  CreditReason,
  Json,
} from './database'

import type { Database } from './database'

// Convenience type aliases for table rows
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Destination = Database['public']['Tables']['destinations']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Subcategory = Database['public']['Tables']['subcategories']['Row']
export type ProviderProfile = Database['public']['Tables']['provider_profiles']['Row']
export type Experience = Database['public']['Tables']['experiences']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingItem = Database['public']['Tables']['booking_items']['Row']
export type Ticket = Database['public']['Tables']['tickets']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type Cancellation = Database['public']['Tables']['cancellations']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type PlatformCredit = Database['public']['Tables']['platform_credits']['Row']

// Search result type
export type ExperienceSearchResult = Database['public']['Functions']['search_experiences']['Returns'][number]
