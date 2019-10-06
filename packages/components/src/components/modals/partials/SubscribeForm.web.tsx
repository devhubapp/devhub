import {
  activePlans,
  constants,
  formatPrice,
  getDefaultUserPlan,
} from '@devhub/core'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import { CardElement, injectStripe } from 'react-stripe-elements'

import { useReduxState } from '../../../hooks/use-redux-state'
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

    useEffect(() => {
      isMountedRef.current = true

      return () => {
        isMountedRef.current = false
      }
    }, [])

    async function handleSubmit() {
      if (plan && plan.amount) subscribeToPlan()
      else if (plan && !plan.amount) downgradeToFreePlan()
    }

    async function downgradeToFreePlan() {
      if (!(plan && plan.id && !plan.amount && reason)) return

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
            plan: getDefaultUserPlan(new Date().toISOString()),
          }),
        )
        if (onSubscribe) onSubscribe(plan.id)

        return true
      } catch (error) {
        console.error(error)
        setFormState({
          error: `Failed to cancel subscription. Please contact support. \nError: ${error.message}`,
          isSubmiting: false,
        })
        return false
      }
    }

    async function subscribeToPlan() {
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
        const response = await axios.post(
          constants.GRAPHQL_ENDPOINT,
          {
            query: `
              mutation($input: PlanSubscriptionInput) {
                subscribeToPlan(input: $input) {
                  id
                  source

                  amount
                  currency
                  trialPeriodDays
                  interval
                  intervalCount

                  status

                  startAt
                  cancelAt
                  cancelAtPeriodEnd

                  trialStartAt
                  trialEndAt

                  currentPeriodStartAt
                  currentPeriodEndAt

                  reason

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

        dispatch(actions.updateUserData({ plan: data.subscribeToPlan }))

        if (onSubscribe) onSubscribe(plan.id)
        return true
      } catch (error) {
        console.error(error)
        setFormState({
          error: `Failed to execute payment. ${error.message}`,
          isSubmiting: false,
        })
        return false
      }
    }

    const plan = planId && activePlans.find(p => p.id === planId)
    if (!(plan && plan.id)) return null

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
            <SubHeader title="Downgrade reason" />

            <View
              style={[sharedStyles.fullWidth, sharedStyles.paddingHorizontal]}
            >
              <ThemedTextInput
                editable={!formState.isSubmiting}
                multiline
                onChangeText={value => setReason(value)}
                placeholder="Let us know the reason you are downgrading so we can improve DevHub."
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

              {!!(!plan.amount && userPlansToKeepUsing) && (
                <>
                  <ThemedText color="foregroundColorMuted65">
                    DevHub is made by a single person working on it full time.
                    It needs to be a sustainable project to exist.
                    {'\n\n'}
                    If you want DevHub to keep existing and being updated,
                    consider supporting it with a paid plan.
                  </ThemedText>

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
            analyticsLabel={plan.cannonicalId}
            disabled={
              formState.isSubmiting ||
              (plan.amount
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
                ? `${
                    userPlan && userPlan.amount && userPlan.amount < plan.amount
                      ? 'Upgrade to'
                      : userPlan && userPlan.amount > plan.amount
                      ? 'Downgrade to'
                      : 'Unlock for'
                  } ${formatPrice(plan.amount, plan.currency)}/${plan.interval}`
                : userPlan && userPlan.amount > 0
                ? 'Confirm downgrade to free plan'
                : 'Unlock features'
              : 'Select a plan'}
          </Button>

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
