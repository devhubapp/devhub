import { DatabaseUser, Plan, UserPlan } from '../types'
import { allPlansObj, freePlan, freeTrialPlan, PlanID } from '../utils'
import { fixDateToISO } from './shared'

export function getDefaultUserPlan(
  userCreatedAt: string,
  {
    trialStartAt = userCreatedAt,
    trialEndAt,
  }: { trialStartAt: string | undefined; trialEndAt: string | undefined },
): UserPlan {
  const _userCreatedAt = fixDateToISO(userCreatedAt) || new Date().toISOString()
  const _trialStartAt = fixDateToISO(trialStartAt) || _userCreatedAt
  const _trialEndAt =
    trialEndAt &&
    fixDateToISO(trialEndAt) &&
    fixDateToISO(trialEndAt)! >= _trialStartAt
      ? fixDateToISO(trialEndAt)
      : freePlan && freePlan.trialPeriodDays
      ? new Date(
          new Date(fixDateToISO(_trialStartAt)!).valueOf() +
            freePlan.trialPeriodDays * 1000 * 60 * 60 * 24,
        ).toISOString()
      : undefined

  const isTrialExpired =
    _trialStartAt && _trialEndAt && new Date(_trialEndAt).valueOf() < Date.now()
  const defaultPlan = isTrialExpired ? freePlan : freeTrialPlan

  const userPlan: UserPlan = {
    amount: (defaultPlan && defaultPlan.amount) || 0,
    cancelAt: undefined,
    cancelAtPeriodEnd: false,
    createdAt: _userCreatedAt,
    currency: (defaultPlan && defaultPlan.currency) || 'usd',
    currentPeriodEndAt: _trialEndAt,
    currentPeriodStartAt: _trialStartAt,
    featureFlags: (defaultPlan && defaultPlan.featureFlags) || {
      columnsLimit: 0,
      enableFilters: false,
      enablePrivateRepositories: false,
      enablePushNotifications: false,
      enableSync: false,
    },
    id: (defaultPlan && defaultPlan.id) || ('free' as any),
    interval: (defaultPlan && defaultPlan.interval) || 'month',
    intervalCount: (defaultPlan && defaultPlan.intervalCount) || 1,
    source: 'none',
    startAt: _trialStartAt,
    status: defaultPlan && defaultPlan.trialPeriodDays ? 'trialing' : 'active',
    trialEndAt: _trialEndAt,
    trialPeriodDays: (defaultPlan && defaultPlan.trialPeriodDays) || 0,
    trialStartAt: _trialEndAt ? _trialStartAt : undefined,
    updatedAt: _trialStartAt,
  }

  return userPlan
}

export function getUserPlan(user: DatabaseUser): UserPlan {
  const defaultUserPlan: UserPlan = getDefaultUserPlan(user.createdAt, {
    trialStartAt: user.freeTrialStartAt,
    trialEndAt: user.freeTrialEndAt,
  })

  const planId = (user.plan && user.plan.id) as PlanID | undefined
  const plan = planId && allPlansObj[planId]
  if (!plan) return defaultUserPlan

  if (user.plan.amount) {
    if (!isPlanStatusValid(user.plan)) return defaultUserPlan
    if (isPlanExpired(user.plan)) return defaultUserPlan
  }

  return {
    ...user.plan,
    banner: plan.banner,
    featureFlags: plan.featureFlags,
  }
}

export function isPlanStatusValid(
  plan: Pick<UserPlan, 'status'> | undefined,
): boolean {
  if (!plan) return false

  return !!(
    plan.status === 'active' ||
    plan.status === 'trialing' ||
    plan.status === 'incomplete'
  )
}

export function isPlanExpired(
  plan: Pick<UserPlan, 'status' | 'trialEndAt'> | undefined,
): boolean {
  if (!plan) return false

  if (
    plan.status === 'trialing' &&
    plan.trialEndAt &&
    fixDateToISO(plan.trialEndAt)
  )
    return new Date().toISOString() > fixDateToISO(plan.trialEndAt)!

  return false
}

export function formatPrice(
  valueInCents: number,
  {
    currency,
    locale = 'en-US',
  }: {
    currency: string
    locale?: string
  },
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || 'usd',
  })

  const value = formatter.format(valueInCents / 100)
  return value.endsWith('.00') ? value.slice(0, -3) : value
}

export function formatPriceAndInterval(
  valueInCents: number,
  {
    currency,
    interval,
    intervalCount,
    locale = 'en-US',
  }: {
    currency: string
    interval: Plan['interval']
    intervalCount: Plan['intervalCount']
    locale?: string
  },
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || 'usd',
  })

  const value = formatter.format(valueInCents / 100)
  const priceLabel = value.endsWith('.00') ? value.slice(0, -3) : value

  return `${priceLabel}${
    interval
      ? intervalCount > 1
        ? ` every ${intervalCount} ${interval}s`
        : `/${interval}`
      : ''
  }`
}
