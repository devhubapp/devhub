import { activePlans, formatPrice, PlanID } from '@devhub/core'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { ModalColumn } from '../columns/ModalColumn'
import { Button } from '../common/Button'
import { FullHeightScrollView } from '../common/FullHeightScrollView'
import { H3 } from '../common/H3'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { useAppLayout } from '../context/LayoutContext'
import { ThemedText } from '../themed/ThemedText'
import { SubscribeForm } from './partials/SubscribeForm'

export interface SubscribeModalProps {
  planId: PlanID | undefined
  showBackButton: boolean
}

export function SubscribeModal(props: SubscribeModalProps) {
  const { planId, showBackButton } = props

  const dispatch = useDispatch()
  const { sizename } = useAppLayout()
  const userPlan = useReduxState(selectors.currentUserPlanSelector)

  const plan =
    (planId && activePlans.find(p => p.id === planId)) ||
    activePlans.find(p => p.amount > 0)

  const trialDays = (plan && plan.trialPeriodDays) || 0

  useEffect(() => {
    if (!(plan && plan.id)) {
      dispatch(actions.popModal())
    }
  }, [plan && plan.id])

  return (
    <ModalColumn
      name="SUBSCRIBE"
      showBackButton={showBackButton}
      title="Unlock features"
    >
      <FullHeightScrollView style={sharedStyles.flex}>
        {plan && plan.id ? (
          <>
            <SubHeader title="Review your plan" />

            <View
              style={[sharedStyles.fullWidth, sharedStyles.paddingHorizontal]}
            >
              <View
                style={[
                  sharedStyles.fullWidth,
                  sharedStyles.horizontal,
                  sharedStyles.justifyContentSpaceBetween,
                ]}
              >
                <H3 children="Plan" />
                <ThemedText color="foregroundColor">
                  {`${(plan && plan.label) || 'None'}`.toUpperCase()}
                </ThemedText>
              </View>

              <Spacer height={contentPadding} />

              <View
                style={[
                  sharedStyles.fullWidth,
                  sharedStyles.horizontal,
                  sharedStyles.justifyContentSpaceBetween,
                ]}
              >
                <H3 children="Currency" />
                <ThemedText color="foregroundColor">
                  {(plan.currency || 'USD').toUpperCase()}
                </ThemedText>
              </View>

              <Spacer height={contentPadding} />

              <View
                style={[
                  sharedStyles.fullWidth,
                  sharedStyles.horizontal,
                  sharedStyles.justifyContentSpaceBetween,
                ]}
              >
                <H3 children="Free trial" />
                <ThemedText color="foregroundColor">
                  {(trialDays === 1
                    ? '1 day'
                    : trialDays > 1
                    ? `${trialDays} days`
                    : 'No'
                  ).toUpperCase()}
                </ThemedText>
              </View>

              <Spacer height={contentPadding} />

              <View
                style={[
                  sharedStyles.fullWidth,
                  sharedStyles.horizontal,
                  sharedStyles.justifyContentSpaceBetween,
                ]}
              >
                <H3 children="Cancellation policy" />
                <ThemedText color="foregroundColor">
                  {'Cancel anytime'.toUpperCase()}
                </ThemedText>
              </View>
            </View>

            {Platform.OS === 'web' && (
              <>
                <Spacer height={contentPadding * 2} />
                <SubscribeForm planId={plan && plan.id} />
              </>
            )}

            {sizename <= '2-medium' ? (
              <Spacer flex={1} minHeight={contentPadding * 2} />
            ) : (
              <Spacer height={contentPadding * 2} />
            )}

            <View
              style={[sharedStyles.fullWidth, sharedStyles.paddingHorizontal]}
            >
              <Button
                analyticsCategory="subscribe"
                analyticsAction="subscribe"
                analyticsLabel="subscribe"
                // disabled={!plan || plan.id === (userPlan && userPlan.id)}
                onPress={() => {
                  alert('TODO')
                }}
                type="primary"
              >
                {plan
                  ? plan.amount > 0
                    ? `Unlock for ${formatPrice(plan.amount, plan.currency)}/${
                        plan.interval
                      }`
                    : userPlan && userPlan.amount > 0
                    ? 'Downgrade to free plan'
                    : 'Unlock features'
                  : 'Select a plan'}
              </Button>
            </View>
          </>
        ) : (
          <View
            style={[sharedStyles.fullWidth, sharedStyles.paddingHorizontal]}
          >
            {sizename <= '2-medium' ? (
              <Spacer flex={1} minHeight={contentPadding * 2} />
            ) : (
              <Spacer height={contentPadding * 2} />
            )}

            <Button
              onPress={() => {
                dispatch(actions.popModal())
              }}
              type="primary"
            >
              Go back
            </Button>
          </View>
        )}

        <Spacer height={contentPadding} />
      </FullHeightScrollView>
    </ModalColumn>
  )
}
