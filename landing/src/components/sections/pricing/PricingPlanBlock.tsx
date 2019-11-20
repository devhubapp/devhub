import {
  activePlans,
  formatPrice,
  formatPriceAndInterval,
  Plan,
} from '@brunolemos/devhub-core'
import classNames from 'classnames'
import qs from 'qs'
import React from 'react'

import { useAuth } from '../../../context/AuthContext'
import Button from '../../common/buttons/Button'
import CheckLabel from '../../common/CheckLabel'

export interface PricingPlanBlockProps {
  banner?: string | boolean
  buttonLabel?: string
  buttonLink: string
  plan: Plan
}

export function PricingPlanBlock(props: PricingPlanBlockProps) {
  const { banner: _banner, buttonLabel, buttonLink, plan } = props

  const { authData } = useAuth()

  const userPlan = authData && authData.plan
  const userPlanIsActive =
    userPlan && userPlan.id && activePlans.find(p => p.id === userPlan!.id)
  const isMyPlan = userPlan && userPlan.id === plan.id

  const banner = userPlanIsActive
    ? isMyPlan
      ? 'Current plan'
      : _banner || true
    : _banner

  const estimatedMonthlyPrice =
    (plan.interval === 'day'
      ? plan.amount * 30
      : plan.interval === 'week'
      ? plan.amount * 4
      : plan.interval === 'year'
      ? plan.amount / 12
      : plan.amount) /
    (plan.intervalCount || 1) /
    (plan.transformUsage && plan.transformUsage.divideBy > 1
      ? plan.transformUsage.divideBy
      : 1)

  const _priceLabel = formatPrice(estimatedMonthlyPrice, plan)
  const _cents = estimatedMonthlyPrice % 100
  const priceLabelWithoutCents =
    _cents && _priceLabel.endsWith(_cents.toString())
      ? _priceLabel.substring(0, _priceLabel.length - 3)
      : _priceLabel
  const priceLabelCents =
    _cents && _priceLabel.endsWith(_cents.toString())
      ? _priceLabel.substr(-3)
      : ''

  let footerText = ''

  if (!plan.amount && plan.trialPeriodDays) {
    footerText = footerText + `Free for ${plan.trialPeriodDays} days`
  }

  if (estimatedMonthlyPrice !== plan.amount) {
    footerText =
      footerText +
      `*Billed ${plan.amount % 100 > 50 ? '~' : ''}${formatPriceAndInterval(
        plan.amount % 100 > 50
          ? plan.amount + (100 - (plan.amount % 100))
          : plan.amount,
        plan,
      )}`
  }

  return (
    <section className="pricing-plan flex flex-col flex-shrink-0 w-64">
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
            {plan.label}
          </div>

          <div className="mb-2 text-sm text-muted-65">{plan.description}</div>

          <div className="text-5xl leading-snug font-bold text-default">
            {`${priceLabelWithoutCents}`}
            {!!priceLabelCents && (
              <small>
                <small>
                  <small>
                    <small>
                      <small className="text-muted-65">{priceLabelCents}</small>
                    </small>
                  </small>
                </small>
              </small>
            )}
          </div>
          <div className="text-sm text-muted-65">
            &nbsp;
            {`${
              plan.type === 'team' ||
              (plan.transformUsage && plan.transformUsage.divideBy > 1)
                ? '/user'
                : ''
            }${plan.interval ? '/month' : ''}${
              estimatedMonthlyPrice !== plan.amount ? '*' : ''
            }`}
            &nbsp;
          </div>
          {/* {plan.interval ? (
            <div className="text-sm text-muted-65">{`/${
              plan.intervalCount > 1 ? `${plan.intervalCount}-` : ''
            }${plan.interval}`}</div>
          ) : (
            <div className="text-sm text-muted-65">&nbsp;</div>
          )} */}

          <div className="pb-6" />

          <div className="mb-2 text-sm text-muted-65 italic">
            &nbsp;
            {footerText}
            &nbsp;
          </div>

          <div className="pb-6" />

          {isMyPlan ? (
            plan.type === 'team' ? (
              <Button
                type="primary"
                href={`/subscribe${qs.stringify(
                  { plan: userPlan && userPlan.id },
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
              {buttonLabel || 'Get started'}
            </Button>
          )}

          <div className="pb-6" />
        </div>
      </div>

      {!!(plan.featureLabels && plan.featureLabels.length) && (
        <div className="p-4">
          <div className="pb-2" />

          {plan.featureLabels.map((feature, index) => (
            <CheckLabel
              key={`pricing-plan-${plan.id}-feature-${index}`}
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
