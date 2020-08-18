import { PlanType } from '@devhub/core'
import Link from 'next/link'
import React, { Fragment, useMemo, useState } from 'react'

import { useAuth } from '../../../context/AuthContext'
import { usePlans } from '../../../context/PlansContext'
import { getPurchaseOrSubscribeRoute } from '../../../helpers'
import { Tabs } from '../../common/Tabs'
import { PricingPlanBlock } from './PricingPlanBlock'

export interface PricingPlansProps {}

export function PricingPlans(_props: PricingPlansProps) {
  const { authData } = useAuth()
  const { dealCode, plans } = usePlans()

  const planTypesCounters = plans.reduce<
    Partial<Record<NonNullable<PlanType>, number>>
  >((obj, plan) => {
    if (!(plan && plan.type)) return obj
    obj[plan.type] = (obj[plan.type] || 0) + 1
    return obj
  }, {})

  const hasMultiplePlanTypes = Object.keys(planTypesCounters).length > 1

  const [_tab, setTab] = useState<PlanType | undefined>(undefined)
  const tab =
    _tab ||
    (hasMultiplePlanTypes &&
    (authData && authData.plan && authData.plan.type) === 'team'
      ? 'team'
      : (authData && authData.plan && authData.plan.type) === 'custom'
      ? 'custom'
      : hasMultiplePlanTypes
      ? 'individual'
      : undefined)

  // const previousDealCodeRef = useRef(dealCode)
  // useEffect(() => {
  //   if (dealCode) previousDealCodeRef.current = dealCode
  // }, [dealCode])

  const pricingPlanComponents = useMemo(() => {
    const filteredPlans = plans.filter(
      plan =>
        !!(
          plan &&
          ((!tab && !hasMultiplePlanTypes) ||
            (plan.type === tab || (tab === 'individual' && !plan.type)))
        ),
    )

    return filteredPlans.map(plan =>
      plan && plan.amount > 0 ? (
        <PricingPlanBlock
          key={`pricing-plan-${plan.id}`}
          banner={plan.banner}
          buttonLink={`/${getPurchaseOrSubscribeRoute(plans)}?plan=${
            plan.cannonicalId
          }${
            '' // plan.paddleProductId ? '&autostart' : ''
          }${!(authData && authData.appToken) ? '&autologin' : ''}`}
          plan={plan}
          totalNumberOfVisiblePlans={filteredPlans.length}
        />
      ) : plan ? (
        plan.type === 'custom' ? (
          <PricingPlanBlock
            key={`pricing-plan-${plan.cannonicalId}`}
            banner
            buttonLink={`mailto:bruno@devhubapp.com`}
            buttonLabel="Contact us"
            plan={plan}
            totalNumberOfVisiblePlans={filteredPlans.length}
          />
        ) : (
          <PricingPlanBlock
            key={`pricing-plan-${plan.cannonicalId}`}
            banner
            buttonLink={`/download?plan=${plan.cannonicalId}`}
            buttonLabel="Download"
            plan={plan}
            totalNumberOfVisiblePlans={filteredPlans.length}
          />
        )
      ) : null,
    )
  }, [plans, tab])

  return (
    <div className="container">
      {!!hasMultiplePlanTypes && (
        <Tabs<NonNullable<PlanType>>
          className="mb-6"
          onTabChange={id => setTab(id)}
        >
          {!!planTypesCounters.individual && (
            <Tabs.Tab
              active={tab === 'individual'}
              id="individual"
              title="Individual"
            />
          )}
          {!!planTypesCounters.team && (
            <Tabs.Tab active={tab === 'team'} id="team" title="Team" />
          )}
          {!!planTypesCounters.custom && (
            <Tabs.Tab active={tab === 'custom'} id="custom" title="Custom" />
          )}
        </Tabs>
      )}

      <div className="flex flex-row lg:justify-center items-stretch -ml-8 sm:ml-0 -mr-8 sm:mr-0 pl-8 sm:pl-0 pr-8 sm:pr-0 overflow-x-scroll md:overflow-x-auto">
        {pricingPlanComponents.map((component, index) =>
          component ? (
            <Fragment key={`${component.key}-container`}>
              {component}

              {index < pricingPlanComponents.length - 1 ? (
                <div className="pr-2 sm:pr-6" />
              ) : (
                <div className="pr-2" />
              )}
            </Fragment>
          ) : null,
        )}
      </div>

      {pricingPlanComponents.length > 1 && (
        <>
          <p className="block sm:hidden mb-4" />
          <small className="block sm:hidden italic text-sm text-muted-65 text-center">
            TIP: Scroll horizontally to see all plans
          </small>
        </>
      )}

      <p className="block mb-4" />

      <div className="flex flex-row justify-center text-center">
        <Link href="/deal">
          <a className="block italic text-sm text-muted-65 text-center">
            {dealCode
              ? 'Switch deal code'
              : // : previousDealCodeRef.current
                // ? 'Apply new deal code'
                'Apply deal code'}
          </a>
        </Link>

        {/* {dealCode ? (
          <>
            <p className="px-1 italic text-sm text-muted-65">|</p>

            <a
              className="block italic text-sm text-muted-65 text-center"
              href="javascript:void(0)"
              onClick={() => {
                trySetDealCode(null).catch(() => {
                  //
                })
              }}
            >
              See normal pricing
            </a>
          </>
        ) : previousDealCodeRef.current ? (
          <>
            <p className="px-1 italic text-sm text-muted-65">|</p>

            <a
              className="block italic text-sm text-muted-65 text-center"
              href="javascript:void(0)"
              onClick={() => {
                trySetDealCode(previousDealCodeRef.current).catch(() => {
                  //
                })
              }}
            >
              Restore deal pricing
            </a>
          </>
        ) : null} */}
      </div>
    </div>
  )
}
