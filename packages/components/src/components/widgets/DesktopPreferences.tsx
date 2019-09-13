import React from 'react'
import { Text, View } from 'react-native'

import { activePlans, constants, formatPrice } from '@devhub/core'
import { useDesktopOptions } from '../../hooks/use-desktop-options'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding, radius } from '../../styles/variables'
import { H3 } from '../common/H3'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { Switch } from '../common/Switch'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'

export const DesktopPreferences = React.memo(() => {
  const plan = useReduxState(selectors.currentUserPlanSelector)
  const {
    enablePushNotifications,
    enablePushNotificationsSound,
    isMenuBarMode,
  } = useDesktopOptions()

  if (!Platform.isElectron) return null

  const hasAccessToPushNotifications = !!(
    plan &&
    (plan.status === 'active' || plan.status === 'trialing') &&
    plan.featureFlags &&
    plan.featureFlags.enablePushNotifications
  )

  const cheapestPlanWithNotifications = activePlans
    .sort((a, b) => a.amount - b.amount)
    .find(p => p.featureFlags.enablePushNotifications)

  return (
    <View>
      <SubHeader title="Desktop options" />

      <View style={{ paddingHorizontal: contentPadding }}>
        <View
          style={[
            sharedStyles.horizontal,
            sharedStyles.alignItemsCenter,
            sharedStyles.justifyContentSpaceBetween,
          ]}
        >
          <H3>Menubar mode</H3>
          <Switch
            analyticsLabel="desktop_menubar_mode"
            onValueChange={value =>
              window.ipc.send('update-settings', {
                settings: 'isMenuBarMode',
                value,
              })
            }
            value={isMenuBarMode}
          />
        </View>

        <Spacer height={contentPadding} />

        <View
          style={[
            sharedStyles.horizontal,
            sharedStyles.alignItemsCenter,
            sharedStyles.justifyContentSpaceBetween,
          ]}
        >
          <H3>Push Notifications</H3>
          <Switch
            analyticsLabel="desktop_push_notifications"
            color={!hasAccessToPushNotifications ? 'red' : undefined}
            onValueChange={value =>
              window.ipc.send('update-settings', {
                settings: 'enablePushNotifications',
                value,
              })
            }
            value={enablePushNotifications}
          />
        </View>

        <Spacer height={contentPadding} />
        <View
          style={[
            sharedStyles.horizontal,
            sharedStyles.alignItemsCenter,
            sharedStyles.justifyContentSpaceBetween,
          ]}
        >
          <H3>Push Notifications Sound</H3>
          <Switch
            analyticsLabel="desktop_push_notifications_sound"
            color={!hasAccessToPushNotifications ? 'red' : undefined}
            disabled={!enablePushNotifications}
            onValueChange={value =>
              window.ipc.send('update-settings', {
                settings: 'enablePushNotificationsSound',
                value,
              })
            }
            value={
              // hasAccessToPushNotifications &&
              enablePushNotifications && enablePushNotificationsSound
            }
          />
        </View>

        {!!(
          !hasAccessToPushNotifications &&
          enablePushNotifications &&
          cheapestPlanWithNotifications
        ) && (
          <>
            <Spacer height={contentPadding} />

            <ThemedView
              backgroundColor="backgroundColorLess1"
              style={[sharedStyles.alignSelfStretch, { borderRadius: radius }]}
            >
              <Link
                analyticsLabel="desktop_preferences_push_notifications_cta"
                enableForegroundHover
                href={`${constants.LANDING_BASE_URL}/pricing`}
                openOnNewTab
                textProps={{
                  color: 'foregroundColor',
                  style: [
                    sharedStyles.alignSelfStretch,
                    sharedStyles.alignSelfCenter,
                    sharedStyles.textCenter,
                    sharedStyles.padding,
                  ],
                }}
              >{`Unlock Push Notifications and other features for ${formatPrice(
                cheapestPlanWithNotifications.amount,
                cheapestPlanWithNotifications.currency,
              )}/${cheapestPlanWithNotifications.interval}`}</Link>
            </ThemedView>
          </>
        )}
      </View>
    </View>
  )
})

DesktopPreferences.displayName = 'DesktopPreferences'
