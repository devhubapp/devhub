import { PlanID } from '../utils'
import { Column, ColumnSubscription } from './devhub'
import { GitHubTokenDetails, GraphQLGitHubUser, Installation } from './graphql'
import { StripeSubscription } from './stripe'

export interface DatabaseUserPlan {
  id: PlanID
  source: 'stripe' | 'none'

  amount: number
  currency: string
  trialPeriodDays: number
  interval: 'day' | 'week' | 'month' | 'year' | undefined
  intervalCount: number

  status:
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing'
    | 'active'
    | 'past_due'
    | 'canceled'
    | 'unpaid'

  startAt: string | undefined
  cancelAt: string | undefined
  cancelAtPeriodEnd: boolean

  trialStartAt: string | undefined
  trialEndAt: string | undefined

  currentPeriodStartAt: string | undefined
  currentPeriodEndAt: string | undefined

  reason?: string | undefined
  userPlansToKeepUsing?: boolean | null | undefined

  createdAt: string
  updatedAt: string
}

export interface DatabaseUser {
  _id: any
  columns?: {
    allIds: string[]
    byId: Record<string, Column | undefined>
    updatedAt: string
  }
  subscriptions?: {
    allIds: string[]
    byId: Record<string, ColumnSubscription | undefined>
    updatedAt: string
  }
  github: {
    app?: GitHubTokenDetails
    oauth?: GitHubTokenDetails
    user: GraphQLGitHubUser
    installations?: Installation[]
  }
  createdAt: string
  updatedAt: string
  lastLoginAt: string
  loginCount: number
  freeTrialStartAt?: string
  freeTrialEndAt?: string
  plan: DatabaseUserPlan
  planHistory: DatabaseUserPlan[]
  stripe?:
    | {
        customerId: string
        subscription: StripeSubscription
        last4: string | undefined
        clientIp: string | undefined
        createdAt: string
        updatedAt: string
      }
    | undefined
}
