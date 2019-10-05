import { allPlans, PlanID } from '@devhub/core'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

import { Browser } from '../../libs/browser'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
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
  const { planId, showBackButton } = props

  const dispatch = useDispatch()

  const plan =
    (planId && allPlans.find(p => p.id === planId)) ||
    allPlans.find(p => p.amount > 0)

  useEffect(() => {
    if (!(plan && plan.id)) {
      dispatch(actions.closeAllModals())
      return
    }

    if (Platform.isElectron) {
      window.ipc.send('play-notification-sound')
    }
  }, [plan && plan.id])

  if (!(plan && plan.label)) return null

  return (
    <ModalColumn
      name="SUBSCRIBED"
      showBackButton={showBackButton}
      title={plan && plan.amount ? 'Unlock features' : 'Downgraded'}
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
            {plan.amount ? 'You are all set 🎉' : 'You are all set 👍'}
          </ThemedText>
          <Spacer height={contentPadding} />
          <ThemedText
            color="foregroundColorMuted65"
            style={{ lineHeight: 24, fontSize: 18, textAlign: 'center' }}
          >
            You've successfully {plan.amount ? 'subscribed' : 'downgraded'} to
            the{' '}
            <ThemedText style={{ fontWeight: 'bold' }}>{plan.label}</ThemedText>{' '}
            plan
          </ThemedText>
          <Spacer height={contentPadding} />
          <ThemedText
            color="foregroundColor"
            style={{
              lineHeight: normalTextSize + 4,
              fontSize: normalTextSize,
              textAlign: 'center',
            }}
          >
            {plan.amount
              ? 'You can now use DevHub with the unlocked features.'
              : ' Hopefully it was quick and easy to downgrade. Feel free to subscribe again anytime!'}
          </ThemedText>

          <Spacer height={contentPadding * 2} />

          <Button
            analyticsLabel="subscribed_tweet_about_it"
            type="primary"
            onPress={() => {
              Browser.openURLOnNewTab(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  "I've just subscribed to @devhub_app and it's awesome! https://devhubapp.com",
                )}`,
              )
            }}
            style={sharedStyles.fullWidth}
          >
            Tweet about it
          </Button>

          <Spacer height={contentPadding / 2} />

          <Button
            analyticsLabel="subscribed_finish"
            type="neutral"
            onPress={() => {
              dispatch(actions.closeAllModals())
            }}
            style={sharedStyles.fullWidth}
          >
            Finish
          </Button>
        </View>
      </View>
    </ModalColumn>
  )
}
