import React from 'react'
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
import { SubHeader } from '../common/SubHeader'
import { useAppLayout } from '../context/LayoutContext'
import { ThemePreference } from '../widgets/ThemePreference'

export interface SettingsModalProps {
  showBackButton: boolean
}

export const SettingsModal = React.memo((props: SettingsModalProps) => {
  const { showBackButton } = props

  const { sizename } = useAppLayout()

  const username = useReduxState(selectors.currentUsernameSelector)

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
      </ScrollView>
    </ModalColumn>
  )
})
