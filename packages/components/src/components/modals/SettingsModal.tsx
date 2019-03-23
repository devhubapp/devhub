import React from 'react'
import { ScrollView, View } from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { openAppStore } from '../../utils/helpers/shared'
import { SpringAnimatedIcon } from '../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { ModalColumn } from '../columns/ModalColumn'
import { AppVersion } from '../common/AppVersion'
import { Avatar } from '../common/Avatar'
import { Button } from '../common/Button'
import { ButtonLink } from '../common/ButtonLink'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { useAppLayout } from '../context/LayoutContext'
import { ThemePreference } from '../widgets/ThemePreference'

export interface SettingsModalProps {
  showBackButton: boolean
}

export const SettingsModal = React.memo((props: SettingsModalProps) => {
  const { showBackButton } = props

  const { sizename } = useAppLayout()

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const username = useReduxState(selectors.currentGitHubUsernameSelector)

  const logout = useReduxAction(actions.logout)
  const pushModal = useReduxAction(actions.pushModal)

  return (
    <ModalColumn
      hideCloseButton={sizename === '1-small'}
      iconName="gear"
      name="SETTINGS"
      right={
        sizename === '1-small' && username ? (
          <Avatar
            backgroundColorLoading={null}
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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
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

        {(Platform.realOS === 'ios' || Platform.realOS === 'android') && (
          <>
            <SubHeader title="Rate this app">
              <Spacer flex={1} />

              <Button
                analyticsLabel="rate_app"
                onPress={() => openAppStore()}
                size={32}
              >
                <SpringAnimatedIcon
                  name="star"
                  size={16}
                  style={{
                    color: springAnimatedTheme.foregroundColor,
                  }}
                />
              </Button>
            </SubHeader>
          </>
        )}

        <View>
          <SubHeader title="Follow on Twitter">
            <Spacer flex={1} />

            <Link
              analyticsLabel="follow_on_twitter_brunolemos"
              href="https://twitter.com/brunolemos"
              openOnNewTab
            >
              <Avatar disableLink username="brunolemos" size={24} />
            </Link>

            <Spacer width={contentPadding} />

            <Link
              analyticsLabel="follow_on_twitter_devhub"
              href="https://twitter.com/devhub_app"
              openOnNewTab
            >
              <Avatar disableLink username="devhubapp" size={24} />
            </Link>
          </SubHeader>
        </View>

        <Spacer flex={1} minHeight={contentPadding} />

        <View style={{ padding: contentPadding }}>
          <AppVersion />

          <Spacer height={contentPadding} />

          <Button
            key="adbanced-button"
            analyticsLabel=""
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
      </ScrollView>
    </ModalColumn>
  )
})
