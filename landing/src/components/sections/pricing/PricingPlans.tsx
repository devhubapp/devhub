import { activePlans, PlanType } from '@brunolemos/devhub-core'
import React, { Fragment, useMemo, useState } from 'react'

import { useAuth } from '../../../context/AuthContext'
import { Tabs } from '../../common/Tabs'
import { PricingPlanBlock } from './PricingPlanBlock'

export interface PricingPlansProps {}

export function PricingPlans(_props: PricingPlansProps) {
  const { authData } = useAuth()

  const [tab, setTab] = useState<PlanType>(
    (authData && authData.plan && authData.plan.type) === 'team'
      ? 'team'
      : 'individual',
  )

  const pricingPlanComponents = useMemo(
    () =>
      activePlans
        .filter(
          plan =>
            !!(
              plan &&
              (plan.type === tab || (tab === 'individual' && !plan.type))
            ),
        )
        .map(plan =>
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
        ),
    [tab],
  )

  return (
    <div className="container">
      <Tabs<NonNullable<PlanType>>
        className="mb-6"
        onTabChange={id => setTab(id)}
      >
        <Tabs.Tab
          active={tab === 'individual'}
          id="individual"
          title="Individual"
        />
        <Tabs.Tab active={tab === 'team'} id="team" title="Team" />
      </Tabs>

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
