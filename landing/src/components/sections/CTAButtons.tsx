import {
  activePaidPlans,
  constants,
  freeTrialDays,
} from '@brunolemos/devhub-core'
import classNames from 'classnames'

import { useAuth } from '../../context/AuthContext'
import { getSystemLabel } from '../../helpers'
import { useFormattedPlanPrice } from '../../hooks/use-formatted-plan-price'
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
  const priceLabel = useFormattedPlanPrice(
    activePaidPlans[0].amount,
    activePaidPlans[0],
  )

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
          {activePaidPlans.length === 1 &&
          !activePaidPlans[0].interval &&
          activePaidPlans[0].amount ? (
            <Button
              className="mb-2 mr-2"
              href={authData.appToken ? '/purchase' : '/purchase?autologin'}
              type="primary"
            >
              {`Purchase for ${priceLabel}`}
            </Button>
          ) : activePaidPlans.length === 1 && activePaidPlans[0] ? (
            <Button
              type="primary"
              href="/purchase"
              target="_top"
              className="mb-2 mr-2"
            >
              {freeTrialDays
                ? 'Start free trial'
                : activePaidPlans[0].interval
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
              {freeTrialDays ? 'Start free trial' : 'See pricing'}
            </Button>
          )}

          {!!(
            freeTrialDays && !activePaidPlans.every(plan => !plan.interval)
          ) && (
            <Button
              type="neutral"
              href="/download?autostart"
              className="mb-2 mr-2"
            >
              {`Download for ${getSystemLabel(os)}`}
            </Button>
          )}
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
            Open web version
          </Button>
        </>
      )}
    </div>
  )
}
