import {
  constants,
  formatPriceAndInterval,
  isPlanStatusValid,
  UserPlan,
} from '@devhub/core'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import { CardElement, injectStripe } from 'react-stripe-elements'

import { useReduxState } from '../../../hooks/use-redux-state'
import { bugsnag } from '../../../libs/bugsnag'
import * as actions from '../../../redux/actions'
import * as selectors from '../../../redux/selectors'
import { sharedStyles } from '../../../styles/shared'
import { contentPadding, smallTextSize } from '../../../styles/variables'
import { getDefaultDevHubHeaders } from '../../../utils/api'
import { Button } from '../../common/Button'
import { Checkbox } from '../../common/Checkbox'
import { Spacer } from '../../common/Spacer'
import { STRIPE_PUBLIC_KEY } from '../../common/StripeLoader.shared'
import { StripeLoader } from '../../common/StripeLoader.web'
import { SubHeader } from '../../common/SubHeader'
import { defaultTextInputHeight } from '../../common/TextInput'
import { useAppLayout } from '../../context/LayoutContext'
import { usePlans } from '../../context/PlansContext'
import { useTheme } from '../../context/ThemeContext'
import { ThemedText } from '../../themed/ThemedText'
import { ThemedTextInput } from '../../themed/ThemedTextInput'
import { ThemedView } from '../../themed/ThemedView'
import { SubscribeFormProps } from './SubscribeForm.shared'

const poweredByStripeDarkBanner = require('@devhub/web/public/static/media/stripe/powered_by_stripe_outline_dark.png') // tslint:disable-line no-var-requires
const poweredByStripeLightBanner = require('@devhub/web/public/static/media/stripe/powered_by_stripe_outline_light.png') // tslint:disable-line no-var-requires
const poweredByStripeBannerAspectRatio = 357 / 78

const SubscribeFormWithStripe = React.memo(
  injectStripe<SubscribeFormProps>(props => {
    const { onSubscribe, planId, stripe } = props

    const { sizename } = useAppLayout()
    const theme = useTheme()
    const dispatch = useDispatch()
    const appToken = useReduxState(selectors.appTokenSelector)
    const userPlan = useReduxState(selectors.currentUserPlanSelector)
    const { plans, freePlan } = usePlans()

    const isMountedRef = useRef(true)
    const [userPlansToKeepUsing, setUserPlansToKeepUsing] = useState(false)
    const [reason, setReason] = useState('')

    const [isCardFocused, setIsCardFocused] = useState(false)
    const [isCardFilled, setIsCardFilled] = useState(false)
    const [formState, setFormState] = useState<{
      error: string | undefined
      isSubmiting: boolean
    }>({
      error: undefined,
      isSubmiting: false,
    })

    const quantity = 1 // TODO

    useEffect(() => {
      isMountedRef.current = true

      return () => {
        isMountedRef.current = false
      }
    }, [])

    async function handleSubmit() {
      if (plan && plan.amount) subscribeToStripePlan()
      else if (!(plan && plan.amount)) cancelSubscription()
    }

    async function cancelSubscription() {
      if (!(!(plan && plan.amount) && reason)) return

      try {
        setFormState({ error: undefined, isSubmiting: true })

        const response = await axios.post(
          constants.GRAPHQL_ENDPOINT,
          {
            query: `
              mutation($input: CancelSubscriptionInput) {
                cancelSubscription(input: $input)
              }`,
            variables: {
              input: {
                reason,
                userPlansToKeepUsing,
              },
            },
          },
          { headers: getDefaultDevHubHeaders({ appToken }) },
        )

        if (!isMountedRef.current) return

        const { data, errors } = await response.data

        if (errors && errors[0] && errors[0].message)
          throw new Error(errors[0].message)

        if (!(data && data.cancelSubscription)) {
          throw new Error('Not cancelled.')
        }

        setFormState({
          error: undefined,
          isSubmiting: false,
        })

        dispatch(
          actions.updateUserData({
            plan: {
              ...userPlan!,
              cancelAt: userPlan && userPlan.currentPeriodEndAt,
              cancelAtPeriodEnd: true,
            },
          }),
        )
        if (onSubscribe) onSubscribe(plan && plan.id)

        return true
      } catch (error) {
        console.error(error)
        bugsnag.notify(error)

        setFormState({
          error: `Failed to cancel subscription. Please contact support. \nError: ${error.message}`,
          isSubmiting: false,
        })
        return false
      }
    }

    async function subscribeToStripePlan() {
      if (!(plan && plan.id && isCardFilled && stripe)) return

      let cardToken
      try {
        setFormState({ error: undefined, isSubmiting: true })
        const { error, token } = await stripe.createToken()

        if (!isMountedRef.current) return

        if (error) {
          console.error(error)
          setFormState({
            error: `Failed to create Stripe card token: ${error.message}`,
            isSubmiting: false,
          })
          return false
        }

        if (!token) {
          setFormState({
            error: 'Failed to create Stripe card token. No token received.',
            isSubmiting: false,
          })
          return false
        }

        cardToken = token.id
      } catch (error) {
        console.error(error)
        setFormState({
          error: `Failed to create Stripe card token. Error: ${error.message}`,
          isSubmiting: false,
        })
        return false
      }

      try {
        const response = await axios.post<{
          data: { subscribeToStripePlan: UserPlan | null } | null
          errors: any[] | null
        }>(
          constants.GRAPHQL_ENDPOINT,
          {
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
                reason,
                quantity,
              },
            },
          },
          { headers: getDefaultDevHubHeaders({ appToken }) },
        )

        if (!isMountedRef.current) return

        if (response.status === 401) {
          setFormState({
            error: 'Please login again.',
            isSubmiting: false,
          })

          dispatch(actions.logout())
          return false
        }

        const { data, errors } = response.data || {}

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

        dispatch(actions.updateUserData({ plan: data.subscribeToStripePlan }))

        if (
          !isPlanStatusValid(data.subscribeToStripePlan) &&
          data.subscribeToStripePlan.status === 'incomplete'
        ) {
          throw new Error('Please try a different credit card.')
        }

        if (onSubscribe) onSubscribe(plan.id)
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

    const plan = planId && plans.find(p => p && p.id === planId)

    return (
      <form onSubmit={handleSubmit}>
        {!!(plan && plan.amount) ? (
          <>
            <SubHeader title="Card">
              {STRIPE_PUBLIC_KEY.startsWith('pk_test') && (
                <ThemedText color="red"> (test mode)</ThemedText>
              )}

              <Spacer flex={1} minWidth={contentPadding} />

              <a
                href="https://stripe.com/"
                target="_blank"
                rel="noopener"
                style={{
                  width: 18 * poweredByStripeBannerAspectRatio,
                  height: 18,
                }}
              >
                <img
                  alt="Powered by Stripe"
                  src={
                    theme.isDark
                      ? poweredByStripeLightBanner
                      : poweredByStripeDarkBanner
                  }
                  style={{
                    width: 18 * poweredByStripeBannerAspectRatio,
                    height: 18,
                  }}
                />
              </a>
            </SubHeader>

            <View
              style={[sharedStyles.fullWidth, sharedStyles.paddingHorizontal]}
            >
              <ThemedView
                backgroundColor={
                  isCardFocused
                    ? 'backgroundColorDarker2'
                    : 'backgroundColorDarker1'
                }
                borderColor={
                  isCardFocused
                    ? 'primaryBackgroundColor'
                    : 'backgroundColorDarker1'
                }
                style={[
                  sharedStyles.center,
                  sharedStyles.fullWidth,
                  sharedStyles.paddingHorizontal,
                  sharedStyles.overflowHidden,
                  {
                    minHeight: defaultTextInputHeight,
                    borderWidth: 1,
                    borderRadius: defaultTextInputHeight / 2,
                  },
                ]}
              >
                <CardElement
                  disabled={formState.isSubmiting}
                  onBlur={() => setIsCardFocused(false)}
                  onChange={e => {
                    if (e.complete !== isCardFilled) setIsCardFilled(e.complete)
                  }}
                  onFocus={() => setIsCardFocused(true)}
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
              </ThemedView>
            </View>

            <Spacer height={contentPadding} />

            {!!isCardFilled && (
              // (!(userPlan && userPlan.amount) || !userPlan.reason)
              <>
                <SubHeader
                  title={
                    userPlan && userPlan.amount
                      ? 'Plan change reason'
                      : 'Use case'
                  }
                />

                <View
                  style={[
                    sharedStyles.fullWidth,
                    sharedStyles.paddingHorizontal,
                  ]}
                >
                  <ThemedTextInput
                    editable={!formState.isSubmiting}
                    multiline
                    onChangeText={value => setReason(value)}
                    placeholder="Let us know your main use case so we can make DevHub even better for you."
                    textInputKey="subscribe-reason-text-input"
                    value={reason}
                  />
                </View>

                <Spacer height={contentPadding} />
              </>
            )}
          </>
        ) : (
          <>
            <SubHeader
              title={freePlan ? 'Downgrade reason' : 'Cancellation reason'}
            />

            <View
              style={[sharedStyles.fullWidth, sharedStyles.paddingHorizontal]}
            >
              <ThemedTextInput
                editable={!formState.isSubmiting}
                multiline
                onChangeText={value => setReason(value)}
                placeholder={`Let us know the reason you are ${
                  freePlan && !freePlan.trialPeriodDays
                    ? 'downgrading'
                    : 'cancelling'
                } so we can improve DevHub.`}
                textInputKey="downgrade-reason-text-input"
                value={reason}
              />

              <Spacer height={contentPadding} />

              <Checkbox
                checked={userPlansToKeepUsing}
                disabled={formState.isSubmiting}
                enableIndeterminateState={false}
                label="I plan to keep using DevHub"
                onChange={value => setUserPlansToKeepUsing(!!value)}
              />

              <Spacer height={contentPadding} />

              {!!(!(plan && plan.amount) && userPlansToKeepUsing) && (
                <>
                  {freePlan && !freePlan.trialPeriodDays ? (
                    <ThemedText color="foregroundColorMuted65">
                      DevHub is made by a single person working on it full time.
                      It needs to be a sustainable project to exist.
                      {'\n\n'}
                      If you want DevHub to keep existing and being updated,
                      consider supporting it with a paid plan.
                    </ThemedText>
                  ) : (
                    <ThemedText color="foregroundColorMuted65">
                      DevHub doesn't have a free plan anymore. The only way to
                      keep using DevHub is by having a paid subscription. After
                      cancelling, you can keep using it for the already paid
                      period.
                    </ThemedText>
                  )}

                  <Spacer height={contentPadding} />
                </>
              )}
            </View>
          </>
        )}

        {sizename <= '2-medium' ? (
          <Spacer flex={1} minHeight={contentPadding} />
        ) : (
          <Spacer height={contentPadding} />
        )}

        <View style={[sharedStyles.fullWidth, sharedStyles.paddingHorizontal]}>
          <Button
            analyticsCategory="subscription"
            analyticsAction="subscribe"
            analyticsLabel={(plan && plan.cannonicalId) || 'free'}
            disabled={
              formState.isSubmiting ||
              (plan && plan.amount
                ? userPlan && userPlan.amount
                  ? !isCardFilled
                  : !isCardFilled || !reason
                : !reason)
            }
            loading={formState.isSubmiting}
            onPress={handleSubmit}
            type="primary"
          >
            {plan
              ? plan.amount > 0
                ? userPlan && userPlan.id === plan.id
                  ? userPlan.type === 'team'
                    ? 'Update plan'
                    : 'Change credit card'
                  : `${
                      userPlan &&
                      userPlan.amount &&
                      userPlan.amount < plan.amount
                        ? 'Upgrade to'
                        : userPlan && userPlan.amount > plan.amount
                        ? 'Downgrade to'
                        : 'Unlock for'
                    } ${formatPriceAndInterval(plan, {
                      quantity,
                    })}`
                : userPlan && userPlan.amount > 0
                ? 'Confirm downgrade to free plan'
                : 'Subscribe'
              : freePlan && !freePlan.trialPeriodDays
              ? 'Select a plan'
              : 'Cancel subscription'}
          </Button>

          {!!(plan && plan.amount && !plan.trialPeriodDays) &&
            (!(userPlan && userPlan.amount) ||
              (userPlan.amount && plan.amount > userPlan.amount)) && (
              <>
                <Spacer height={contentPadding} />

                <ThemedText
                  color="foregroundColorMuted65"
                  style={[sharedStyles.textCenter, { fontSize: smallTextSize }]}
                >
                  {userPlan && userPlan.amount
                    ? 'Your card will be charged any difference immediately'
                    : 'Your card will be charged immediately'}
                </ThemedText>
              </>
            )}

          <Spacer height={contentPadding} />

          {!!formState.error && (
            <>
              <ThemedText
                color="red"
                style={[
                  sharedStyles.textCenter,
                  { fontSize: smallTextSize, fontStyle: 'italic' },
                ]}
              >
                {formState.error}
              </ThemedText>
              <Spacer height={contentPadding} />
            </>
          )}
        </View>
      </form>
    )
  }),
)

SubscribeFormWithStripe.displayName = 'SubscribeFormWithStripe'

export const SubscribeForm = (props: SubscribeFormProps) => {
  return (
    <StripeLoader>
      <SubscribeFormWithStripe {...props} />
    </StripeLoader>
  )
}
