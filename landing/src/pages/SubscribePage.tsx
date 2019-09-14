import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements'

import { activePlans, Plan } from '@brunolemos/devhub-core/dist'
import Link from 'next/link'
import { Select } from '../components/common/Select'
import LandingLayout from '../components/layouts/LandingLayout'
import GitHubLoginButton from '../components/sections/login/GitHubLoginButton'
import { SubscribeForm } from '../components/sections/subscribe/SubscribeForm'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../helpers'
import SubscribedPage from './SubscribedPage'

export interface SubscribePageProps {}

const paidPlansArr = activePlans.filter(plan => plan.amount > 0)

export default function SubscribePage(_props: SubscribePageProps) {
  const Router = useRouter()

  const _planFromQuery = Router.query.plan as string | undefined
  const planFromQuery = paidPlansArr.find(
    p => p.cannonicalId === _planFromQuery,
  )
    ? (_planFromQuery as Plan['cannonicalId'])
    : 'pro'

  const [planCannonicalId, setPlanCannonicalId] = useState<
    Plan['cannonicalId']
  >(planFromQuery)

  const [stripe, setStripe] = useState(null)

  const [hasJustSubscribed, setHasJustSubscribed] = useState(false)

  const { authData, logout } = useAuth()

  useEffect(() => {
    if (!planFromQuery) return

    Router.replace(Router.route, Router.pathname, { shallow: true })
  }, [planFromQuery])

  const plan = paidPlansArr.find(p => p.cannonicalId === planCannonicalId)
  useEffect(() => {
    if (!plan) setPlanCannonicalId('pro')
  }, [plan])

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
                onSuccess={() => setHasJustSubscribed(true)}
                plan={plan}
              />
            </Elements>
          </StripeProvider>
        </div>

        <div className="flex flex-row flex-wrap items-center italic text-sm whitespace-pre">
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

  if (hasJustSubscribed) return <SubscribedPage />

  if (!plan) return null

  return (
    <LandingLayout>
      <section id="subscribe" className="container">
        <div className="flex flex-col items-center m-auto text-center">
          <img
            alt="DevHub screenshot"
            className="w-20 h-20 mb-8 bg-primary border-4 border-bg-less-2 rounded-full"
            src="/static/logo.png"
          />

          <h1 className="mb-4 text-2xl sm:text-4xl whitespace-no-wrap">
            {authData.plan && authData.plan.amount > 0
              ? authData.plan.id === plan.id
                ? 'Update my '
                : 'Switch to '
              : 'Subscribe to '}
            <Select<Plan['cannonicalId']>
              onChange={option => setPlanCannonicalId(option)}
            >
              {paidPlansArr.map(p => (
                <Select.Option
                  key={`subscribe-plan-option-${p.cannonicalId}`}
                  id={p.cannonicalId}
                  selected={p.cannonicalId === planCannonicalId}
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
          </h1>

          <p className="mb-4 text-sm text-muted-65">{`${formatPrice(
            plan.amount,
            plan.currency,
          )}/${plan.interval} (${plan.currency.toUpperCase()}) · ${
            plan.trialPeriodDays > 0
              ? `${plan.trialPeriodDays}-day free trial · `
              : ''
          }Cancel anytime`}</p>

          {authData.plan && authData.plan.amount > 0 && (
            <Link href="/account">
              <a className="mb-4 text-sm text-muted-65">
                Manage existing subscription
              </a>
            </Link>
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
