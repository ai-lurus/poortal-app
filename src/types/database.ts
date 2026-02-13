export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'tourist' | 'provider' | 'admin'
export type ProviderStatus = 'pending_review' | 'approved_incomplete' | 'active' | 'suspended' | 'rejected'
export type DocumentType = 'government_id' | 'proof_of_address' | 'business_license' | 'insurance' | 'other'
export type DocumentStatus = 'pending' | 'approved' | 'rejected'
export type CancellationPolicy = 'flexible' | 'moderate' | 'strict'
export type ExperienceStatus = 'draft' | 'pending_review' | 'active' | 'paused' | 'rejected' | 'archived'
export type PricingType = 'per_person' | 'per_group' | 'flat_rate'
export type BookingStatus = 'pending_payment' | 'paid' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded' | 'disputed'
export type BookingItemStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed'
export type TicketStatus = 'active' | 'used' | 'expired' | 'cancelled'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded' | 'partially_refunded'
export type PaymentType = 'charge' | 'transfer' | 'refund' | 'platform_fee'
export type NotificationType = 'booking_created' | 'booking_confirmed' | 'booking_rejected' | 'booking_cancelled' | 'payment_received' | 'payment_transferred' | 'review_received' | 'provider_approved' | 'provider_rejected' | 'experience_approved' | 'experience_rejected' | 'general'
export type CreditReason = 'provider_cancellation' | 'referral' | 'promotion' | 'dispute_resolution' | 'manual'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: UserRole
          avatar_url: string | null
          nationality: string | null
          preferred_language: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: UserRole
          avatar_url?: string | null
          nationality?: string | null
          preferred_language?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: UserRole
          avatar_url?: string | null
          nationality?: string | null
          preferred_language?: string | null
          updated_at?: string
        }
      }
      destinations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          country: string
          state: string | null
          city: string | null
          latitude: number | null
          longitude: number | null
          cover_image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          country: string
          state?: string | null
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          cover_image_url?: string | null
          is_active?: boolean
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          country?: string
          state?: string | null
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          cover_image_url?: string | null
          is_active?: boolean
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          sort_order?: number
          is_active?: boolean
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          sort_order?: number
          is_active?: boolean
        }
      }
      subcategories: {
        Row: {
          id: string
          category_id: string
          name: string
          slug: string
          description: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          slug: string
          description?: string | null
          sort_order?: number
          is_active?: boolean
        }
        Update: {
          category_id?: string
          name?: string
          slug?: string
          description?: string | null
          sort_order?: number
          is_active?: boolean
        }
      }
      destination_categories: {
        Row: {
          id: string
          destination_id: string
          category_id: string
          created_at: string
        }
        Insert: {
          id?: string
          destination_id: string
          category_id: string
        }
        Update: {
          destination_id?: string
          category_id?: string
        }
      }
      provider_profiles: {
        Row: {
          id: string
          user_id: string
          destination_id: string | null
          business_name: string
          representative_name: string
          phone: string
          location: string
          category_id: string | null
          short_description: string
          status: ProviderStatus
          legal_name: string | null
          tax_id: string | null
          full_address: string | null
          customer_phone: string | null
          website: string | null
          operating_hours: Json | null
          stripe_account_id: string | null
          stripe_onboarding_complete: boolean
          rejection_reason: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          destination_id?: string | null
          business_name: string
          representative_name: string
          phone: string
          location: string
          category_id?: string | null
          short_description: string
          status?: ProviderStatus
          legal_name?: string | null
          tax_id?: string | null
          full_address?: string | null
          customer_phone?: string | null
          website?: string | null
          operating_hours?: Json | null
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean
        }
        Update: {
          destination_id?: string | null
          business_name?: string
          representative_name?: string
          phone?: string
          location?: string
          category_id?: string | null
          short_description?: string
          status?: ProviderStatus
          legal_name?: string | null
          tax_id?: string | null
          full_address?: string | null
          customer_phone?: string | null
          website?: string | null
          operating_hours?: Json | null
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean
          rejection_reason?: string | null
          approved_at?: string | null
          approved_by?: string | null
        }
      }
      experiences: {
        Row: {
          id: string
          provider_id: string
          destination_id: string
          category_id: string
          subcategory_id: string | null
          title: string
          slug: string
          description: string
          short_description: string | null
          highlights: string[] | null
          includes: string[] | null
          excludes: string[] | null
          requirements: string[] | null
          meeting_point: string | null
          meeting_point_lat: number | null
          meeting_point_lng: number | null
          duration_minutes: number | null
          max_capacity: number
          min_capacity: number
          pricing_type: PricingType
          price_amount: number
          price_currency: string
          cancellation_policy: CancellationPolicy
          status: ExperienceStatus
          average_rating: number
          review_count: number
          search_vector: unknown | null
          rejection_reason: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          destination_id: string
          category_id: string
          subcategory_id?: string | null
          title: string
          slug: string
          description: string
          short_description?: string | null
          highlights?: string[] | null
          includes?: string[] | null
          excludes?: string[] | null
          requirements?: string[] | null
          meeting_point?: string | null
          meeting_point_lat?: number | null
          meeting_point_lng?: number | null
          duration_minutes?: number | null
          max_capacity?: number
          min_capacity?: number
          pricing_type?: PricingType
          price_amount: number
          price_currency?: string
          cancellation_policy?: CancellationPolicy
          status?: ExperienceStatus
        }
        Update: {
          provider_id?: string
          destination_id?: string
          category_id?: string
          subcategory_id?: string | null
          title?: string
          slug?: string
          description?: string
          short_description?: string | null
          highlights?: string[] | null
          includes?: string[] | null
          excludes?: string[] | null
          requirements?: string[] | null
          meeting_point?: string | null
          meeting_point_lat?: number | null
          meeting_point_lng?: number | null
          duration_minutes?: number | null
          max_capacity?: number
          min_capacity?: number
          pricing_type?: PricingType
          price_amount?: number
          price_currency?: string
          cancellation_policy?: CancellationPolicy
          status?: ExperienceStatus
          rejection_reason?: string | null
          published_at?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          booking_number: string
          user_id: string
          status: BookingStatus
          total_amount: number
          platform_fee: number
          currency: string
          stripe_payment_intent_id: string | null
          stripe_checkout_session_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_number?: string
          user_id: string
          status?: BookingStatus
          total_amount: number
          platform_fee?: number
          currency?: string
          stripe_payment_intent_id?: string | null
          stripe_checkout_session_id?: string | null
          notes?: string | null
        }
        Update: {
          status?: BookingStatus
          total_amount?: number
          platform_fee?: number
          stripe_payment_intent_id?: string | null
          stripe_checkout_session_id?: string | null
          notes?: string | null
        }
      }
      booking_items: {
        Row: {
          id: string
          booking_id: string
          experience_id: string
          availability_id: string | null
          provider_id: string
          status: BookingItemStatus
          quantity: number
          unit_price: number
          subtotal: number
          service_date: string
          service_time: string | null
          provider_message: string | null
          responded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          experience_id: string
          availability_id?: string | null
          provider_id: string
          status?: BookingItemStatus
          quantity?: number
          unit_price: number
          subtotal: number
          service_date: string
          service_time?: string | null
        }
        Update: {
          status?: BookingItemStatus
          provider_message?: string | null
          responded_at?: string | null
        }
      }
      tickets: {
        Row: {
          id: string
          booking_item_id: string
          user_id: string
          experience_id: string
          provider_id: string
          qr_code: string
          status: TicketStatus
          service_date: string
          service_time: string | null
          quantity: number
          provider_message: string | null
          scanned_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_item_id: string
          user_id: string
          experience_id: string
          provider_id: string
          qr_code: string
          status?: TicketStatus
          service_date: string
          service_time?: string | null
          quantity?: number
          provider_message?: string | null
        }
        Update: {
          status?: TicketStatus
          provider_message?: string | null
          scanned_at?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          experience_id: string
          booking_item_id: string
          user_id: string
          rating: number
          comment: string | null
          provider_response: string | null
          provider_responded_at: string | null
          is_flagged: boolean
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          booking_item_id: string
          user_id: string
          rating: number
          comment?: string | null
        }
        Update: {
          rating?: number
          comment?: string | null
          provider_response?: string | null
          provider_responded_at?: string | null
          is_flagged?: boolean
          is_visible?: boolean
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          booking_item_id: string | null
          type: PaymentType
          status: PaymentStatus
          amount: number
          currency: string
          stripe_payment_intent_id: string | null
          stripe_charge_id: string | null
          stripe_transfer_id: string | null
          stripe_refund_id: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          booking_item_id?: string | null
          type: PaymentType
          status?: PaymentStatus
          amount: number
          currency?: string
          stripe_payment_intent_id?: string | null
          stripe_charge_id?: string | null
          stripe_transfer_id?: string | null
          stripe_refund_id?: string | null
          metadata?: Json
        }
        Update: {
          status?: PaymentStatus
          stripe_charge_id?: string | null
          stripe_transfer_id?: string | null
          stripe_refund_id?: string | null
          metadata?: Json
        }
      }
      cancellations: {
        Row: {
          id: string
          booking_id: string
          booking_item_id: string | null
          cancelled_by: string
          reason: string | null
          cancellation_policy: CancellationPolicy
          hours_before_service: number | null
          original_amount: number
          refund_percentage: number
          refund_amount: number
          stripe_refund_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          booking_item_id?: string | null
          cancelled_by: string
          reason?: string | null
          cancellation_policy: CancellationPolicy
          hours_before_service?: number | null
          original_amount: number
          refund_percentage: number
          refund_amount: number
          stripe_refund_id?: string | null
        }
        Update: {
          stripe_refund_id?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          title: string
          body: string | null
          link: string | null
          is_read: boolean
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type?: NotificationType
          title: string
          body?: string | null
          link?: string | null
          is_read?: boolean
          metadata?: Json
        }
        Update: {
          is_read?: boolean
        }
      }
      platform_credits: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          reason: CreditReason
          description: string | null
          booking_id: string | null
          expires_at: string | null
          used_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          currency?: string
          reason: CreditReason
          description?: string | null
          booking_id?: string | null
          expires_at?: string | null
        }
        Update: {
          used_at?: string | null
        }
      }
    }
    Functions: {
      search_experiences: {
        Args: {
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
        }
        Returns: {
          id: string
          title: string
          slug: string
          short_description: string | null
          price_amount: number
          price_currency: string
          pricing_type: PricingType
          duration_minutes: number | null
          average_rating: number
          review_count: number
          cover_image_url: string | null
          provider_name: string
          destination_name: string
          category_name: string
          rank: number
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: UserRole
      }
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
      provider_status: ProviderStatus
      document_type: DocumentType
      document_status: DocumentStatus
      cancellation_policy: CancellationPolicy
      experience_status: ExperienceStatus
      pricing_type: PricingType
      booking_status: BookingStatus
      booking_item_status: BookingItemStatus
      ticket_status: TicketStatus
      payment_status: PaymentStatus
      payment_type: PaymentType
      notification_type: NotificationType
      credit_reason: CreditReason
    }
  }
}
