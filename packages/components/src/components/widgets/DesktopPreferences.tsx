import {
  cheapestPlanWithNotifications,
  constants,
  formatPriceAndInterval,
  getColumnOptionMetadata,
} from '@devhub/core'
import React from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

import { useDesktopOptions } from '../../hooks/use-desktop-options'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding, radius } from '../../styles/variables'
import { Button } from '../common/Button'
import { ButtonLink } from '../common/ButtonLink'
import { H3 } from '../common/H3'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { Switch } from '../common/Switch'
import { useAppLayout } from '../context/LayoutContext'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'

export const DesktopPreferences = React.memo(() => {
  const dispatch = useDispatch()
  const plan = useReduxState(selectors.currentUserPlanSelector)
  const {
    enablePushNotifications,
    enablePushNotificationsSound,
    isMenuBarMode,
  } = useDesktopOptions()

  const { sizename } = useAppLayout()

  const hasAccessToPushNotifications = getColumnOptionMetadata({
    Platform,
    plan,
  }).enableDesktopPushNotifications.hasAccess

  return (
    <View>
      <SubHeader
        title={Platform.isElectron ? 'Desktop options' : 'Desktop app'}
      >
        {!Platform.isElectron && (
          <>
            <Spacer flex={1} />

            <ButtonLink
              analyticsLabel="download_desktop_app"
              href={constants.DEVHUB_LINKS.DOWNLOAD_PAGE}
              openOnNewTab
              size={32}
            >
              <View style={[sharedStyles.center, sharedStyles.horizontal]}>
                <ThemedIcon
                  color="foregroundColor"
                  name="desktop-download"
                  size={16}
                />
                <Spacer width={contentPadding / 2} />
                <ThemedText color="foregroundColor">Download</ThemedText>
              </View>
            </ButtonLink>
          </>
        )}
      </SubHeader>

      {!!(
        Platform.isElectron ||
        (Platform.OS === 'web' && sizename > '2-medium')
      ) && (
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
              disabled={!Platform.isElectron}
              onValueChange={value =>
                window.ipc.send('update-settings', {
                  settings: 'isMenuBarMode',
                  value,
                })
              }
              value={!!(Platform.isElectron && isMenuBarMode)}
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
              disabled={!Platform.isElectron}
              onValueChange={value =>
                window.ipc.send('update-settings', {
                  settings: 'enablePushNotifications',
                  value,
                })
              }
              value={!!(Platform.isElectron && enablePushNotifications)}
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
              disabled={!Platform.isElectron || !enablePushNotifications}
              onValueChange={value =>
                window.ipc.send('update-settings', {
                  settings: 'enablePushNotificationsSound',
                  value,
                })
              }
              value={
                // hasAccessToPushNotifications &&
                !!(
                  Platform.isElectron &&
                  enablePushNotifications &&
                  enablePushNotificationsSound
                )
              }
            />
          </View>

          {!!(
            Platform.isElectron &&
            !hasAccessToPushNotifications &&
            enablePushNotifications &&
            cheapestPlanWithNotifications
          ) && (
            <>
              <Spacer height={contentPadding} />

              <ThemedView
                backgroundColor="backgroundColorLess1"
                style={[
                  sharedStyles.alignSelfStretch,
                  { borderRadius: radius },
                ]}
              >
                <Button
                  analyticsLabel="desktop_preferences_push_notifications_cta"
                  size="auto"
                  onPress={() => {
                    dispatch(
                      actions.pushModal({
                        name: 'PRICING',
                        params: {
                          highlightFeature: 'enablePushNotifications',
                          // initialSelectedPlanId: cheapestPlanWithNotifications.id,
                        },
                      }),
                    )
                  }}
                  textStyle={{ fontWeight: '300' }}
                >{`Unlock Push Notifications and other features for ${formatPriceAndInterval(
                  cheapestPlanWithNotifications.amount,
                  cheapestPlanWithNotifications,
                )}`}</Button>
              </ThemedView>
            </>
          )}

          <Spacer height={contentPadding} />
        </View>
      )}
    </View>
  )
})

DesktopPreferences.displayName = 'DesktopPreferences'
