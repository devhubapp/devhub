import React from 'react'
import { Animated, View } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import * as actions from '../../redux/actions'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
import { useReduxState } from '../../redux/hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { Avatar } from '../common/Avatar'
import { Button } from '../common/Button'
import { H2 } from '../common/H2'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'

export interface AccountSettingsProps {}

export function AccountSettings() {
  const theme = useAnimatedTheme()

  const userId = useReduxState(selectors.currentUserIdSelector)
  const username = useReduxState(selectors.currentUsernameSelector)

  const pushModal = useReduxAction(actions.pushModal)

  return (
    <>
      <View>
        <H2 withMargin>Account</H2>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Avatar size={28} username={username} />
          <Spacer width={contentPadding / 2} />
          <Animated.Text style={{ color: theme.foregroundColor }}>
            Logged in as{' '}
          </Animated.Text>
          <Link href={`https://github.com/${username}`}>
            <Animated.Text
              style={{
                color: theme.foregroundColor,
                fontWeight: 'bold',
              }}
            >
              {username}
            </Animated.Text>
          </Link>
        </View>
      </View>

      <Spacer height={contentPadding * 2} />

      <View>
        <H2 withMargin>Enterprise</H2>

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
      </View>
    </>
  )
}
