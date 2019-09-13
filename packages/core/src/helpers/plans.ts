import { DatabaseUser, UserPlan } from '../types'
import { allPlansObj, defaultFreePlan, PlanID } from '../utils'
import { fixDateToISO } from './shared'

export function getDefaultUserPlan(date: string): UserPlan {
  const userPlan: UserPlan = {
    amount: defaultFreePlan.amount,
    cancelAt: undefined,
    cancelAtPeriodEnd: false,
    createdAt: fixDateToISO(date)!,
    currency: defaultFreePlan.currency,
    currentPeriodEndAt: undefined,
    currentPeriodStartAt: fixDateToISO(date),
    featureFlags: defaultFreePlan.featureFlags,
    id: defaultFreePlan.id,
    interval: defaultFreePlan.interval,
    intervalCount: defaultFreePlan.intervalCount,
    source: 'none',
    startAt: fixDateToISO(date),
    status: 'active',
    trialEndAt: undefined,
    trialPeriodDays: defaultFreePlan.trialPeriodDays,
    trialStartAt: undefined,
    updatedAt: fixDateToISO(date)!,
  }

  return userPlan
}

export function getUserPlan(user: DatabaseUser): UserPlan {
  let userPlan: UserPlan = getDefaultUserPlan(user.createdAt)

  const planId = (user.plan && user.plan.id) as PlanID | undefined
  const plan = planId && allPlansObj[planId]
  if (!plan) return userPlan

  if (user.plan.status !== 'canceled') {
    userPlan = {
      ...user.plan,
      featureFlags: plan.featureFlags,
    }
  }

  return userPlan
}

export function formatPrice(
  valueInCents: number,
  currency: string,
  locale = 'en-US',
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || 'usd',
  })

  const value = formatter.format(valueInCents / 100)
  return value.endsWith('.00') ? value.slice(0, -3) : value
}
