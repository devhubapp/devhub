import React, { Fragment } from 'react'

import { activePlans } from '@brunolemos/devhub-core'
import Link from 'next/link'
import { PricingPlanBlock } from './PricingPlanBlock'

export interface PricingPlansProps {}

const pricingPlanComponents = activePlans.map(plan =>
  plan.amount > 0 ? (
    <PricingPlanBlock
      key={`pricing-plan-${plan.id}`}
      banner={plan.cannonicalId === 'starter' ? 'Most potato' : true}
      buttonLink={`/subscribe?plan=${plan.cannonicalId}`}
      plan={plan}
    />
  ) : (
    <PricingPlanBlock
      key={`pricing-plan-${plan.cannonicalId}`}
      banner
      buttonLink={`/download?plan=${plan.cannonicalId}`}
      buttonLabel="Download"
      plan={plan}
    />
  ),
)

export function PricingPlans(_props: PricingPlansProps) {
  return (
    <section id="pricing-plans">
      <div className="flex flex-row lg:justify-center items-stretch overflow-x-scroll md:overflow-x-auto">
        {pricingPlanComponents.map((component, index) => (
          <Fragment key={`${component.key}-container`}>
            {component}

            {index < pricingPlanComponents.length - 1 ? (
              <div className="pr-2 sm:pr-6" />
            ) : (
              <div className="pr-2" />
            )}
          </Fragment>
        ))}
      </div>

      <p className="mb-16" />

      <div className="text-center">
        <Link href="/account">
          <a className="text-xs text-muted-65 text-center">
            Already on a paid plan? Manage your account
          </a>
        </Link>
      </div>
    </section>
  )
}
