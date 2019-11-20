import {
  constants,
  formatPriceAndInterval,
  isPlanStatusValid,
  Plan,
  UserPlan,
} from '@brunolemos/devhub-core'
import classNames from 'classnames'
import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'

import { useAuth } from '../../../context/AuthContext'
import { useTheme } from '../../../context/ThemeContext'
import { getDefaultDevHubHeaders } from '../../../helpers'
import Button from '../../common/buttons/Button'
import { Tabs } from '../../common/Tabs'
import { TextInput } from '../../common/TextInput'

export interface SubscribeFormProps {
  action?: 'update_card' | 'update_seats'
  plan: Plan
  onSuccess: () => void
}

export const SubscribeForm = injectStripe<SubscribeFormProps>(
  // tslint:disable-next-line ter-prefer-arrow-callback no-shadowed-variable
  function SubscribeForm(props) {
    const { action, children, onSuccess, plan, stripe } = props

    const isMountedRef = useRef(true)

    const { theme } = useTheme()
    const { authData, logout, mergeAuthData } = useAuth()

    const [isCardFilled, setIsCardFilled] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [formState, setFormState] = useState<{
      error: string | undefined
      isSubmiting: boolean
    }>({
      error: undefined,
      isSubmiting: false,
    })
    const [usersStr, setUsersStr] = useState(
      (authData &&
        authData.plan &&
        authData.plan.users &&
        authData.plan.users
          .map(str => `${str || ''}`.replace(/[\s]/g, ''))
          .filter(Boolean)
          .join(', ')) ||
        '',
    )

    const users = _.uniq(
      usersStr
        .split(',')
        .map(str => `${str || ''}`.replace(/[\s]/g, ''))
        .filter(Boolean),
    )

    const needsToFillTheCard =
      action === 'update_card' ||
      !(
        authData.plan &&
        authData.plan.amount &&
        isPlanStatusValid(authData.plan)
      )

    const [creditCardTab, setCreditCardTab] = useState<'current' | 'change'>(
      !needsToFillTheCard ? 'current' : 'change',
    )

    const quantityStep =
      plan.transformUsage && plan.transformUsage.divideBy > 1
        ? plan.transformUsage.divideBy
        : 1

    const [_quantity, setQuantity] = useState<UserPlan['quantity']>(undefined)

    const minimumQuantity =
      plan.type === 'team'
        ? Math.max(
            quantityStep > 1 ? quantityStep : 5,
            Math.ceil(users.length / quantityStep) * quantityStep,
          )
        : 1
    const quantity =
      plan.type === 'team'
        ? _quantity && _quantity >= 1
          ? Math.max(
              minimumQuantity,
              Math.round(_quantity / quantityStep) * quantityStep,
            )
          : authData.plan &&
            authData.plan.quantity &&
            authData.plan.quantity > minimumQuantity
          ? authData.plan.quantity
          : minimumQuantity
        : minimumQuantity

    useEffect(() => {
      isMountedRef.current = true

      return () => {
        isMountedRef.current = false
      }
    }, [])

    useEffect(() => {
      if (!isMountedRef.current) return
      if (quantity !== _quantity) setQuantity(quantity)
    }, [_quantity, quantity])

    useEffect(() => {
      setUsersStr(
        (authData &&
          authData.plan &&
          authData.plan.users &&
          authData.plan.users
            .map(str => `${str || ''}`.replace(/[\s]/g, ''))
            .filter(Boolean)
            .join(', ')) ||
          '',
      )
    }, [
      authData &&
        authData.plan &&
        authData.plan.users &&
        authData.plan.users.join(', '),
    ])

    function canSubmit() {
      return !!(
        isCardFilled ||
        (!needsToFillTheCard &&
          ((action !== 'update_seats' && !isMyPlan) ||
            ((action === 'update_seats' || isMyPlan) &&
              (quantity !== (authData.plan && authData.plan.quantity) ||
                users.join(', ') !==
                  (authData.plan &&
                    authData.plan.users &&
                    authData.plan.users.join(', '))))))
      )
    }

    async function handleSubmit() {
      if (!canSubmit()) return

      let cardToken
      try {
        setFormState({ error: undefined, isSubmiting: true })
        const { error, token } =
          stripe && isCardFilled
            ? await stripe.createToken()
            : { error: undefined, token: undefined }

        if (!isMountedRef.current) return

        if (error) {
          console.error(error)
          setFormState({
            error: `Failed to create Stripe card token: ${error.message}`,
            isSubmiting: false,
          })
          return false
        }

        if (!token && needsToFillTheCard) {
          setFormState({
            error: !isCardFilled
              ? 'Please fill the credit card information.'
              : 'Failed to create Stripe card token. No token received.',
            isSubmiting: false,
          })
          return false
        }

        if (token) cardToken = token.id
      } catch (error) {
        console.error(error)
        setFormState({
          error: `Failed to create Stripe card token. Error: ${error.message}`,
          isSubmiting: false,
        })
        return false
      }

      try {
        const response = await fetch(constants.GRAPHQL_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify({
            query: `
              mutation($input: PlanSubscriptionInput) {
                subscribeToPlan(input: $input) {
                  id
                  source
                  type

                  amount
                  currency
                  trialPeriodDays
                  interval
                  intervalCount
                  label
                  transformUsage {
                    divideBy
                    round
                  }
                  quantity

                  status

                  startAt
                  cancelAt
                  cancelAtPeriodEnd

                  trialStartAt
                  trialEndAt

                  currentPeriodStartAt
                  currentPeriodEndAt

                  last4
                  reason
                  users

                  featureFlags {
                    columnsLimit
                    enableFilters
                    enableSync
                    enablePrivateRepositories
                    enablePushNotifications
                  }

                  createdAt
                  updatedAt
                }
              }`,
            variables: {
              input: {
                planId: plan.id,
                cardToken,
                quantity,
                users,
              },
            },
          }),
          headers: {
            ...getDefaultDevHubHeaders({ appToken: authData.appToken }),
            'Content-Type': 'application/json',
          },
        })

        if (!isMountedRef.current) return

        if (response.status === 401) {
          setFormState({
            error: 'Please login again.',
            isSubmiting: false,
          })

          logout()
          return false
        }

        const { data, errors } = (await response.json()) as {
          data: { subscribeToPlan: UserPlan | null } | null
          errors: any[] | null
        }

        if (!(data && data.subscribeToPlan) || (errors && errors[0])) {
          throw new Error(
            (errors && errors[0] && errors[0].message) ||
              'Something went wrong',
          )
        }

        setFormState({
          error: undefined,
          isSubmiting: false,
        })

        mergeAuthData({ plan: data.subscribeToPlan })

        if (
          !isPlanStatusValid(data.subscribeToPlan) ||
          data.subscribeToPlan.status === 'incomplete'
        ) {
          throw new Error('Please try a different credit card.')
        }

        if (onSuccess) onSuccess()
        return true
      } catch (error) {
        console.error(error)
        setFormState({
          error:
            `Failed to execute payment. ${error.message}` +
            "\n\nAlso, please note we currently don't support Amex, Elo or Debit cards.",
          isSubmiting: false,
        })
        return false
      }
    }

    const isMyPlan = !!(authData.plan && authData.plan.id === plan.id)

    return (
      <form
        className="flex flex-col items-center w-full md:w-2/3 lg:w-150 m-auto"
        onSubmit={e => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        {plan.type === 'team' && (!action || action === 'update_seats') && (
          <>
            <p className="mb-4 font-bold text-5xl select-none">
              <span
                className={classNames(
                  'px-4 select-none',
                  quantity && quantity > minimumQuantity
                    ? 'text-default cursor-pointer'
                    : 'text-muted-25',
                )}
                onClick={
                  quantity && quantity > minimumQuantity
                    ? () =>
                        setQuantity(q =>
                          Math.max(
                            minimumQuantity,
                            (q || quantity) - quantityStep,
                          ),
                        )
                    : undefined
                }
              >
                ▼
              </span>
              <span className="text-default select-none">
                {quantity === 0 || quantity > 1
                  ? `${quantity} seats`
                  : '1 seat'}
              </span>
              <span
                className="px-4 text-default cursor-pointer select-none"
                onClick={() => setQuantity(q => (q || quantity) + quantityStep)}
              >
                ▲
              </span>
            </p>

            {authData.plan &&
              authData.plan.quantity &&
              authData.plan.quantity > 1 && (
                <>
                  <TextInput
                    className="mb-2 w-full text-center"
                    placeholder="GitHub usernames, e.g.: brunolemos, gaearon, mxstbr"
                    value={usersStr || ''}
                    onChange={e => {
                      setUsersStr(`${e.target.value || ''}`)
                    }}
                    onBlur={e => {
                      setUsersStr(users.join(', '))
                    }}
                  />

                  {
                    <div className="flex flex-row items-center justify-center">
                      {users.length ? (
                        users.map(username => (
                          <a
                            key={username}
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
                        ))
                      ) : (
                        <p className="w-6 h-6 m-1" />
                      )}
                    </div>
                  }

                  {!(authData.plan.users && authData.plan.users.length) && (
                    <p className="mb-6 text-sm text-muted-65 italic">
                      These people will gain access to DevHub via this
                      subscription. You can change this anytime.
                    </p>
                  )}

                  <p className="mb-2" />
                </>
              )}

            <p className="mb-4" />
          </>
        )}

        {!needsToFillTheCard && (
          <Tabs<NonNullable<typeof creditCardTab>>
            className="mb-4"
            onTabChange={tab => setCreditCardTab(tab)}
          >
            <Tabs.Tab
              active={creditCardTab === 'current'}
              id="current"
              title={`Same credit card${
                authData.plan && authData.plan.last4
                  ? ` (${authData.plan.last4})`
                  : ''
              }`}
            />
            <Tabs.Tab
              active={creditCardTab === 'change'}
              id="change"
              title="Change credit card"
            />
          </Tabs>
        )}

        {!!(needsToFillTheCard || creditCardTab === 'change') && (
          <>
            {!needsToFillTheCard && <p className="mb-4" />}

            <div
              className={`self-stretch mb-4 bg-more-3 border rounded-full overflow-hidden${
                isFocused
                  ? ' shadow-md border-primary'
                  : ' border-bg-less-3 shadow'
              }`}
              style={{ minHeight: 51 }}
            >
              <CardElement
                className="self-stretch py-4 px-4"
                onBlur={() => setIsFocused(false)}
                onChange={e => {
                  if (e.complete !== isCardFilled) setIsCardFilled(e.complete)
                }}
                onFocus={() => setIsFocused(true)}
                style={{
                  base: {
                    color: theme.foregroundColor,
                    '::placeholder': {
                      color: theme.foregroundColorMuted65,
                    },
                    iconColor: theme.foregroundColor,
                  },
                  invalid: {
                    color: theme.red,
                    iconColor: theme.red,
                  },
                }}
              />
            </div>

            <p className="mb-4 text-sm text-muted-65 italic">
              🔒 Payment secured by{' '}
              <a href="https://stripe.com/" target="_blank" rel="noopener">
                Stripe
              </a>
              {process.env.STRIPE_PUBLIC_KEY!.startsWith('pk_test') && (
                <span className="text-red"> (test mode)</span>
              )}
            </p>
          </>
        )}

        <p className="mb-8" />

        <Button
          type="primary"
          className="mb-4"
          disabled={!canSubmit()}
          loading={formState.isSubmiting}
          onClick={e => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          {action === 'update_card' &&
          authData.plan &&
          authData.plan.id === plan.id &&
          plan.amount === authData.plan.amount &&
          authData.plan.quantity === quantity
            ? 'Update credit card'
            : `${
                plan.interval ? 'Subscribe' : 'Purchase'
              } for ${formatPriceAndInterval(plan.amount, plan, { quantity })}`}
        </Button>

        {!!(
          plan.amount &&
          !plan.trialPeriodDays &&
          (!(authData.plan && authData.plan.amount) ||
            (authData.plan.amount && plan.amount > authData.plan.amount))
        ) && (
          <p className="mb-4 text-xs text-muted-65">
            {authData.plan && authData.plan.amount
              ? 'Your card will be charged any difference immediately.'
              : 'Your card will be charged immediately.'}
          </p>
        )}

        {!!formState.error && (
          <p className="mb-4 text-sm text-red italic">{formState.error}</p>
        )}

        {children}
      </form>
    )
  },
)
