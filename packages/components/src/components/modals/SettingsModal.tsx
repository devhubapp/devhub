import React from 'react'
import { ScrollView, View } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import * as actions from '../../redux/actions'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
import { useReduxState } from '../../redux/hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { ModalColumn } from '../columns/ModalColumn'
import { AppVersion } from '../common/AppVersion'
import { Avatar } from '../common/Avatar'
import { Button } from '../common/Button'
import { Spacer } from '../common/Spacer'
import { useAppLayout } from '../context/LayoutContext'
import { AccountSettings } from '../widgets/AccountSettings'
import { ThemePreference } from '../widgets/ThemePreference'

export interface SettingsModalProps {}

export function SettingsModal() {
  const theme = useAnimatedTheme()
  const { sizename } = useAppLayout()

  const username = useReduxState(selectors.currentUsernameSelector)

  const logout = useReduxAction(actions.logout)

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
        contentContainerStyle={{ padding: contentPadding }}
      >
        <ThemePreference />

        <Spacer height={contentPadding * 2} />

        <AccountSettings />
      </ScrollView>

      <View style={{ padding: contentPadding }}>
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
      </View>
    </ModalColumn>
  )
}
