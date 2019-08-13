export interface StripePlan {
  id: string
  object: 'plan'
  active: boolean
  aggregate_usage: 'sum' | 'last_during_period' | 'last_ever' | 'max' | null
  amount: number
  billing_scheme: 'per_unit' | 'tiered'
  created: number
  currency: string
  interval: 'day' | 'week' | 'month' | 'year'
  interval_count: number
  livemode: boolean
  metadata: object
  nickname: string | null
  product?: string | object | null
  // tiers: any
  // tiers_mode: any
  // transform_usage: any
  trial_period_days: number | null
  usage_type: 'licensed' | 'metered'
}

export interface StripeSubscription {
  id: string
  object: 'subscription'
  cancel_at_period_end: boolean
  canceled_at: number | null
  created: number
  current_period_end: number | null
  current_period_start: number | null
  customer: string | object | null
  discount: any
  ended_at: number | null
  items: {
    [key: string]: any
    data: Array<{
      [key: string]: any
      plan: StripePlan
    }>
  }
  livemode: boolean
  metadata: object
  quantity?: number
  start: number | null
  status:
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing'
    | 'active'
    | 'past_due'
    | 'canceled'
    | 'unpaid'
  trial_end: number | null
  trial_start: number | null
}
