import React, { useState } from 'react'
import { Dimensions, ScrollView, View } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import * as actions from '../../redux/actions'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
import { useReduxState } from '../../redux/hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import {
  columnHeaderHeight,
  contentPadding,
  sidebarSize,
} from '../../styles/variables'
import { ModalColumn } from '../columns/ModalColumn'
import { AppVersion } from '../common/AppVersion'
import { Avatar } from '../common/Avatar'
import { Button } from '../common/Button'
import { H2 } from '../common/H2'
import { Spacer } from '../common/Spacer'
import { useAppLayout } from '../context/LayoutContext'
import { ThemePreference } from '../widgets/ThemePreference'

export interface SettingsModalProps {}

export function SettingsModal() {
  const { sizename } = useAppLayout()

  const [containerHeight, setContainerHeight] = useState(
    () =>
      Dimensions.get('window').height -
      columnHeaderHeight -
      (sizename === '1-small' ? sidebarSize + 16 : 0),
  )

  const theme = useAnimatedTheme()

  const userId = useReduxState(selectors.currentUserIdSelector)
  const username = useReduxState(selectors.currentUsernameSelector)

  const logout = useReduxAction(actions.logout)
  const pushModal = useReduxAction(actions.pushModal)

  return (
    <ModalColumn
      columnId="preferences-modal"
      hideCloseButton={sizename === '1-small'}
      iconName="gear"
      title="Preferences"
      right={
        sizename === '1-small' && username ? (
          <Avatar
            backgroundColorLoading={theme.backgroundColor}
            shape="circle"
            size={28}
            username={username}
          />
        ) : (
          undefined
        )
      }
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          minHeight: containerHeight,
          padding: contentPadding,
        }}
        onLayout={e => {
          setContainerHeight(e.nativeEvent.layout.height)
        }}
      >
        <ThemePreference />

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

        <Spacer flex={1} minHeight={contentPadding * 2} />

        <AppVersion />

        <Spacer height={contentPadding} />

        <Button
          key="logout-button"
          analyticsCategory="engagement"
          analyticsAction="logout"
          analyticsLabel=""
          onPress={() => logout()}
        >
          Logout
        </Button>
      </ScrollView>
    </ModalColumn>
  )
}
