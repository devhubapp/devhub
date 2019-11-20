import {
  activePaidPlans,
  allPlansObj,
  formatPriceAndInterval,
} from '@brunolemos/devhub-core'
import Link from 'next/link'
import qs from 'qs'
import React from 'react'

import { LogoHead } from '../components/common/LogoHead'
import LandingLayout from '../components/layouts/LandingLayout'
import GitHubLoginButton from '../components/sections/login/GitHubLoginButton'
import { useAuth } from '../context/AuthContext'
import { getTrialTimeLeftLabel } from '../helpers'

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
              Current plan:{' '}
              <strong className="text-default">
                {authData.plan.label || planInfo.label}
              </strong>
              {authData && authData.plan && authData.plan.amount > 0 && (
                <small className="text-muted-65 italic">
                  {` (${authData.plan.currency.toUpperCase()} ${formatPriceAndInterval(
                    authData.plan.amount,
                    authData.plan,
                    { quantity: authData.plan.quantity },
                  )}${
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

        {!!(authData.plan && authData.plan.status) && (
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

            {authData.plan.cancelAtPeriodEnd && authData.plan.cancelAt ? (
              <p className="mb-2 text-sm text-muted-65 italic">{` Cancellation scheduled to ${new Date(
                authData.plan.cancelAt,
              ).toDateString()}`}</p>
            ) : authData.plan.status === 'incomplete' ||
              authData.plan.status === 'incomplete_expired' ? (
              <p className="mb-2 text-sm text-muted-65 italic">
                Failed to charge your card. Please try with a different one.
              </p>
            ) : null}
          </>
        )}

        <div className="pb-4" />

        {authData.plan && authData.plan.amount > 0 ? (
          <>
            <Link href="/pricing">
              <a className="text-default">Switch plan</a>
            </Link>

            {!!(
              authData.plan &&
              (authData.plan.type === 'team' ||
                (authData.plan.quantity && authData.plan.quantity > 1) ||
                (authData.plan.transformUsage &&
                  authData.plan.transformUsage.divideBy > 1))
            ) && (
              <Link
                href={`/subscribe${qs.stringify(
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

            <Link
              href={`/subscribe${qs.stringify(
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

            {authData.plan &&
            authData.plan.cancelAtPeriodEnd &&
            authData.plan.cancelAt ? (
              <a
                href="javascript:void(0)"
                className="text-default"
                onClick={() => abortSubscriptionCancellation()}
              >
                Abort subscription cancellation
              </a>
            ) : (
              <a
                href="javascript:void(0)"
                className="text-default"
                onClick={() => cancelSubscription(true)}
              >
                Cancel subscription
              </a>
            )}
          </>
        ) : (
          <>
            <Link href="/pricing">
              <a className="text-default">Subscribe to a plan</a>
            </Link>
          </>
        )}

        <a
          href="javascript:void(0)"
          className="text-default"
          onClick={() => deleteAccount(true)}
        >
          Delete account
        </a>

        <a
          href="javascript:void(0)"
          className="text-default"
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
