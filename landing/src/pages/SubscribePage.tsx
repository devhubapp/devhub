import {
  activePaidPlans,
  allPlans,
  formatPrice,
  formatPriceAndInterval,
  Plan,
} from '@brunolemos/devhub-core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, { useMemo } from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements'

import { LogoHead } from '../components/common/LogoHead'
import { Select } from '../components/common/Select'
import LandingLayout from '../components/layouts/LandingLayout'
import GitHubLoginButton from '../components/sections/login/GitHubLoginButton'
import {
  SubscribeForm,
  SubscribeFormProps,
} from '../components/sections/subscribe/SubscribeForm'
import { useAuth } from '../context/AuthContext'
import { useStripeLoader } from '../context/StripeLoaderContext'
import { useLocalizedPlanDetails } from '../hooks/use-localized-plan-details'

export interface SubscribePageProps {}

export default function SubscribePage(_props: SubscribePageProps) {
  const Router = useRouter()

  const { authData, logout } = useAuth()

  const userPlan = allPlans.find(
    p => p.id === (authData && authData.plan && authData.plan.id),
  )

  const plans = useMemo(() => {
    if (!userPlan || !userPlan.amount) return activePaidPlans
    if (activePaidPlans.find(p => p.id === userPlan.id)) return activePaidPlans
    return [userPlan].concat(activePaidPlans)
  }, [userPlan, activePaidPlans])

  const _planFromQuery = Router.query.plan as string | undefined
  const planFromQuery =
    (_planFromQuery === 'current' && userPlan) ||
    (_planFromQuery && plans.find(p => p.cannonicalId === _planFromQuery)) ||
    undefined

  const action = Router.query.action as SubscribeFormProps['action']

  const { Stripe: stripe } = useStripeLoader()

  const plan =
    planFromQuery ||
    (userPlan && userPlan.id && plans.find(p => p.id === userPlan.id)) ||
    plans[0]

  const localizedPlan = useLocalizedPlanDetails(plan)

  const isMyPlan = !!(authData.plan && authData.plan.id === localizedPlan.id)

  const priceLabelWithInterval = formatPriceAndInterval(plan, {
    quantity:
      isMyPlan && action === 'update_card'
        ? authData.plan && authData.plan.quantity
        : undefined,
  })

  function renderContent() {
    if (!(authData.appToken && authData.github && authData.github.login)) {
      return <GitHubLoginButton />
    }

    if (!localizedPlan) return null

    return (
      <>
        <div className="w-full mb-10">
          <StripeProvider stripe={stripe}>
            <Elements>
              <SubscribeForm
                action={action}
                onSuccess={() => Router.push('/success')}
                plan={localizedPlan}
              />
            </Elements>
          </StripeProvider>
        </div>

        {authData.plan && authData.plan.amount > 0 && (
          <Link href="/account">
            <a className="mb-4 text-sm text-muted-65">Manage existing plan</a>
          </Link>
        )}

        <div className="flex flex-row flex-wrap items-center italic text-sm whitespace-pre mb-4">
          <Link href="/account">
            <a className="text-muted-65">
              <img
                alt="Your GitHub profile logo"
                className="w-4 h-4 mr-2 bg-less-1 rounded-full"
                src={`https://github.com/${authData.github.login}.png`}
              />
            </a>
          </Link>

          <span className="text-muted-65">Logged as </span>
          <a
            className="text-muted-65"
            href={`https://github.com/${authData.github.login}`}
            target="_blank"
          >
            {authData.github.login}
          </a>
          <span className="text-muted-65">
            {' '}
            (
            <Link href="/account">
              <a className="text-muted-65">manage</a>
            </Link>
            {' · '}
            <a
              href="javascript:void(0)"
              onClick={() => logout()}
              className="text-muted-65"
            >
              logout
            </a>
            )
          </span>
        </div>
      </>
    )
  }

  if (!localizedPlan) return null

  return (
    <LandingLayout>
      <section id="subscribe" className="container">
        <LogoHead />

        <div className="flex flex-col items-center m-auto text-center">
          <h1 className="mb-4 text-2xl sm:text-4xl">
            {isMyPlan &&
            action === 'update_card' &&
            localizedPlan.stripeIds.length ? (
              'Update credit card'
            ) : isMyPlan &&
              action === 'update_seats' &&
              localizedPlan.interval ? (
              'Update seats'
            ) : activePaidPlans.length === 1 && !localizedPlan.interval ? (
              'Purchase DevHub'
            ) : (
              <>
                {authData.plan && authData.plan.amount > 0
                  ? isMyPlan
                    ? 'Update my '
                    : 'Switch to '
                  : localizedPlan.interval
                  ? 'Subscribe to '
                  : 'Purchase '}
                {!!(plans.length > 1 || plans[0].label) && (
                  <>
                    <Select<Plan['cannonicalId']>
                      onChange={option => {
                        Router.replace(
                          `${Router.pathname}${qs.stringify(
                            {
                              ...Router.query,
                              plan: option,
                            },
                            { addQueryPrefix: true },
                          )}`,
                        )
                      }}
                      placeholder="DevHub"
                    >
                      {plans.map(
                        p =>
                          !!p.label && (
                            <Select.Option
                              key={`subscribe-plan-option-${p.cannonicalId}`}
                              id={
                                authData.plan &&
                                authData.plan.id === p.id &&
                                !activePaidPlans.find(_p => _p.id === p.id)
                                  ? 'current'
                                  : p.cannonicalId
                              }
                              selected={p.id === localizedPlan.id}
                            >
                              {authData.plan &&
                              authData.plan &&
                              authData.plan.id === p.id &&
                              p.id !== localizedPlan.id
                                ? `${p.label.toLowerCase()} (current)`
                                : p.label.toLowerCase()}
                            </Select.Option>
                          ),
                      )}
                    </Select>{' '}
                  </>
                )}
                plan
              </>
            )}
          </h1>

          <p className="mb-4 text-sm text-muted-65">
            {[
              !localizedPlan.paddleProductId &&
                `${priceLabelWithInterval}${
                  localizedPlan.currency
                    ? ` (${localizedPlan.currency.toUpperCase()})`
                    : ''
                }`,
              localizedPlan.trialPeriodDays > 0
                ? `${localizedPlan.trialPeriodDays}-day free trial`
                : '',
              isMyPlan &&
              authData.plan &&
              authData.plan.quantity &&
              authData.plan.quantity > 1
                ? `Currently at ${authData.plan.quantity} seats`
                : '',
              localizedPlan.interval
                ? 'Cancel anytime'
                : 'One-time payment (no subscription)',
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>

          {!!(
            authData.plan &&
            authData.plan.type === 'team' &&
            localizedPlan.type !== 'team'
          ) && (
            <>
              <p className="mb-4 text-sm text-orange">
                You are switching from a Team plan to an Individual plan. If you
                proceed, all team members will lose access to DevHub.
              </p>
            </>
          )}

          <div className="mb-4" />

          {renderContent()}
        </div>
      </section>
    </LandingLayout>
  )
}
