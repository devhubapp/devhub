import React, { ReactElement } from 'react'

import { PricingPlanBlockProps } from './PricingPlanBlock'

export interface PricingPlansProps {
  children: Array<ReactElement<PricingPlanBlockProps>>
}

export function PricingPlans(props: PricingPlansProps) {
  const { children } = props

  const total = React.Children.count(children)

  return (
    <section
      id="pricing-plans"
      className="flex flex-row lg:justify-center items-stretch overflow-x-scroll md:overflow-x-auto"
    >
      {React.Children.map(children, (child, index) => (
        <>
          {child}
          {index < total - 1 ? (
            <div className="pr-2 sm:pr-6" />
          ) : (
            <div className="pr-2" />
          )}
        </>
      ))}
    </section>
  )
}
