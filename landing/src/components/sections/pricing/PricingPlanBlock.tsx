import {
  formatInterval,
  formatPrice,
  formatPriceAndInterval,
  Plan,
} from '@brunolemos/devhub-core'
import classNames from 'classnames'
import qs from 'qs'
import React from 'react'

import { useAuth } from '../../../context/AuthContext'
import { usePlans } from '../../../context/PlansContext'
import { getPurchaseOrSubscribeRoute } from '../../../helpers'
import { useLocalizedPlanDetails } from '../../../hooks/use-localized-plan-details'
import Button from '../../common/buttons/Button'
import CheckLabel from '../../common/CheckLabel'

export interface PricingPlanBlockProps {
  banner?: string | boolean
  buttonLabel?: string
  buttonLink: string
  forceShowAsMonthly?: boolean
  plan: Plan
  totalNumberOfVisiblePlans?: number
}

export function PricingPlanBlock(props: PricingPlanBlockProps) {
  const {
    banner: _banner,
    buttonLabel,
    buttonLink,
    forceShowAsMonthly = true,
    plan,
    totalNumberOfVisiblePlans,
  } = props

  const { authData } = useAuth()
  const { plans } = usePlans()
  const localizedPlan = useLocalizedPlanDetails(plan)

  if (!localizedPlan) return null

  const userPlan = authData && authData.plan
  const userPlanIsActive =
    userPlan && userPlan.id && plans.find(p => p && p.id === userPlan!.id)
  const isMyPlan = !!(userPlan && userPlan.id === localizedPlan.id)

  const banner = userPlanIsActive
    ? isMyPlan
      ? localizedPlan && localizedPlan.interval
        ? 'Current localizedPlan'
        : 'You bought this'
      : _banner || true
    : _banner

  const modifiedAmount = forceShowAsMonthly
    ? (localizedPlan.interval === 'day'
        ? localizedPlan.amount * 30
        : localizedPlan.interval === 'week'
        ? localizedPlan.amount * 4
        : localizedPlan.interval === 'year'
        ? localizedPlan.amount / 12
        : localizedPlan.amount) /
      (localizedPlan.intervalCount || 1) /
      (localizedPlan.transformUsage && localizedPlan.transformUsage.divideBy > 1
        ? localizedPlan.transformUsage.divideBy
        : 1)
    : localizedPlan.amount

  const _priceLabel = formatPrice({
    ...localizedPlan,
    amount: modifiedAmount,
  })
  const _roundedPriceLabelWithInterval = formatPriceAndInterval({
    ...localizedPlan,
    amount:
      localizedPlan.amount % 100 > 50
        ? localizedPlan.amount + (100 - (localizedPlan.amount % 100))
        : localizedPlan.amount,
  })

  const priceLabelCents =
    _priceLabel[_priceLabel.length - 3] === '.'
      ? _priceLabel.substr(-3)
      : undefined
  const priceLabelWithoutCents =
    priceLabelCents && _priceLabel.endsWith(priceLabelCents)
      ? _priceLabel.substring(0, _priceLabel.length - 3)
      : _priceLabel

  const subtitle = `${
    localizedPlan.type === 'custom' && !Number(priceLabelWithoutCents)
      ? ' '
      : forceShowAsMonthly
      ? `${plan.type === 'team' ? '/user' : ''}/month`
      : localizedPlan.interval
      ? formatInterval(localizedPlan)
      : ''
  }${modifiedAmount !== localizedPlan.amount ? '*' : ''}`.trim()

  let footerText = ''

  if (!localizedPlan.amount && localizedPlan.trialPeriodDays) {
    footerText =
      (footerText ? `${footerText}\n` : footerText) +
      `Free for ${localizedPlan.trialPeriodDays} days`
  } else if (
    localizedPlan.amount &&
    plans.some(p => p && !p.amount && p.trialPeriodDays)
  ) {
    //
  } else if (localizedPlan.trialPeriodDays) {
    footerText =
      (footerText ? `${footerText}\n` : footerText) +
      `${localizedPlan.trialPeriodDays}-day free trial`
  } else if (
    localizedPlan.amount &&
    !localizedPlan.trialPeriodDays &&
    plans.some(p => p && p.trialPeriodDays)
  ) {
    footerText = (footerText ? `${footerText}\n` : footerText) + 'No free trial'
  }

  if (modifiedAmount !== localizedPlan.amount) {
    footerText =
      (footerText ? `${footerText}\n` : footerText) +
      `*Billed ${
        localizedPlan.amount % 100 > 50 ? '~' : ''
      }${_roundedPriceLabelWithInterval}`
  }

  if (!localizedPlan.interval && localizedPlan.amount) {
    footerText =
      (footerText ? `${footerText}\n` : footerText) +
      'One-time payment (no subscription)'
  }

  if (
    !footerText &&
    localizedPlan.type === 'custom' &&
    buttonLink &&
    buttonLink.startsWith('mailto:')
  ) {
    footerText =
      (footerText ? `${footerText}\n` : footerText) +
      `Contact us: ${buttonLink.replace('mailto:', '')}`
  }

  if (!footerText && localizedPlan.interval && localizedPlan.amount) {
    footerText =
      (footerText ? `${footerText}\n` : footerText) + localizedPlan.interval ===
      'year'
        ? 'Cancel anytime, no refund'
        : 'Cancel anytime with one click'
  }

  if (
    !footerText &&
    forceShowAsMonthly &&
    plans.find(p => p && p.interval !== 'month') &&
    modifiedAmount === localizedPlan.amount
  ) {
    footerText = `${footerText || ' '}\n`
  }

  return (
    <section
      className={classNames(
        'pricing-localizedPlan flex flex-col flex-shrink-0',
        totalNumberOfVisiblePlans === 1 ? 'w-full lg:w-84' : 'w-72',
      )}
    >
      <div
        className={classNames(
          'bg-more-1 shadow border rounded',
          true // banner && typeof banner === 'string'
            ? false // isMyPlan
              ? 'border-primary'
              : 'border-bg-less-1'
            : 'border-bg-more-2',
        )}
      >
        {banner === true ? (
          <div className="text-sm leading-normal py-1 px-6 text-center font-semibold">
            &nbsp;
          </div>
        ) : banner ? (
          <div
            className={`${
              false // isMyPlan
                ? 'bg-primary text-primary-foreground'
                : 'bg-less-1 text-default'
            } text-sm leading-normal py-1 px-6 text-center font-semibold rounded-t`}
          >
            {banner}
          </div>
        ) : null}

        <div className="p-6 text-center">
          <div className="text-base leading-loose font-bold text-default">
            {localizedPlan.label}
          </div>

          <div className="mb-2 text-sm text-muted-65 whitespace-pre-line">
            {totalNumberOfVisiblePlans === 1
              ? localizedPlan.description.trim()
              : localizedPlan.description}
          </div>

          <div className="text-5xl leading-snug font-bold text-default">
            {localizedPlan.type === 'custom' &&
            !Number(priceLabelWithoutCents) ? (
              '$?'
            ) : (
              <>
                {priceLabelWithoutCents}
                {!!priceLabelCents && (
                  <small>
                    <small>
                      <small>
                        <small>
                          <small className="text-muted-65">
                            {priceLabelCents}
                          </small>
                        </small>
                      </small>
                    </small>
                  </small>
                )}
              </>
            )}
          </div>

          {!!(
            subtitle ||
            (totalNumberOfVisiblePlans && totalNumberOfVisiblePlans > 1)
          ) && (
            <>
              <div className="mb-2 text-sm text-muted-65">
                &nbsp;{subtitle}&nbsp;
              </div>
              <div className="pb-6" />
            </>
          )}

          {!!(
            footerText ||
            (totalNumberOfVisiblePlans && totalNumberOfVisiblePlans > 1)
          ) && (
            <div className="mb-2 text-sm text-muted-65 italic whitespace-pre-line">
              &nbsp;{footerText}&nbsp;
            </div>
          )}

          <div className="pb-6" />

          {isMyPlan ? (
            localizedPlan.type === 'team' ? (
              <Button
                type="primary"
                href={`/${getPurchaseOrSubscribeRoute(plans)}${qs.stringify(
                  { localizedPlan: userPlan && userPlan.id },
                  { addQueryPrefix: true },
                )}`}
              >
                Update
              </Button>
            ) : (
              <Button type="primary" href="/account">
                Manage
              </Button>
            )
          ) : (
            <Button type="primary" href={buttonLink}>
              {buttonLabel || 'Continue'}
            </Button>
          )}

          <div className="pb-6" />
        </div>
      </div>

      {!!(
        localizedPlan.featureLabels && localizedPlan.featureLabels.length
      ) && (
        <div className="p-4">
          <div className="pb-2" />

          {localizedPlan.featureLabels.map((feature, index) => (
            <CheckLabel
              key={`pricing-localizedPlan-${localizedPlan.id}-feature-${index}`}
              label={feature.label}
              checkProps={{
                className: feature.available ? 'text-primary' : 'invisible',
              }}
              className={classNames(
                'mb-2',
                feature.available ? undefined : 'text-muted-65 line-through',
              )}
            />
          ))}

          <div className="pb-6" />
        </div>
      )}
    </section>
  )
}
