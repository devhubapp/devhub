import classNames from 'classnames'
import React from 'react'

import { Plan } from '../../../types'
import Button from '../../common/buttons/Button'
import CheckLabel from '../../common/CheckLabel'

export interface PricingPlanBlockProps {
  banner?: string | boolean
  buttonLabel?: string
  buttonLink: string
  plan: Plan
}

export function PricingPlanBlock(props: PricingPlanBlockProps) {
  const { banner, buttonLabel, buttonLink, plan } = props

  return (
    <section className="pricing-plan flex-shrink-0 w-64">
      <div className="m-1 bg-more-1 shadow border border-primary rounded">
        {banner === true ? (
          <div className="text-sm leading-loose px-6 text-center font-semibold">
            &nbsp;
          </div>
        ) : banner ? (
          <div className="bg-primary text-primary-foreground text-sm leading-loose px-6 text-center font-semibold rounded-t">
            {banner}
          </div>
        ) : null}

        <div className="p-6 text-center">
          <div className="text-base leading-loose font-bold text-default">
            {plan.name}
          </div>
          <div className="mb-2 text-sm text-muted-60">{plan.description}</div>

          <div className="text-5xl leading-snug font-bold text-default">{`$${
            typeof plan.price === 'number' ? plan.price : '?'
          }`}</div>
          {plan.period && (
            <div className="text-sm text-muted-60">{`/${plan.period}`}</div>
          )}

          <div className="pb-6" />

          <Button type="secondary" href={buttonLink}>
            {buttonLabel || 'Get started'}
          </Button>

          <div className="pb-6" />
        </div>
      </div>

      {!!(plan.features && plan.features.length) && (
        <div className="p-4">
          <div className="pb-2" />

          {plan.features.map((feature, index) => (
            <CheckLabel
              key={`pricing-plan-${plan.name}-feature-${index}`}
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
