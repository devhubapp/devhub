import React from 'react'
import { View } from 'react-native'

import { allPlans, constants } from '@devhub/core'
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
  const _userPlan = useReduxState(selectors.currentUserPlanSelector)
  const pushModal = useReduxAction(actions.pushModal)

  const userPlan = allPlans.find(p => p.id === (_userPlan && _userPlan.id))

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
        <View>
          <SubHeader title="Current plan">
            <Spacer flex={1} />

            <Button onPress={() => pushModal({ name: 'PRICING' })} size={32}>
              <View style={[sharedStyles.center, sharedStyles.horizontal]}>
                <ThemedIcon color="foregroundColor" name="pencil" />
                <Spacer width={contentPadding / 2} />
                <ThemedText color="foregroundColor">{`${(userPlan &&
                  userPlan.label) ||
                  'None'}`}</ThemedText>
              </View>
            </Button>
          </SubHeader>
        </View>

        {!!(
          Platform.isElectron ||
          (Platform.OS === 'web' && sizename > '2-medium')
        ) && (
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
        ) : null}

        <View style={{ minHeight: 32 }}>
          <SubHeader title="Community">
            <Spacer flex={1} />

            <View style={sharedStyles.horizontal}>
              <Link
                analyticsCategory="preferences_link"
                analyticsLabel="twitter"
                enableForegroundHover
                href={constants.DEVHUB_LINKS.TWITTER_PROFILE}
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
                enableForegroundHover
                href={constants.DEVHUB_LINKS.SLACK_INVITATION}
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
                enableForegroundHover
                href={constants.DEVHUB_LINKS.GITHUB_REPOSITORY}
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
        </View>
      </FullHeightScrollView>
    </ModalColumn>
  )
})

SettingsModal.displayName = 'SettingsModal'
