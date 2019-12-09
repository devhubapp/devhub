import { allPlans, freePlan, PlanID } from '@devhub/core'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

import { useReduxState } from '../../hooks/use-redux-state'
import { Browser } from '../../libs/browser'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding, normalTextSize } from '../../styles/variables'
import { ModalColumn } from '../columns/ModalColumn'
import { Avatar } from '../common/Avatar'
import { Button } from '../common/Button'
import { Spacer } from '../common/Spacer'
import { ThemedText } from '../themed/ThemedText'

const logo = require('@devhub/web/public/static/media/logo.png') // tslint:disable-line no-var-requires

export interface SubscribedModalProps {
  planId: PlanID | undefined
  showBackButton: boolean
}

export function SubscribedModal(props: SubscribedModalProps) {
  const { planId: _planId, showBackButton } = props

  const dispatch = useDispatch()
  const userPlan = useReduxState(selectors.currentUserPlanSelector)

  const planId = _planId || (userPlan && userPlan.id)
  const plan = planId && allPlans.find(p => p.id === planId)

  useEffect(() => {
    if (freePlan && !freePlan.trialPeriodDays && !(plan && plan.id)) {
      dispatch(actions.closeAllModals())
      return
    }

    if (Platform.isElectron) {
      window.ipc.send('play-notification-sound')
    }
  }, [plan && plan.id])

  // if (!(plan && plan.label)) return null

  return (
    <ModalColumn
      name="SUBSCRIBED"
      showBackButton={showBackButton}
      title=""
      // title={
      //   plan && plan.amount
      //     ? 'Subscribed'
      //     : (freePlan && !freePlan.trialPeriodDays)
      //     ? 'Downgraded'
      //     : 'Cancelled'
      // }
    >
      <View style={[sharedStyles.fullWidth, sharedStyles.padding]}>
        <View
          style={[
            sharedStyles.center,
            sharedStyles.fullWidth,
            sharedStyles.paddingHorizontal,
          ]}
        >
          <Avatar
            avatarUrl={logo}
            borderColor="backgroundColorLess2"
            disableLink
            shape="circle"
            size={70}
            style={{ borderWidth: 4 }}
          />
          <Spacer height={contentPadding} />
          <ThemedText
            color="foregroundColor"
            style={{
              lineHeight: 36,
              fontSize: 30,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {plan && plan.amount ? 'You are all set 🎉' : 'You are all set 👍'}
          </ThemedText>
          <Spacer height={contentPadding} />
          <ThemedText
            color="foregroundColorMuted65"
            style={{ lineHeight: 24, fontSize: 18, textAlign: 'center' }}
          >
            {plan && plan.amount ? (
              <>
                You've successfully subscribed to the{' '}
                {!!plan.label && (
                  <>
                    <ThemedText style={{ fontWeight: 'bold' }}>
                      {plan.label.toLowerCase()}
                    </ThemedText>{' '}
                  </>
                )}
                plan
                {userPlan &&
                userPlan.status &&
                !(
                  userPlan.status === 'active' || userPlan.status === 'trialing'
                ) ? (
                  <>
                    {', '}but your subscription status is{' '}
                    <ThemedText style={{ fontWeight: 'bold' }}>
                      {userPlan.status}
                    </ThemedText>
                  </>
                ) : null}
              </>
            ) : freePlan && !freePlan.trialPeriodDays && plan ? (
              <>
                You've successfully downgraded to the{' '}
                <ThemedText style={{ fontWeight: 'bold' }}>
                  {`${plan.label || 'Free'}`.toLowerCase()}
                </ThemedText>{' '}
                plan
                {userPlan &&
                userPlan.status &&
                !(
                  userPlan.status === 'active' || userPlan.status === 'trialing'
                ) ? (
                  <>
                    {', '}but your subscription status is{' '}
                    <ThemedText style={{ fontWeight: 'bold' }}>
                      {userPlan.status}
                    </ThemedText>
                  </>
                ) : null}
              </>
            ) : (
              <>
                You've successfully scheduled your subscription for
                cancellation.
              </>
            )}
          </ThemedText>

          <Spacer height={contentPadding} />

          {userPlan &&
          (userPlan.status === 'incomplete' ||
            userPlan.status === 'incomplete_expired') ? (
            <>
              <ThemedText
                color="foregroundColor"
                style={{
                  lineHeight: normalTextSize + 4,
                  fontSize: normalTextSize,
                  textAlign: 'center',
                }}
              >
                Credit card charge failed. Please try again with another card.
              </ThemedText>

              <Spacer height={contentPadding} />
            </>
          ) : null}

          <ThemedText
            color="foregroundColor"
            style={{
              lineHeight: normalTextSize + 4,
              fontSize: normalTextSize,
              textAlign: 'center',
            }}
          >
            {plan && plan.amount
              ? 'You can now use DevHub with the unlocked features.'
              : ' You can keep using DevHub for the already paid period.' +
                ' Feel free to abort this or subscribe again anytime!'}
          </ThemedText>

          <Spacer height={contentPadding * 2} />

          {!!(plan && plan.amount) && (
            <>
              <Button
                analyticsLabel="subscribed_tweet_about_it"
                type="primary"
                onPress={() => {
                  Browser.openURLOnNewTab(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `I just bought @devhub_app${
                        plan.type === 'team' ? ' for my team' : ''
                      } https://devhubapp.com/`,
                    )}`,
                  )
                }}
                style={sharedStyles.fullWidth}
              >
                Tweet about it
              </Button>

              <Spacer height={contentPadding / 2} />
            </>
          )}

          <Button
            analyticsLabel="subscribed_finish"
            type="neutral"
            onPress={() => {
              dispatch(actions.closeAllModals())
            }}
            style={sharedStyles.fullWidth}
          >
            Close
          </Button>
        </View>
      </View>
    </ModalColumn>
  )
}
