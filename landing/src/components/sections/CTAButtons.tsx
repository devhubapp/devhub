import { constants, formatPrice } from '@devhub/core'
import classNames from 'classnames'

import { useAuth } from '../../context/AuthContext'
import { usePlans } from '../../context/PlansContext'
import { getPurchaseOrSubscribeRoute, getSystemLabel } from '../../helpers'
import { useLocalizedPlanDetails } from '../../hooks/use-localized-plan-details'
import { useSystem } from '../../hooks/use-system'
import Button from '../common/buttons/Button'

export interface CTAButtonsProps {
  center?: boolean
  className?: string
}

export default function CTAButtons(props: CTAButtonsProps) {
  const { center, className } = props

  const { os } = useSystem()
  const { authData } = useAuth()
  const { freeTrialDays, freePlan, paidPlans, plans } = usePlans()
  const localizedPlan = useLocalizedPlanDetails(paidPlans[0])
  const priceLabel = localizedPlan ? formatPrice(localizedPlan) : ''

  return (
    <div
      className={classNames(
        'flex flex-row flex-wrap',
        center && 'items-center justify-center m-auto text-center',
        className,
      )}
    >
      {!!(authData && authData.plan && authData.plan.amount) ? (
        <>
          <Button type="primary" href="/account" className="mb-2 mr-2">
            My account
          </Button>

          <Button
            type="neutral"
            href="/download?autostart"
            className="mb-2 mr-2"
          >
            {os ? `Download for ${getSystemLabel(os)}` : 'Download'}
          </Button>
        </>
      ) : os ? (
        <>
          {/*
          {paidPlans.length === 1 &&
          paidPlans[0] &&
          !paidPlans[0].interval &&
          paidPlans[0].amount ? (
            <Button
              className="mb-2 mr-2"
              href={
                authData.appToken
                  ? `/${getPurchaseOrSubscribeRoute(plans)}`
                  : `/${getPurchaseOrSubscribeRoute(plans)}?autologin`
              }
              type="primary"
            >
              {`Purchase${priceLabel ? ` for ${priceLabel}` : ''}`}
            </Button>
          ) : paidPlans.length === 1 && paidPlans[0] ? (
            <Button
              type="primary"
              href={`/${getPurchaseOrSubscribeRoute(plans)}`}
              target="_top"
              className="mb-2 mr-2"
            >
              {paidPlans[0].trialPeriodDays
                ? 'Start free trial'
                : freeTrialDays
                ? 'See pricing'
                : paidPlans[0].interval
                ? 'Subscribe'
                : 'Purchase'}
            </Button>
          ) : (
            <Button
              type="primary"
              href="/pricing"
              target="_top"
              className="mb-2 mr-2"
            >
              {paidPlans[0] && paidPlans[0].trialPeriodDays
                ? 'Start free trial'
                : 'See pricing'}
            </Button>
          )}
          */}

          {!!(
            (freeTrialDays || freePlan) &&
            plans.some(plan => !!plan && !plan.amount)
          ) && (
            <Button
              type="primary"
              href="/download?autostart"
              className="mb-2 mr-2"
            >
              {`Download for ${getSystemLabel(os)}`}
            </Button>
          )}

          <Button
            type="neutral"
            href={constants.APP_BASE_URL}
            target="_top"
            className="mb-2"
          >
            Use web version
          </Button>
        </>
      ) : (
        <>
          <Button type="primary" href="/download" className="mb-2">
            Download the app
          </Button>

          <Button
            type="neutral"
            href={constants.APP_BASE_URL}
            target="_top"
            className="mb-2"
          >
            Use web version
          </Button>
        </>
      )}
    </div>
  )
}
