import { addDashesToString, isPlanStatusValid } from '@devhub/core'
import Link from 'next/link'
import qs from 'qs'
import React, { Fragment } from 'react'

import Button from '../components/common/buttons/Button'
import { LogoHead } from '../components/common/LogoHead'
import LandingLayout from '../components/layouts/LandingLayout'
import GitHubLoginButton from '../components/sections/login/GitHubLoginButton'
import { useAuth } from '../context/AuthContext'
import { usePlans } from '../context/PlansContext'
import { getPurchaseOrSubscribeRoute } from '../helpers'

export interface SuccessPageProps {}

export default function SuccessPage(_props: SuccessPageProps) {
  const { authData } = useAuth()
  const { plans, paidPlans, userPlanInfo } = usePlans()

  if (!(authData.plan && userPlanInfo))
    return (
      <LandingLayout>
        <LogoHead />

        <section id="success" className="container">
          <div className="flex flex-col items-center m-auto text-center">
            <GitHubLoginButton />
          </div>
        </section>
      </LandingLayout>
    )

  const dealCodeToShare =
    authData.plan && authData.plan.dealCode
      ? `${addDashesToString(
          authData.plan.dealCode,
          authData.github.id ? authData.github.id.length + 2 : 4,
        )}${authData.github.id ? `-RF${authData.github.id}` : ''}`
      : undefined

  return (
    <LandingLayout>
      <LogoHead />

      <section id="success" className="container">
        <div className="flex flex-col items-center m-auto text-center">
          <h1 className="mb-4 text-2xl sm:text-4xl whitespace-no-wrap">
            {authData.plan.status === 'incomplete' ||
            authData.plan.status === 'incomplete_expired'
              ? 'Something went wrong'
              : 'You are all set 🎉'}
          </h1>

          {authData.plan.status === 'active' ||
          authData.plan.status === 'trialing' ? (
            <h2 className="mb-4 text-xl sm:text-2xl">
              {!authData.plan.amount ? (
                <>
                  {"You're currently on the "}
                  <strong>{authData.plan.label || 'Free'}</strong> plan
                </>
              ) : authData.plan.interval ? (
                <>
                  {" You've successfully subscribed to the "}
                  <strong>{authData.plan.label}</strong> plan
                  {authData.plan.quantity && authData.plan.quantity > 1
                    ? ` (${authData.plan.quantity} seats)`
                    : ''}
                </>
              ) : (
                <>
                  {" You've successfully purchased "}
                  <strong>{authData.plan.label}</strong>
                  {authData.plan.quantity && authData.plan.quantity > 1
                    ? ` (${authData.plan.quantity} seats)`
                    : ''}
                </>
              )}
            </h2>
          ) : (
            <h2 className="mb-4 text-xl sm:text-2xl">
              {"You've subscribed to the "}
              <strong>{authData.plan.label}</strong> plan
              {authData.plan.quantity && authData.plan.quantity > 1
                ? ` (${authData.plan.quantity} seats)`
                : ''}
              , but your subscription status is{' '}
              <strong>{authData.plan.status}</strong>
            </h2>
          )}

          {authData.plan.status === 'incomplete' ||
          authData.plan.status === 'incomplete_expired' ? (
            <p className="mb-8 text-default">
              Credit card charge failed. Please try again with another card.
            </p>
          ) : null}

          {isPlanStatusValid(authData.plan) && (
            <>
              <p className="mb-8 text-default">
                {authData.plan.users &&
                authData.plan.users.filter(
                  (username) =>
                    `${username || ''}`.toLowerCase() !==
                    authData.github.login.toLowerCase(),
                ).length ? (
                  <>
                    <div className="mb-2">
                      These people can now
                      <span className="text-orange">*</span> use DevHub:{' '}
                      {authData.plan.users.map((username, index) => (
                        <Fragment key={username}>
                          {index > 0 && ', '}
                          <a
                            className="font-bold"
                            href={`https://github.com/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {username}
                          </a>
                        </Fragment>
                      ))}{' '}
                      (
                      <Link
                        href={`/${getPurchaseOrSubscribeRoute(
                          plans,
                        )}${qs.stringify(
                          {
                            action: 'update_seats',
                            plan:
                              authData.plan && authData.plan.id
                                ? paidPlans.find(
                                    (_p) => _p && _p.id === authData.plan!.id,
                                  )
                                  ? userPlanInfo.cannonicalId
                                  : 'current'
                                : undefined,
                          },
                          { addQueryPrefix: true },
                        )}`}
                      >
                        <a className="text-default">
                          {authData.plan && authData.plan.interval
                            ? 'edit'
                            : 'buy more'}
                        </a>
                      </Link>
                      )
                    </div>

                    {!!authData.plan.users.length && (
                      <div className="flex flex-row items-center justify-center mb-2">
                        {authData.plan.users.map((username) => (
                          <>
                            <a
                              href={`https://github.com/${username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                alt=""
                                className="w-6 h-6 m-1 bg-less-1 rounded-full"
                                src={`https://github.com/${username}.png`}
                                title={`@${username}`}
                              />
                            </a>
                          </>
                        ))}
                      </div>
                    )}

                    <p className="mb-2 text-orange text-sm italic">
                      *Note: We are enabling their plans manually at this
                      moment, so it may take a few hours to have an effect on
                      their accounts.
                    </p>
                  </>
                ) : authData.plan.type === 'team' ? (
                  <Link
                    href={`/${getPurchaseOrSubscribeRoute(plans)}${qs.stringify(
                      {
                        action: 'update_seats',
                        plan:
                          authData.plan && authData.plan.id
                            ? paidPlans.find(
                                (_p) => _p && _p.id === authData.plan!.id,
                              )
                              ? userPlanInfo.cannonicalId
                              : 'current'
                            : undefined,
                      },
                      { addQueryPrefix: true },
                    )}`}
                  >
                    <a className="text-default">
                      Click to manage who can use this subscription
                    </a>
                  </Link>
                ) : dealCodeToShare ? (
                  <>
                    You can share this same deal with up to 3 people:
                    <br />
                    <strong>Deal code to share</strong>:{' '}
                    <span className="text-primary">{dealCodeToShare}</span> 🙌
                    <br />
                    <small className="text-muted-65 italic">
                      {
                        "(This code won't show up again, feel free to copy it now)"
                      }
                    </small>
                  </>
                ) : (
                  <>
                    What about sharing the news with your friends? 🙌
                    <br />
                    You can now open DevHub or download it below:
                  </>
                )}
              </p>

              <div className="flex flex-row">
                <Button
                  type="primary"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `I just bought @devhub_app${
                      authData.plan.type === 'team'
                        ? ' for my team!'
                        : dealCodeToShare
                        ? ` using the deal code ${dealCodeToShare}`
                        : ''
                    } https://devhubapp.com/`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-2 mr-2"
                >
                  Tweet about it
                </Button>

                <Button type="neutral" href="/download" className="mb-2">
                  Download the app
                </Button>
              </div>
            </>
          )}

          {!!authData.plan.interval && (
            <>
              <p className="mb-4" />

              <div className="text-center">
                <Link href="/account">
                  <a className="text-sm text-muted-65 text-center">
                    Manage subscription
                  </a>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </LandingLayout>
  )
}
