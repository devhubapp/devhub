import React from 'react'
import { View } from 'react-native'

import { constants } from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { openAppStore } from '../../utils/helpers/shared'
import { ModalColumn } from '../columns/ModalColumn'
import { AppVersion } from '../common/AppVersion'
import { Avatar } from '../common/Avatar'
import { Button } from '../common/Button'
import { ButtonLink } from '../common/ButtonLink'
import { FullHeightScrollView } from '../common/FullHeightScrollView'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { useAppLayout } from '../context/LayoutContext'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { DesktopPreferences } from '../widgets/DesktopPreferences'
import { ThemePreference } from '../widgets/ThemePreference'

export interface SettingsModalProps {
  showBackButton: boolean
}

export const SettingsModal = React.memo((props: SettingsModalProps) => {
  const { showBackButton } = props

  const { sizename } = useAppLayout()
  const username = useReduxState(selectors.currentGitHubUsernameSelector)
  const logout = useReduxAction(actions.logout)
  const pushModal = useReduxAction(actions.pushModal)

  return (
    <ModalColumn
      hideCloseButton={sizename <= '2-medium'}
      name="SETTINGS"
      right={
        sizename <= '2-medium' && username ? (
          <Avatar
            backgroundColorLoading=""
            shape="circle"
            size={28}
            username={username}
          />
        ) : (
          undefined
        )
      }
      showBackButton={showBackButton}
      title="Preferences"
    >
      <FullHeightScrollView
        alwaysBounceVertical
        bounces
        style={sharedStyles.flex}
      >
        {!!Platform.isElectron && (
          <>
            <DesktopPreferences />
            <Spacer height={contentPadding} />
          </>
        )}

        <ThemePreference />

        {/* <Spacer height={contentPadding * 2} />

        <View>
          <SubHeader title="Enterprise" />

          <Button
            key="setup-github-enterprise-button"
            analyticsCategory="enterprise"
            analyticsAction="setup"
            analyticsLabel={username}
            analyticsPayload={{ user_id: userId }}
            onPress={() => pushModal({ name: 'SETUP_GITHUB_ENTERPRISE' })}
          >
            Setup GitHub Enterprise
          </Button>
        </View> */}

        <Spacer height={contentPadding} />

        {Platform.OS === 'ios' || Platform.OS === 'android' ? (
          <SubHeader title="Rate this app">
            <Spacer flex={1} />

            <Button
              analyticsLabel="rate_app"
              onPress={() => openAppStore({ showReviewModal: true })}
              size={32}
            >
              <ThemedIcon color="foregroundColor" name="star" size={16} />
            </Button>
          </SubHeader>
        ) : Platform.realOS === 'ios' || Platform.realOS === 'android' ? (
          <SubHeader title="Download native app">
            <Spacer flex={1} />

            <Button
              analyticsLabel="download_native_app"
              onPress={() => openAppStore({ showReviewModal: false })}
              size={32}
            >
              <ThemedIcon
                color="foregroundColor"
                name="device-mobile"
                size={16}
              />
            </Button>
          </SubHeader>
        ) : Platform.OS === 'web' &&
          !Platform.isElectron &&
          sizename < '2-medium' ? (
          <SubHeader title="Download desktop app">
            <Spacer flex={1} />

            <ButtonLink
              analyticsLabel="download_desktop_app"
              href="https://github.com/devhubapp/devhub/releases"
              openOnNewTab
              size={32}
            >
              <ThemedIcon
                color="foregroundColor"
                name="desktop-download"
                size={16}
              />
            </ButtonLink>
          </SubHeader>
        ) : null}

        <View>
          <SubHeader title="Community">
            <Spacer flex={1} />

            <View style={sharedStyles.horizontal}>
              <Link
                analyticsCategory="preferences_link"
                analyticsLabel="twitter"
                href="https://twitter.com/devhub_app"
                openOnNewTab
                textProps={{
                  color: 'foregroundColor',
                  style: {
                    fontSize: 14,
                    lineHeight: 18,
                    textAlign: 'center',
                  },
                }}
              >
                Twitter
              </Link>

              <ThemedText
                color="foregroundColorMuted25"
                style={{
                  fontStyle: 'italic',
                  paddingHorizontal: contentPadding / 2,
                }}
              >
                |
              </ThemedText>

              <Link
                analyticsCategory="preferences_link"
                analyticsLabel="slack"
                href={constants.SLACK_INVITE_LINK}
                openOnNewTab
                textProps={{
                  color: 'foregroundColor',
                  style: {
                    fontSize: 14,
                    lineHeight: 18,
                    textAlign: 'center',
                  },
                }}
              >
                Slack
              </Link>

              <ThemedText
                color="foregroundColorMuted25"
                style={{
                  fontStyle: 'italic',
                  paddingHorizontal: contentPadding / 2,
                }}
              >
                |
              </ThemedText>

              <Link
                analyticsCategory="preferences_link"
                analyticsLabel="github"
                href="https://github.com/devhubapp/devhub"
                openOnNewTab
                textProps={{
                  color: 'foregroundColor',
                  style: {
                    fontSize: 14,
                    lineHeight: 18,
                    textAlign: 'center',
                  },
                }}
              >
                GitHub
              </Link>
            </View>
          </SubHeader>
        </View>

        <Spacer flex={1} minHeight={contentPadding} />

        <View style={{ padding: contentPadding }}>
          <AppVersion />

          <Spacer height={contentPadding / 2} />

          <Button
            key="advanced-button"
            onPress={() => pushModal({ name: 'ADVANCED_SETTINGS' })}
          >
            Show advanced settings
          </Button>

          <Spacer height={contentPadding / 2} />

          <Button
            key="logout-button"
            analyticsCategory="engagement"
            analyticsAction="logout"
            analyticsLabel=""
            onPress={() => logout()}
          >
            Logout
          </Button>
        </View>
      </FullHeightScrollView>
    </ModalColumn>
  )
})

SettingsModal.displayName = 'SettingsModal'
