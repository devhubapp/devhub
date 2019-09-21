import { activePlans, formatPrice } from '@devhub/core'
import React, { useState } from 'react'
import { View } from 'react-native'

import { CardElement, injectStripe } from 'react-stripe-elements'
import { useReduxState } from '../../../hooks/use-redux-state'
import * as selectors from '../../../redux/selectors'
import { sharedStyles } from '../../../styles/shared'
import { contentPadding } from '../../../styles/variables'
import { Button } from '../../common/Button'
import { Checkbox } from '../../common/Checkbox'
import { Spacer } from '../../common/Spacer'
import { StripeLoader } from '../../common/StripeLoader.web'
import { SubHeader } from '../../common/SubHeader'
import { useAppLayout } from '../../context/LayoutContext'
import { useTheme } from '../../context/ThemeContext'
import { ThemedText } from '../../themed/ThemedText'
import { ThemedTextInput } from '../../themed/ThemedTextInput'
import { SubscribeFormProps } from './SubscribeForm.shared'

const SubscribeFormWithStripe = injectStripe((props: SubscribeFormProps) => {
  const { planId } = props

  const [userPlanToKeepUsing, setUserPlanToKeepUsing] = useState(false)
  const [reason, setReason] = useState('')
  const [isCardFilled, setIsCardFilled] = useState(false)

  const { sizename } = useAppLayout()
  const theme = useTheme()
  const userPlan = useReduxState(selectors.currentUserPlanSelector)

  const plan = planId && activePlans.find(p => p.id === planId)
  if (!(plan && plan.id)) return null

  return (
    <>
      {!!(plan && plan.amount) ? (
        <>
          <SubHeader title="Card" />

          <View
            style={[sharedStyles.fullWidth, sharedStyles.paddingHorizontal]}
          >
            <CardElement
              className="self-stretch py-4 px-4"
              // onBlur={() => setIsFocused(false)}
              onChange={e => {
                if (e.complete !== isCardFilled) setIsCardFilled(e.complete)
              }}
              // onFocus={() => setIsFocused(true)}
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
          </View>

          <Spacer height={contentPadding} />

          {!!(isCardFilled && !(userPlan && userPlan.amount)) && (
            <>
              <SubHeader title="Use case" />

              <View
                style={[sharedStyles.fullWidth, sharedStyles.paddingHorizontal]}
              >
                <ThemedTextInput
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
              multiline
              onChangeText={value => setReason(value)}
              placeholder="Let us know the reason you are downgrading so we can improve DevHub."
              textInputKey="downgrade-reason-text-input"
              value={reason}
            />

            <Spacer height={contentPadding} />

            <Checkbox
              checked={userPlanToKeepUsing}
              enableIndeterminateState={false}
              label="I plan to keep using DevHub"
              onChange={value => setUserPlanToKeepUsing(!!value)}
            />

            <Spacer height={contentPadding} />

            {!!(!plan.amount && userPlanToKeepUsing) && (
              <>
                <ThemedText color="foregroundColorMuted65">
                  DevHub is made by a single person working on it full time. It
                  needs to be a sustainable project to exist.
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
            plan.amount
              ? userPlan && userPlan.amount
                ? !isCardFilled
                : !isCardFilled || !reason
              : !reason
          }
          onPress={() => {
            alert('TODO')
          }}
          type="primary"
        >
          {plan
            ? plan.amount > 0
              ? `${
                  userPlan && userPlan.amount < plan.amount
                    ? 'Upgrade'
                    : userPlan && userPlan.amount > plan.amount
                    ? 'Downgrade'
                    : 'Unlock'
                } for ${formatPrice(plan.amount, plan.currency)}/${
                  plan.interval
                }`
              : userPlan && userPlan.amount > 0
              ? 'Confirm downgrade to free plan'
              : 'Unlock features'
            : 'Select a plan'}
        </Button>

        <Spacer height={contentPadding} />
      </View>
    </>
  )
})

SubscribeFormWithStripe.displayName = 'SubscribeFormWithStripe'

export const SubscribeForm = (props: SubscribeFormProps) => {
  return (
    <StripeLoader>
      <SubscribeFormWithStripe {...props} />
    </StripeLoader>
  )
}
