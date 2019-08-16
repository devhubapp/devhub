import React from 'react'
import { View } from 'react-native'

import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { Avatar } from '../common/Avatar'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { ThemedText } from '../themed/ThemedText'

export interface AccountSettingsProps {}

export function AccountSettings() {
  const username = useReduxState(selectors.currentGitHubUsernameSelector)

  return (
    <View>
      <SubHeader title="Account" />

      <View
        style={[
          sharedStyles.horizontal,
          sharedStyles.alignItemsCenter,
          {
            paddingHorizontal: contentPadding,
          },
        ]}
      >
        <Avatar size={28} username={username} />
        <Spacer width={contentPadding / 2} />
        <ThemedText color="foregroundColor">Logged in as </ThemedText>
        <Link
          href={`https://github.com/${username}`}
          textProps={{
            color: 'foregroundColor',
            style: { fontWeight: 'bold' },
          }}
        >
          {username}
        </Link>
      </View>
    </View>
  )
}
