import {
  constants,
  isPlanStatusValid,
  Plan,
  UserPlan,
} from '@brunolemos/devhub-core'
import classNames from 'classnames'
import _ from 'lodash'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, { useEffect, useState } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'

import { useAuth } from '../../../context/AuthContext'
import { usePaddleLoader } from '../../../context/PaddleLoaderContext'
import { useTheme } from '../../../context/ThemeContext'
import { getDefaultDevHubHeaders } from '../../../helpers'
import { useDynamicRef } from '../../../hooks/use-dynamic-ref'
import { useFormattedPlanPrice } from '../../../hooks/use-formatted-plan-price'
import { useIsMountedRef } from '../../../hooks/use-is-mounted-ref'
import { useSystem } from '../../../hooks/use-system'
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

    const Router = useRouter()
    const { Paddle } = usePaddleLoader()

    const isMountedRef = useIsMountedRef()

    const { theme } = useTheme()
    const { authData, logout, mergeAuthData } = useAuth()
    const { os } = useSystem()

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
      (plan.interval &&
        authData &&
        authData.plan &&
        authData.plan.interval &&
        authData.plan.users &&
        authData.plan.users
          .map(str => `${str || ''}`.replace(/[\s]/g, ''))
          .filter(Boolean)
          .join(', ')) ||
        '',
    )
    const [_showQuantityForm, setShowQuantityForm] = useState(false)

    const forceShowQuantityForm = !!(
      plan.type === 'team' ||
      (plan.transformUsage && plan.transformUsage.divideBy > 1) ||
      action === 'update_seats'
    )
    const showQuantityForm = !!(_showQuantityForm || forceShowQuantityForm)

    const users = _.uniq(
      (
        usersStr ||
        (authData.plan && authData.plan.amount && !authData.plan.interval
          ? ''
          : authData.github.login) ||
        ''
      )
        .split(',')
        .map(str => `${str || ''}`.replace(/[\s]/g, ''))
        .filter(Boolean),
    )

    const needsToFillTheCard =
      (action === 'update_card' ||
        !(
          authData.plan &&
          authData.plan.amount &&
          isPlanStatusValid(authData.plan)
        )) &&
      plan.stripeIds.length

    const [creditCardTab, setCreditCardTab] = useState<'current' | 'change'>(
      !needsToFillTheCard ? 'current' : 'change',
    )

    const quantityStep =
      plan.transformUsage && plan.transformUsage.divideBy > 1
        ? plan.transformUsage.divideBy
        : 1

    const [_quantity, setQuantity] = useState<UserPlan['quantity']>(undefined)

    const minimumQuantity = showQuantityForm
      ? Math.max(
          quantityStep > 1 ? quantityStep : 1,
          Math.ceil(users.length / quantityStep) * quantityStep,
        )
      : 1
    const quantity = showQuantityForm
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
      if (!isMountedRef.current) return
      if (quantity !== _quantity) setQuantity(quantity)
    }, [_quantity, quantity])

    useEffect(() => {
      if (!plan.interval) return
      if (!(authData && authData.plan && authData.plan.interval)) return

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
      !!plan.interval,
      !!(authData && authData.plan && authData.plan.interval),
      authData &&
        authData.plan &&
        authData.plan.users &&
        authData.plan.users.join(', '),
    ])

    const autostart = 'autostart' in Router.query
    useEffect(() => {
      if (!autostart || !(authData && authData.appToken)) return
      if (plan.paddleProductId && !Paddle) return

      Router.replace(
        `${Router.pathname}${qs.stringify(
          { ...Router.query, autostart: undefined },
          { addQueryPrefix: true },
        )}`,
      )

      if (!plan.paddleProductId) return

      handleSubmitRef.current()
    }, [
      autostart,
      authData && authData.appToken,
      !!plan.paddleProductId,
      !!Paddle,
    ])

    const priceLabelForQuantity = useFormattedPlanPrice(plan.amount, plan, {
      quantity,
    })

    const canSubmitRef = useDynamicRef(() => {
      return !!(
        (isCardFilled ||
          (!needsToFillTheCard &&
            ((action !== 'update_seats' && !isMyPlan) ||
              ((action === 'update_seats' || isMyPlan) &&
                (quantity !== (authData.plan && authData.plan.quantity) ||
                  users.join(', ') !==
                    (authData.plan &&
                      authData.plan.users &&
                      authData.plan.users.join(', '))))))) &&
        !(!plan.interval && showQuantityForm && quantity !== users.length)
      )
    })

    const subscribeToStripePlanRef = useDynamicRef(async () => {
      if (!canSubmitRef.current()) return

      if (!stripe) throw new Error('Stripe not initialized.')
      if (!(plan.stripeIds && plan.stripeIds.length))
        throw new Error('Not a Stripe product.')

      let cardToken
      try {
        setFormState({ error: undefined, isSubmiting: true })
        const { error, token } = isCardFilled
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
                subscribeToStripePlan(input: $input) {
                  id
                  source
                  type

                  stripeIds
                  paddleProductId

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
                users: showQuantityForm ? users : [],
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
          data: { subscribeToStripePlan: UserPlan | null } | null
          errors: any[] | null
        }

        if (!(data && data.subscribeToStripePlan) || (errors && errors[0])) {
          throw new Error(
            (errors && errors[0] && errors[0].message) ||
              'Something went wrong',
          )
        }

        setFormState({
          error: undefined,
          isSubmiting: false,
        })

        mergeAuthData({ plan: data.subscribeToStripePlan })

        if (
          !isPlanStatusValid(data.subscribeToStripePlan) ||
          data.subscribeToStripePlan.status === 'incomplete'
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
    })

    const purchaseViaPaddleRef = useDynamicRef(async () => {
      if (!Paddle) {
        setFormState({
          error:
            'Paddle not loaded yet. Please try again or contact support if it persists.',
          isSubmiting: false,
        })
        return
      }

      let result: {
        checkout?: {
          created_at: string
          completed: boolean
          id: string
          coupon?: {
            coupon_code: string
          } | null
          passthrough: string | null
          prices: {
            customer: {
              currency: string
              unit: string
              unit_tax: string
              total: string
              total_tax: string
            }
            vendor: {
              currency: string
              unit: string
              unit_tax: string
              total: string
              total_tax: string
            }
          }
          redirect_url: string | null
          test_variant: string
        }
        product?: {
          quantity: number
          id: number
          name: string
        }
        user?: {
          id: string
          email: string
          country: string
        }
      }

      const passthrough = {
        _id: authData._id,
        github: authData.github,
        plan,
        planId: plan.id,
        platformRealOS: os,
        reason: undefined,
        users,
      }

      try {
        result = await new Promise((resolve, reject) => {
          Paddle.Checkout.open({
            allowQuantity: false,
            closeCallback: () => {
              reject(new Error('Cancelled'))
            },
            email:
              (authData.paddle && authData.paddle.email) ||
              authData.github.email,
            message: plan.description,
            passthrough: JSON.stringify(passthrough),
            product: plan.paddleProductId,
            successCallback: (data: typeof result, err: any) => {
              if (err || !(data && data.checkout && data.checkout.completed)) {
                reject(new Error(`${err || ''}` || 'Paddle payment failed.'))
                return
              }

              resolve(data)
            },
            quantity,
          })
        })
      } catch (error) {
        console.error(error)

        setFormState({
          error: error.message === 'Cancelled' ? '' : `${error || ''}`,
          isSubmiting: false,
        })

        return
      }

      if (result && result.checkout && result.checkout.completed) {
        setFormState({
          error: undefined,
          isSubmiting: false,
        })

        // optimistic update. the real change will occur on server via paddle webhook
        mergeAuthData({
          plan: {
            id: plan.id,
            source: 'paddle',
            type: plan.type || 'individual',

            amount: plan.amount || 0,
            currency: result.checkout.prices.customer.currency,
            trialPeriodDays: 0,
            interval: undefined,
            intervalCount: 1,
            label: plan.label,
            quantity:
              Number(result.product && result.product.quantity) || undefined,
            transformUsage: undefined,
            coupon:
              (result.checkout.coupon && result.checkout.coupon.coupon_code) ||
              undefined,

            status: 'active',

            startAt: new Date().toISOString(),
            cancelAt: undefined,
            cancelAtPeriodEnd: false,

            trialStartAt: undefined,
            trialEndAt: undefined,

            currentPeriodStartAt: new Date().toISOString(),
            currentPeriodEndAt: undefined,

            last4: undefined,
            reason: passthrough.reason,
            userPlansToKeepUsing: undefined,
            users,

            featureFlags: plan.featureFlags,
            banner: plan.banner,

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        })

        if (onSuccess) onSuccess()
      } else {
        setFormState({
          error:
            'Something went wrong. Refresh the page and contact support if the error persists.',
          isSubmiting: false,
        })
      }

      return result
    })

    const handleSubmitRef = useDynamicRef(async () => {
      if (plan.stripeIds && plan.stripeIds.length) {
        subscribeToStripePlanRef.current()
      } else if (plan.paddleProductId) {
        purchaseViaPaddleRef.current()
      } else {
        setFormState({
          error: `Product doesn't have neither Stripe not Paddle ids. Please contact support. (${plan.id})`,
          isSubmiting: false,
        })
      }
    })

    const isMyPlan = !!(authData.plan && authData.plan.id === plan.id)

    return (
      <form
        className="flex flex-col items-center w-full md:w-2/3 lg:w-150 m-auto"
        onSubmit={e => {
          e.preventDefault()
          handleSubmitRef.current()
        }}
      >
        {!!(
          !forceShowQuantityForm &&
          (showQuantityForm || (!plan.interval && plan.paddleProductId))
        ) && (
          <Tabs
            className="mb-2"
            onTabChange={value => {
              setShowQuantityForm(value === 'team')
            }}
          >
            <Tabs.Tab
              id="individual"
              title="Only for me"
              active={!showQuantityForm}
            />
            <Tabs.Tab
              id="team"
              title="For more people"
              active={showQuantityForm}
            />
          </Tabs>
        )}

        {!!(showQuantityForm && (!action || action === 'update_seats')) && (
          <>
            <p className="mb-4 font-bold text-3xl md:text-5xl select-none">
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
                style={{ touchAction: 'manipulation' }}
              >
                ▼
              </span>
              <span className="text-default select-none">
                {quantity === 0 || quantity > 1
                  ? `${quantity} people`
                  : '1 person'}
              </span>
              <span
                className="px-4 text-default cursor-pointer select-none"
                onClick={() => setQuantity(q => (q || quantity) + quantityStep)}
                style={{ touchAction: 'manipulation' }}
              >
                ▲
              </span>
            </p>

            {(showQuantityForm ||
              (authData.plan &&
                authData.plan.quantity &&
                authData.plan.quantity > 1)) && (
              <>
                <TextInput
                  className="mb-2 w-full text-center"
                  placeholder={`GitHub usernames (e.g.: ${_.uniq([
                    authData.github.login,
                    'brunolemos',
                    'gaearon',
                    'thekitze',
                  ])
                    .filter(Boolean)
                    .slice(0, 3)
                    .join(', ')})`}
                  value={usersStr || ''}
                  onChange={e => {
                    setUsersStr(`${e.target.value || ''}`)
                  }}
                  onBlur={() => {
                    setUsersStr(_usersStr =>
                      (_usersStr || '')
                        .split(',')
                        .map(str => `${str || ''}`.replace(/[\s]/g, ''))
                        .filter(Boolean)
                        .join(', '),
                    )
                  }}
                />

                {!!(users && (users.length > 1 || showQuantityForm)) && (
                  <>
                    <div className="flex flex-row flex-wrap items-center justify-center">
                      {users.map(username => (
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
                      ))}

                      {!!(quantity - users.length >= 1) &&
                        new Array(quantity - users.length)
                          .fill(undefined)
                          .map((_placeholder, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 m-1 bg-less-1 rounded-full"
                            />
                          ))}
                    </div>

                    <p className="mb-6 text-xs text-muted-65 italic whitespace-pre-line">
                      {plan.interval
                        ? 'These people will gain access to DevHub via this subscription. You can change this anytime.'
                        : 'These people will gain access to DevHub. \n' +
                          'You can buy for your friends, followers or teammates, for example.'}
                    </p>
                  </>
                )}

                <p className="mb-2" />
              </>
            )}
          </>
        )}

        <p className="mb-4" />

        {!needsToFillTheCard && !!plan.stripeIds.length && (
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

        {!!(needsToFillTheCard || creditCardTab === 'change') &&
          !!plan.stripeIds.length && (
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

              <p className="mb-4" />
            </>
          )}

        <p className="mb-4" />

        <Button
          type="primary"
          className="mb-4"
          disabled={!canSubmitRef.current()}
          loading={formState.isSubmiting}
          onClick={e => {
            e.preventDefault()
            handleSubmitRef.current()
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
              } for ${priceLabelForQuantity}`}
        </Button>

        {!!(
          plan.amount &&
          !plan.trialPeriodDays &&
          (!(authData.plan && authData.plan.amount) ||
            (authData.plan.amount && plan.amount > authData.plan.amount))
        ) && (
          <p className="mb-4 text-xs text-muted-65 whitespace-pre-line">
            {[
              // !plan.interval && 'You are purchasing a lifetime license.',
              // !plan.interval && 'Free upgrades from v0.x to v1.9.',
              authData.plan &&
              authData.plan.amount &&
              authData.plan.stripeIds &&
              authData.plan.stripeIds.length &&
              plan.stripeIds.length
                ? 'Your card will be charged any difference immediately.'
                : `Your card will be charged immediately${
                    plan.trialPeriodDays ? '' : ' (this plan has no free trial)'
                  }.`,
              !plan.stripeIds.length &&
                plan.paddleProductId &&
                plan.description,
            ].join('\n')}
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
