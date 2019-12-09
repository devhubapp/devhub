import {
  activePaidPlans,
  allPlansObj,
  isPlanStatusValid,
} from '@brunolemos/devhub-core'
import Link from 'next/link'
import qs from 'qs'
import React, { Fragment } from 'react'

import Button from '../components/common/buttons/Button'
import { LogoHead } from '../components/common/LogoHead'
import LandingLayout from '../components/layouts/LandingLayout'
import { useAuth } from '../context/AuthContext'

export interface SuccessPageProps {}

export default function SuccessPage(_props: SuccessPageProps) {
  const { authData } = useAuth()

  if (!authData.plan) return null

  const planInfo = allPlansObj[authData.plan.id]
  if (!planInfo) return null

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
                  You're currently on the{' '}
                  <strong>{authData.plan.label || 'Free'}</strong> plan
                </>
              ) : authData.plan.interval ? (
                <>
                  {' '}
                  You've successfully subscribed to the{' '}
                  <strong>{authData.plan.label}</strong> plan
                  {authData.plan.quantity && authData.plan.quantity > 1
                    ? ` (${authData.plan.quantity} seats)`
                    : ''}
                </>
              ) : (
                <>
                  {' '}
                  You've successfully purchased{' '}
                  <strong>{authData.plan.label}</strong>
                  {authData.plan.quantity && authData.plan.quantity > 1
                    ? ` (${authData.plan.quantity} seats)`
                    : ''}
                </>
              )}
            </h2>
          ) : (
            <h2 className="mb-4 text-xl sm:text-2xl">
              You've subscribed to the <strong>{authData.plan.label}</strong>{' '}
              plan
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
                  username =>
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
                          >
                            {username}
                          </a>
                        </Fragment>
                      ))}{' '}
                      (
                      <Link
                        href={`/purchase${qs.stringify(
                          {
                            action: 'update_seats',
                            plan:
                              authData.plan && authData.plan.id
                                ? activePaidPlans.find(
                                    _p => _p.id === authData.plan!.id,
                                  )
                                  ? planInfo.cannonicalId
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
                        {authData.plan.users.map(username => (
                          <>
                            <a
                              href={`https://github.com/${username}`}
                              target="_blank"
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
                    href={`/purchase${qs.stringify(
                      {
                        action: 'update_seats',
                        plan:
                          authData.plan && authData.plan.id
                            ? activePaidPlans.find(
                                _p => _p.id === authData.plan!.id,
                              )
                              ? planInfo.cannonicalId
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
                      authData.plan.type === 'team' ? ' for my team!' : ''
                    } https://devhubapp.com/`,
                  )}`}
                  target="_blank"
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
