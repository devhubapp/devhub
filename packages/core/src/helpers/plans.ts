import { Plan, UserPlan } from '../types'
import { fixDateToISO } from './shared'

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
  plan: Pick<Plan, 'amount' | 'currency' | 'transformUsage'> | undefined,
  options: { locale?: string; quantity?: number } = {},
) {
  const { amount, currency, transformUsage } = plan || {}

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
  const _valueInCents = (amount || 0) * _roundedUnits

  const value = formatter.format(_valueInCents / 100)
  const priceLabel = value.endsWith('.00') ? value.slice(0, -3) : value

  return priceLabel
}

export function formatInterval(
  plan:
    | Pick<Plan, 'interval' | 'intervalCount' | 'transformUsage' | 'type'>
    | undefined,
  options: Parameters<typeof formatPrice>[1] = {},
) {
  const { interval, intervalCount, transformUsage, type } = plan || {}
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
      ? intervalCount && intervalCount > 1
        ? ` every ${intervalCount} ${interval}s`
        : `/${interval}`
      : ''
  }${
    quantity && quantity >= 1
      ? ''
      : transformUsage && transformUsage.divideBy > 1
      ? ` every ${transformUsage.divideBy} users`
      : type === 'team' && !(transformUsage && !(transformUsage.divideBy > 1))
      ? ' per user'
      : ''
  }`
}

export function formatPriceAndInterval(
  plan:
    | (NonNullable<Parameters<typeof formatPrice>[0]> &
        NonNullable<Parameters<typeof formatInterval>[0]>)
    | undefined,
  options: Parameters<typeof formatPrice>[1] &
    Parameters<typeof formatInterval>[1] = {},
) {
  const priceLabel = formatPrice(plan, options)
  return `${priceLabel}${formatInterval(plan, options)}`
}
