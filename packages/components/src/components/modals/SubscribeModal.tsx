import { activePlans, PlanID } from '@devhub/core'
import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { ModalColumn } from '../columns/ModalColumn'
import { FullHeightScrollView } from '../common/FullHeightScrollView'
import { H3 } from '../common/H3'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { ThemedText } from '../themed/ThemedText'
import { SubscribeForm } from './partials/SubscribeForm'

export interface SubscribeModalProps {
  planId: PlanID | undefined
  showBackButton: boolean
}

export function SubscribeModal(props: SubscribeModalProps) {
  const { planId, showBackButton } = props

  const dispatch = useDispatch()
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

  const onSubscribeOrDowngrade = useCallback(() => {
    if (!(plan && plan.id)) return
    dispatch(
      actions.replaceModal({ name: 'SUBSCRIBED', params: { planId: plan.id } }),
    )
  }, [plan && plan.id])

  if (!(plan && plan.id))
    return (
      <ModalColumn
        name="SUBSCRIBE"
        showBackButton={showBackButton}
        title="No plan selected"
      >
        {null}
      </ModalColumn>
    )

  return (
    <ModalColumn
      name="SUBSCRIBE"
      showBackButton={showBackButton}
      title={
        userPlan && userPlan.amount
          ? plan && plan.amount > userPlan.amount
            ? 'Upgrade plan'
            : plan && plan.amount < userPlan.amount
            ? 'Downgrade plan'
            : 'Change plan'
          : 'Unlock features'
      }
    >
      <FullHeightScrollView style={sharedStyles.flex}>
        {!!(plan && plan.amount) && (
          <>
            <SubHeader title="Review your choice" />

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

            <Spacer height={contentPadding} />
          </>
        )}

        {!!(Platform.OS === 'web' && plan && plan.id) && (
          <SubscribeForm
            planId={plan && plan.id}
            onSubscribe={onSubscribeOrDowngrade}
          />
        )}
      </FullHeightScrollView>
    </ModalColumn>
  )
}
