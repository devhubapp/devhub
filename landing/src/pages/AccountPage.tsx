import {
  activePaidPlans,
  allPlansObj,
  freeTrialDays,
} from '@brunolemos/devhub-core'
import Link from 'next/link'
import qs from 'qs'
import React from 'react'

import { LogoHead } from '../components/common/LogoHead'
import LandingLayout from '../components/layouts/LandingLayout'
import GitHubLoginButton from '../components/sections/login/GitHubLoginButton'
import { useAuth } from '../context/AuthContext'
import { getTrialTimeLeftLabel } from '../helpers'
import { useFormattedPlanPrice } from '../hooks/use-formatted-plan-price'

export interface AccountPageProps {}

export default function AccountPage(_props: AccountPageProps) {
  const {
    abortSubscriptionCancellation,
    authData,
    cancelSubscription,
    deleteAccount,
    logout,
  } = useAuth()

  const planInfo = authData.plan && allPlansObj[authData.plan.id]

  const priceLabelForQuantity = useFormattedPlanPrice(
    authData && authData.plan && authData.plan.amount,
    authData.plan,
    authData.plan && { quantity: authData.plan.quantity },
  )

  function renderContent() {
    if (!(authData.appToken && authData.github && authData.github.login)) {
      return (
        <>
          <LogoHead />

          <GitHubLoginButton />
        </>
      )
    }

    return (
      <>
        <img
          alt="Your GitHub profile logo"
          className="w-20 h-20 mb-8 bg-primary border-4 border-bg-less-2 rounded-full"
          src={`https://github.com/${authData.github.login}.png`}
        />

        <h1 className="mb-4 text-2xl sm:text-4xl whitespace-no-wrap">
          {authData.github.name || authData.github.login}
        </h1>

        <h2 className="mb-0 text-xl sm:text-2xl">
          {!!(planInfo && authData.plan) ? (
            <>
              {authData.plan.interval ? 'Current plan: ' : 'You bought '}
              <strong className="text-default">
                {authData.plan.label ||
                  planInfo.label ||
                  (authData.plan.amount ? 'Paid' : 'None')}
              </strong>
              {!!(
                authData &&
                authData.plan &&
                authData.plan.amount > 0 &&
                authData.plan.interval
              ) && (
                <small className="text-muted-65 italic">
                  {` (${authData.plan.currency.toUpperCase()} ${priceLabelForQuantity}${
                    authData.plan.quantity && authData.plan.quantity > 1
                      ? `, ${authData.plan.quantity} seats`
                      : ''
                  })`}
                </small>
              )}
            </>
          ) : (
            'Free plan'
          )}
        </h2>

        {!!(
          authData.plan &&
          authData.plan.status &&
          !(authData.plan.status === 'active' && !authData.plan.interval)
        ) && (
          <>
            <h2 className="mb-2 text-md sm:text-xl">
              Status:{' '}
              <span className="text-default">
                {authData.plan.status === 'trialing'
                  ? authData.plan.trialEndAt &&
                    authData.plan.trialEndAt > new Date().toISOString()
                    ? `${authData.plan.status} (${getTrialTimeLeftLabel(
                        authData.plan.trialEndAt,
                      )})`
                    : 'trial ended'
                  : authData.plan.status}
              </span>
            </h2>
          </>
        )}

        {authData.plan &&
          authData.plan.cancelAtPeriodEnd &&
          authData.plan.cancelAt && (
            <p className="mb-2 text-sm text-orange italic">
              {` Cancellation scheduled to ${new Date(
                authData.plan.cancelAt,
              ).toDateString()}`}{' '}
              <span className="text-muted-65">
                (
                <a
                  href="javascript:void(0)"
                  onClick={() => abortSubscriptionCancellation()}
                >
                  abort cancellation
                </a>
                )
              </span>
            </p>
          )}

        {!!(
          authData.plan &&
          (authData.plan.status === 'incomplete' ||
            authData.plan.status === 'incomplete_expired')
        ) && (
          <p className="mb-2 text-sm text-red italic">
            Failed to charge your card. Please try with a different one.
          </p>
        )}

        {!!(
          authData.plan &&
          !authData.plan.interval &&
          planInfo &&
          planInfo.description
        ) && (
          <p className="mb-2 text-sm text-muted-default italic">
            {planInfo.description}
          </p>
        )}

        <div className="pb-4" />

        {authData.plan && authData.plan.amount > 0 ? (
          <>
            {!activePaidPlans.some(p => !!p.interval) &&
              (!!(!freeTrialDays && authData.plan.interval) ? (
                <Link
                  href={`/purchase${qs.stringify(
                    { plan: activePaidPlans[0].cannonicalId },
                    { addQueryPrefix: true },
                  )}`}
                >
                  <a className="text-default">Purchase</a>
                </Link>
              ) : (
                <Link
                  href={`/purchase${qs.stringify(
                    {
                      plan: activePaidPlans[0].cannonicalId,
                      action: 'update_seats',
                    },
                    { addQueryPrefix: true },
                  )}`}
                >
                  <a className="text-default">Purchase for more people</a>
                </Link>
              ))}

            <Link href="/download">
              <a className="text-default">Download</a>
            </Link>

            {!!(
              authData.plan.interval &&
              activePaidPlans.some(plan => plan.interval)
            ) && (
              <Link href="/pricing">
                <a className="text-default">Switch plan</a>
              </Link>
            )}

            {!!(
              authData.plan &&
              authData.plan.interval &&
              (authData.plan.type === 'team' ||
                (authData.plan.quantity && authData.plan.quantity > 1) ||
                (authData.plan.transformUsage &&
                  authData.plan.transformUsage.divideBy > 1))
            ) && (
              <Link
                href={`/purchase${qs.stringify(
                  {
                    action: 'update_seats',
                    plan:
                      planInfo && planInfo.id
                        ? activePaidPlans.find(_p => _p.id === planInfo.id)
                          ? planInfo.cannonicalId
                          : 'current'
                        : undefined,
                  },
                  { addQueryPrefix: true },
                )}`}
              >
                <a className="text-default">Update seats</a>
              </Link>
            )}

            {!!(authData.plan && authData.plan.interval) && (
              <Link
                href={`/purchase${qs.stringify(
                  {
                    action: 'update_card',
                    plan:
                      planInfo && planInfo.id
                        ? activePaidPlans.find(_p => _p.id === planInfo.id)
                          ? planInfo.cannonicalId
                          : 'current'
                        : undefined,
                  },
                  { addQueryPrefix: true },
                )}`}
              >
                <a className="text-default">Update credit card</a>
              </Link>
            )}

            {!!(authData.plan && authData.plan.interval) &&
              (authData.plan.cancelAtPeriodEnd &&
              authData.plan.cancelAt ? null : (
                <a
                  href="javascript:void(0)"
                  className="text-default"
                  onClick={() => cancelSubscription(true)}
                >
                  Cancel subscription
                </a>
              ))}
          </>
        ) : (
          <>
            {activePaidPlans.length === 1 && activePaidPlans[0] ? (
              <Link href="/purchase">
                <a className="text-default">
                  {freeTrialDays
                    ? 'Start free trial'
                    : activePaidPlans[0].interval
                    ? 'Subscribe'
                    : 'Purchase'}
                </a>
              </Link>
            ) : (
              <Link href="/pricing">
                <a className="text-default">
                  {activePaidPlans.some(plan => plan.interval)
                    ? 'Subscribe to a plan'
                    : 'See plans'}
                </a>
              </Link>
            )}
          </>
        )}

        <p className="mb-2" />

        <a
          href="javascript:void(0)"
          className="text-muted-65 hover:text-default"
          onClick={() => deleteAccount(true)}
        >
          Delete account
        </a>

        <a
          href="javascript:void(0)"
          className="text-muted-65 hover:text-default"
          onClick={() => logout()}
        >
          Logout
        </a>
      </>
    )
  }

  return (
    <LandingLayout>
      <section id="subscribe" className="container">
        <div className="flex flex-col items-center m-auto text-center">
          {renderContent()}
        </div>
      </section>
    </LandingLayout>
  )
}
