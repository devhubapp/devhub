import React from 'react'
import { View } from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { Avatar } from '../common/Avatar'
import { H2 } from '../common/H2'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'

export interface AccountSettingsProps {}

export function AccountSettings() {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const username = useReduxState(selectors.currentUsernameSelector)

  return (
    <View>
      <SubHeader title="Account" />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: contentPadding,
        }}
      >
        <Avatar size={28} username={username} />
        <Spacer width={contentPadding / 2} />
        <SpringAnimatedText
          style={{ color: springAnimatedTheme.foregroundColor }}
        >
          Logged in as{' '}
        </SpringAnimatedText>
        <Link href={`https://github.com/${username}`}>
          <SpringAnimatedText
            style={{
              color: springAnimatedTheme.foregroundColor,
              fontWeight: 'bold',
            }}
          >
            {username}
          </SpringAnimatedText>
        </Link>
      </View>
    </View>
  )
}
