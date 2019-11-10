import React, { Fragment } from 'react'

import { activePlans } from '@brunolemos/devhub-core'
import Link from 'next/link'
import { PricingPlanBlock } from './PricingPlanBlock'

export interface PricingPlansProps {}

const pricingPlanComponents = activePlans.map(plan =>
  plan.amount > 0 ? (
    <PricingPlanBlock
      key={`pricing-plan-${plan.id}`}
      banner={plan.banner}
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
    <div className="container">
      <div className="flex flex-row lg:justify-center items-stretch -ml-8 sm:ml-0 -mr-8 sm:mr-0 pl-8 sm:pl-0 pr-8 sm:pr-0 overflow-x-scroll md:overflow-x-auto">
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

      <p className="block sm:hidden mb-4" />
      <small className="block sm:hidden italic text-sm text-muted-65 text-center">
        TIP: Scroll horizontally to see all plans
      </small>
    </div>
  )
}
