import {
  activePaidPlans,
  allPlans,
  formatPriceAndInterval,
  Plan,
} from '@brunolemos/devhub-core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, { useEffect, useMemo, useState } from 'react'
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

export interface SubscribePageProps {}

export default function SubscribePage(_props: SubscribePageProps) {
  const Router = useRouter()

  const { authData, logout } = useAuth()
  const userPlan = allPlans.find(
    p => p.id === (authData && authData.plan && authData.plan.id),
  )

  const plans = useMemo(() => {
    if (!userPlan) return activePaidPlans
    if (activePaidPlans.find(p => p.id === userPlan.id)) return activePaidPlans
    return [userPlan].concat(activePaidPlans)
  }, [userPlan, activePaidPlans])

  const _planFromQuery = Router.query.plan as string | undefined
  const planFromQuery =
    (_planFromQuery === 'current' && userPlan) ||
    (_planFromQuery && plans.find(p => p.cannonicalId === _planFromQuery)) ||
    undefined

  const action = Router.query.action as SubscribeFormProps['action']

  const [stripe, setStripe] = useState(null)

  const plan =
    planFromQuery ||
    (userPlan && userPlan.id && plans.find(p => p.id === userPlan.id)) ||
    plans[0]

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // tslint:disable-next-line no-console
      console.warn('Stripe not loaded. No window or document global object.')
      return
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = ' https://js.stripe.com/v3/'

    let isMounted = true
    script.onload = () => {
      if (!(isMounted && window.Stripe)) return
      setStripe(window.Stripe(process.env.STRIPE_PUBLIC_KEY!))
    }

    document.head.appendChild(script)

    return () => {
      isMounted = false
    }
  }, [])

  function renderContent() {
    if (!(authData.appToken && authData.github && authData.github.login)) {
      return <GitHubLoginButton />
    }

    if (!plan) return null

    return (
      <>
        <div className="w-full mb-10">
          <StripeProvider stripe={stripe}>
            <Elements>
              <SubscribeForm
                action={action}
                onSuccess={() => Router.push('/subscribed')}
                plan={plan}
              />
            </Elements>
          </StripeProvider>
        </div>

        {authData.plan && authData.plan.amount > 0 && (
          <Link href="/account">
            <a className="mb-4 text-sm text-muted-65">
              Manage existing subscription
            </a>
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
          <Link href="/account">
            <a className="text-muted-65">{authData.github.login}</a>
          </Link>
          <span className="text-muted-65">
            {' '}
            (
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

  if (!plan) return null

  const isMyPlan = !!(authData.plan && authData.plan.id === plan.id)

  return (
    <LandingLayout>
      <section id="subscribe" className="container">
        <LogoHead />

        <div className="flex flex-col items-center m-auto text-center">
          <h1 className="mb-4 text-2xl sm:text-4xl">
            {isMyPlan && action === 'update_card' ? (
              'Update credit card'
            ) : isMyPlan && action === 'update_seats' ? (
              'Update seats'
            ) : (
              <>
                {authData.plan && authData.plan.amount > 0
                  ? isMyPlan
                    ? 'Update my '
                    : 'Switch to '
                  : 'Subscribe to '}
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
                >
                  {plans.map(p => (
                    <Select.Option
                      key={`subscribe-plan-option-${p.cannonicalId}`}
                      id={
                        authData.plan &&
                        authData.plan.id === p.id &&
                        !activePaidPlans.find(_p => _p.id === p.id)
                          ? 'current'
                          : p.cannonicalId
                      }
                      selected={p.id === plan.id}
                    >
                      {authData.plan &&
                      authData.plan &&
                      authData.plan.id === p.id &&
                      p.id !== plan.id
                        ? `${p.label.toLowerCase()} (current)`
                        : p.label.toLowerCase()}
                    </Select.Option>
                  ))}
                </Select>{' '}
                plan
              </>
            )}
          </h1>

          <p className="mb-4 text-sm text-muted-65">{`${formatPriceAndInterval(
            plan.amount,
            plan,
            {
              quantity:
                isMyPlan && action === 'update_card'
                  ? authData.plan && authData.plan.quantity
                  : undefined,
            },
          )} (${plan.currency.toUpperCase()}) · ${
            plan.trialPeriodDays > 0
              ? `${plan.trialPeriodDays}-day free trial · `
              : ''
          }${
            isMyPlan &&
            authData.plan &&
            authData.plan.quantity &&
            authData.plan.quantity > 1
              ? `Currently at ${authData.plan.quantity} seats · `
              : ''
          }Cancel anytime`}</p>

          {!!(
            authData.plan &&
            authData.plan.type === 'team' &&
            plan.type !== 'team'
          ) && (
            <>
              <p className="mb-4 text-sm text-red">
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

declare global {
  interface Window {
    Stripe?: (apiKey: string) => any
  }
}
