import classNames from 'classnames'
import React from 'react'

import { activePlans, Plan } from '@devhub/core/src'
import { useAuth } from '../../../context/AuthContext'
import { formatPrice } from '../../../helpers'
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

  const isMyPlan = authData.plan && authData.plan.id === plan.id

  const banner =
    authData.plan &&
    authData.plan.amount > 0 &&
    activePlans.find(p => p.id === authData.plan!.id)
      ? isMyPlan
        ? 'Your plan'
        : true
      : _banner

  return (
    <section className="pricing-plan flex flex-col flex-shrink-0 w-64">
      <div className="m-1 bg-more-1 shadow border border-primary rounded">
        {banner === true ? (
          <div className="text-sm leading-normal py-1 px-6 text-center font-semibold">
            &nbsp;
          </div>
        ) : banner ? (
          <div className="bg-primary text-primary-foreground text-sm leading-normal py-1 px-6 text-center font-semibold rounded-t">
            {banner}
          </div>
        ) : null}

        <div className="p-6 text-center">
          <div className="text-base leading-loose font-bold text-default">
            {plan.label}
          </div>
          <div className="mb-2 text-sm text-muted-60">{plan.description}</div>

          <div className="text-5xl leading-snug font-bold text-default">{`${formatPrice(
            plan.amount,
            plan.currency,
          )}`}</div>
          {plan.interval ? (
            <div className="text-sm text-muted-60">{`/${plan.interval}`}</div>
          ) : (
            <div className="text-sm text-muted-60">&nbsp;</div>
          )}

          <div className="pb-6" />

          <Button type="neutral" href={buttonLink}>
            {buttonLabel || 'Get started'}
          </Button>

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
                feature.available ? undefined : 'text-muted-60 line-through',
              )}
            />
          ))}

          <div className="pb-6" />
        </div>
      )}
    </section>
  )
}
