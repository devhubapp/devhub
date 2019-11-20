import { PlanID } from '../utils'
import { Column, ColumnSubscription, PlanType } from './devhub'
import { GitHubTokenDetails, GraphQLGitHubUser, Installation } from './graphql'
import { StripeSubscription } from './stripe'

export interface DatabaseUserPlan {
  id: PlanID
  source: 'stripe' | 'none'
  type: PlanType

  amount: number
  currency: string
  label: string | undefined
  trialPeriodDays: number
  interval: 'day' | 'week' | 'month' | 'year' | undefined
  intervalCount: number
  transformUsage?:
    | {
        divideBy: number
        round: 'up' | 'down'
      }
    | undefined
  quantity: number | undefined

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

  last4: string | undefined
  reason?: string | undefined
  userPlansToKeepUsing?: boolean | null | undefined
  users?: string[] | undefined

  createdAt: string
  updatedAt: string
}

export interface DatabaseUserFeedback {
  appVersion: string
  feedback?: string
  isElectron: boolean
  platformOS: string
  platformRealOS: string
  location?: string
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
  feedbacks?: DatabaseUserFeedback[]
}
