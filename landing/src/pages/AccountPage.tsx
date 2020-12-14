import { formatPriceAndInterval, isPlanStatusValid } from '@devhub/core'
import classNames from 'classnames'
import Link from 'next/link'
import qs from 'qs'
import React from 'react'

import { LogoHead } from '../components/common/LogoHead'
import LandingLayout from '../components/layouts/LandingLayout'
import GitHubLoginButton from '../components/sections/login/GitHubLoginButton'
import { useAuth } from '../context/AuthContext'
import { usePlans } from '../context/PlansContext'
import { getPurchaseOrSubscribeRoute, getTrialTimeLeftLabel } from '../helpers'

export interface AccountPageProps {}

export default function AccountPage(_props: AccountPageProps) {
  const {
    abortSubscriptionCancellation,
    authData,
    cancelSubscription,
    deleteAccount,
    logout,
  } = useAuth()

  const { plans, freeTrialDays, paidPlans, userPlanInfo } = usePlans()

  const priceLabelForQuantity = authData.plan
    ? formatPriceAndInterval(
        authData.plan,
        authData.plan && { quantity: authData.plan.quantity },
      )
    : ''

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
          {!!userPlanInfo && authData.plan ? (
            <>
              {authData.plan.interval ? 'Current plan: ' : 'You bought '}
              <strong className="text-default">
                {authData.plan.label ||
                  userPlanInfo.label ||
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
          ) : userPlanInfo ? (
            userPlanInfo.label
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
              <span
                className={classNames(
                  !isPlanStatusValid(authData.plan)
                    ? 'text-red'
                    : 'text-default',
                )}
              >
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
          userPlanInfo &&
          userPlanInfo.description
        ) && (
          <p className="mb-2 text-sm text-muted-default italic">
            {userPlanInfo.description}
          </p>
        )}

        <div className="pb-4" />

        {authData.plan && authData.plan.amount > 0 ? (
          <>
            {paidPlans.some((p) => !!p && !p.interval) &&
              (!!(!freeTrialDays && authData.plan.interval) ? (
                <Link
                  href={`/${getPurchaseOrSubscribeRoute(plans)}${qs.stringify(
                    {
                      plan: paidPlans.find((p) => !!p && !p.interval)!
                        .cannonicalId,
                    },
                    { addQueryPrefix: true },
                  )}`}
                >
                  <a className="text-default">Purchase</a>
                </Link>
              ) : (
                <Link
                  href={`/${getPurchaseOrSubscribeRoute(plans)}${qs.stringify(
                    {
                      plan: paidPlans.find((p) => !!p && !p.interval)!
                        .cannonicalId,
                      action: 'update_seats',
                    },
                    { addQueryPrefix: true },
                  )}`}
                >
                  <a className="text-default">
                    {authData.plan.interval
                      ? 'Purchase'
                      : 'Purchase for more people'}
                  </a>
                </Link>
              ))}

            <Link href="/download">
              <a className="text-default">Download</a>
            </Link>

            {!!(
              authData.plan.interval &&
              paidPlans.some((plan) => plan && plan.interval)
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
                href={`/${getPurchaseOrSubscribeRoute(plans)}${qs.stringify(
                  {
                    action: 'update_seats',
                    plan:
                      authData.plan && authData.plan.id
                        ? paidPlans.find(
                            (_p) => _p && _p.id === authData.plan!.id,
                          )
                          ? paidPlans.find(
                              (_p) => _p && _p.id === authData.plan!.id,
                            )!.cannonicalId
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
                href={`/${getPurchaseOrSubscribeRoute(plans)}${qs.stringify(
                  {
                    action: 'update_card',
                    plan:
                      authData.plan && authData.plan.id
                        ? paidPlans.find(
                            (_p) => _p && _p.id === authData.plan!.id,
                          )
                          ? paidPlans.find(
                              (_p) => _p && _p.id === authData.plan!.id,
                            )!.cannonicalId
                          : 'current'
                        : undefined,
                  },
                  { addQueryPrefix: true },
                )}`}
              >
                <a className="text-default">
                  {!isPlanStatusValid(authData.plan)
                    ? '👉 Update credit card 👈'
                    : 'Update credit card'}
                </a>
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
            {paidPlans.length === 1 && paidPlans[0] ? (
              <Link href={`/${getPurchaseOrSubscribeRoute(plans)}`}>
                <a className="text-default">
                  {paidPlans[0].interval ? 'Subscribe' : 'Purchase'}
                </a>
              </Link>
            ) : (
              <Link href="/pricing">
                <a className="text-default">
                  {paidPlans.some((plan) => plan && plan.interval)
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
