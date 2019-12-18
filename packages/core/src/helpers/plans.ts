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

  const isTrialing =
    _trialStartAt && _trialEndAt && new Date(_trialEndAt).valueOf() > Date.now()
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
    label: (defaultPlan && defaultPlan.label) || 'Free',
    last4: undefined,
    quantity: 1,
    source: 'none',
    startAt: _trialStartAt,
    status:
      (defaultPlan && defaultPlan.trialPeriodDays) ||
      (isTrialing || (isTrialExpired && !freePlan))
        ? 'trialing'
        : 'active',
    trialEndAt: _trialEndAt,
    trialPeriodDays: (defaultPlan && defaultPlan.trialPeriodDays) || 0,
    trialStartAt: _trialEndAt ? _trialStartAt : undefined,
    type: 'individual',
    updatedAt: _trialStartAt,
    users: [],
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
    if (!isPlanStatusHandled(user.plan)) return defaultUserPlan
    if (isPlanExpired(user.plan)) return defaultUserPlan
  }

  return {
    ...user.plan,

    // workaround for 100% discount coupons
    // change the amount to non-zero
    // because we treat zero as the free plan all over the app
    amount: !user.plan.amount && user.plan.coupon ? 1 : user.plan.amount || 0,

    type: user.plan.type || 'individual',
    stripeIds: user.plan.stripeIds || plan.stripeIds,
    banner: plan.banner,
    featureFlags: plan.featureFlags,
    label: user.plan.label || plan.label,
    last4:
      user.plan.last4 ||
      (user.plan.source === 'stripe' && user.stripe && user.stripe.last4) ||
      undefined,
  }
}

export function isPlanStatusValid(
  plan: Pick<UserPlan, 'status'> | undefined,
): boolean {
  if (!plan) return false

  return !!(plan.status === 'active' || plan.status === 'trialing')
}

export function isPlanStatusHandled(
  plan: Pick<UserPlan, 'status'> | undefined,
): boolean {
  if (!plan) return false

  return (
    isPlanStatusValid(plan) ||
    (plan.status === 'incomplete' ||
      plan.status === 'incomplete_expired' ||
      plan.status === 'past_due' ||
      plan.status === 'unpaid')
  )
}

export function isPlanExpired(
  plan: Pick<UserPlan, 'amount' | 'status' | 'trialEndAt'> | undefined,
): boolean {
  if (!plan) return false

  if (
    (plan.status === 'trialing' || !plan.amount) &&
    plan.trialEndAt &&
    fixDateToISO(plan.trialEndAt)
  )
    return new Date().toISOString() > fixDateToISO(plan.trialEndAt)!

  return false
}

export function formatPrice(
  plan: Pick<Plan, 'amount' | 'currency' | 'transformUsage'>,
  options: { locale?: string; quantity?: number } = {},
) {
  const { amount, currency, transformUsage } = plan

  const { locale = 'en-US', quantity } = options

  const formatter = (() => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency || 'usd',
      })
    } catch (error) {
      return {
        format(v: number) {
          return `${currency || ''}${v.toFixed(2)}`
        },
      }
    }
  })()

  const _roundedUnits =
    quantity && quantity > 1
      ? transformUsage && transformUsage.divideBy > 1
        ? transformUsage.round === 'down'
          ? Math.floor(quantity / transformUsage.divideBy)
          : Math.ceil(quantity / transformUsage.divideBy)
        : quantity
      : 1
  const _valueInCents = amount * _roundedUnits

  const value = formatter.format(_valueInCents / 100)
  const priceLabel = value.endsWith('.00') ? value.slice(0, -3) : value

  return priceLabel
}

export function formatInterval(
  plan: Pick<Plan, 'interval' | 'intervalCount' | 'transformUsage' | 'type'>,
  options: Parameters<typeof formatPrice>[1] = {},
) {
  const { interval, intervalCount, transformUsage, type } = plan
  const { quantity } = options

  return `${
    quantity && quantity >= 1
      ? ''
      : (type === 'team' && !transformUsage) ||
        (transformUsage && !(transformUsage.divideBy > 1))
      ? '/user'
      : ''
  }${
    interval
      ? intervalCount > 1
        ? ` every ${intervalCount} ${interval}s`
        : `/${interval}`
      : ''
  }${
    quantity && quantity >= 1
      ? ''
      : transformUsage && transformUsage.divideBy > 1
      ? ` every ${transformUsage.divideBy} users`
      : type === 'team'
      ? ' per user'
      : ''
  }`
}

export function formatPriceAndInterval(
  plan: Parameters<typeof formatPrice>[0] &
    Parameters<typeof formatInterval>[0],
  options: Parameters<typeof formatPrice>[1] &
    Parameters<typeof formatInterval>[1] = {},
) {
  const priceLabel = formatPrice(plan, options)
  return `${priceLabel}${formatInterval(plan, options)}`
}
