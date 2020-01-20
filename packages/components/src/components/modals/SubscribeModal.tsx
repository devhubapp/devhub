import { PlanID } from '@devhub/core'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { ModalColumn } from '../columns/ModalColumn'
import { H3 } from '../common/H3'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { usePlans } from '../context/PlansContext'
import { ThemedText } from '../themed/ThemedText'
import { SubscribeForm } from './partials/SubscribeForm'
import { SubscribeFormProps } from './partials/SubscribeForm.shared'

export interface SubscribeModalProps {
  planId: PlanID | undefined
  showBackButton: boolean
}

export function SubscribeModal(props: SubscribeModalProps) {
  const { planId, showBackButton } = props

  const dispatch = useDispatch()
  const userPlan = useReduxState(selectors.currentUserPlanSelector)
  const { freePlan, plans } = usePlans()

  const plan = planId && plans.find(p => p && p.id === planId)

  const trialDays = (plan && plan.trialPeriodDays) || 0

  // useEffect(() => {
  //   if (!(plan && plan.id)) {
  //     dispatch(actions.popModal())
  //   }
  // }, [plan && plan.id])

  const onSubscribeOrDowngrade = useCallback<
    NonNullable<SubscribeFormProps['onSubscribe']>
  >(_planId => {
    dispatch(
      actions.replaceModal({
        name: 'SUBSCRIBED',
        params: { planId: _planId },
      }),
    )
  }, [])

  if (!userPlan && !(plan && plan.id)) {
    return (
      <ModalColumn
        name="SUBSCRIBE"
        showBackButton={showBackButton}
        title="No plan selected"
      >
        {null}
      </ModalColumn>
    )
  }

  return (
    <ModalColumn
      name="SUBSCRIBE"
      showBackButton={showBackButton}
      title={
        userPlan && userPlan.amount
          ? plan && plan.amount > userPlan.amount
            ? 'Upgrade plan'
            : !plan || !plan.amount
            ? freePlan && !freePlan.trialPeriodDays
              ? 'Downgrade plan'
              : 'Cancel subscription'
            : plan.amount < userPlan.amount
            ? 'Downgrade plan'
            : userPlan.id === plan.id
            ? userPlan.type === 'team'
              ? 'Update plan'
              : 'Change credit card'
            : 'Change plan'
          : 'Subscribe'
      }
    >
      <>
        {!!(plan && plan.amount && !(userPlan && userPlan.id === plan.id)) && (
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
                  {`${(plan && plan.label) ||
                    (plan && plan.amount ? 'Paid' : 'None')}`.toUpperCase()}
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

              {trialDays > 0 && !(userPlan && userPlan.amount) && (
                <>
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
                </>
              )}

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

        {!!(Platform.OS === 'web') && (
          <SubscribeForm
            planId={plan && plan.id}
            onSubscribe={onSubscribeOrDowngrade}
          />
        )}
      </>
    </ModalColumn>
  )
}
