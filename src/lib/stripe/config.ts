import Stripe from 'stripe'

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  currency: 'mxn',
  buyerServiceFeePercentage: 10,
  poortalFeePercentage: 5,
  sellerServiceSharePercentage: 5,
}

export const stripe = new Stripe(STRIPE_CONFIG.secretKey)
