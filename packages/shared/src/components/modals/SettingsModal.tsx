import React, { useContext } from 'react'
import { ScrollView, View } from 'react-native'

import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { ModalColumn } from '../columns/ModalColumn'
import { AppVersion } from '../common/AppVersion'
import { Avatar } from '../common/Avatar'
import { Button } from '../common/Button'
import { Spacer } from '../common/Spacer'
import { LayoutConsumer } from '../context/LayoutContext'
import { ThemeContext } from '../context/ThemeContext'
import { ThemePreference } from '../widgets/ThemePreference'

export interface SettingsModalProps {}

export function SettingsModal() {
  const { theme } = useContext(ThemeContext)
  const user = useReduxState(selectors.currentUserSelector)
  const logout = useReduxAction(actions.logout)

  const username = (user && user.login) || ''

  return (
    <LayoutConsumer>
      {({ sizename }) => {
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
            </ScrollView>

            <View style={{ padding: contentPadding }}>
              <Button key="logout-button" onPress={() => logout()}>
                Logout
              </Button>

              <Spacer height={contentPadding} />

              <AppVersion />
            </View>
          </ModalColumn>
        )
      }}
    </LayoutConsumer>
  )
}
