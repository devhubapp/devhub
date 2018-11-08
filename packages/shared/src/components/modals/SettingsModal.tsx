import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

import * as actions from '../../redux/actions'
import * as colors from '../../styles/colors'
import { contentPadding } from '../../styles/variables'
import { ExtractPropsFromConnector } from '../../types'
import { ModalColumn } from '../columns/ModalColumn'
import { Button } from '../common/Button'
import { DimensionsConsumer } from '../context/DimensionsContext'
import { ThemePreference } from '../widgets/ThemePreference'

export interface SettingsModalProps {}

const connectToStore = connect(
  null,
  { logout: actions.logout },
)

class SettingsModalComponent extends PureComponent<
  SettingsModalProps & ExtractPropsFromConnector<typeof connectToStore>
> {
  render() {
    return (
      <ModalColumn
        columnId="preferences-modal"
        iconName="gear"
        title="Preferences"
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: contentPadding }}
        >
          <ThemePreference />
        </ScrollView>

        <DimensionsConsumer>
          {({ width }) =>
            width <= 420 && (
              <View style={{ padding: contentPadding, paddingTop: 0 }}>
                <Button key="logout-button" onPress={() => this.props.logout()}>
                  Logout
                </Button>
              </View>
            )
          }
        </DimensionsConsumer>
      </ModalColumn>
    )
  }
}

export const SettingsModal = connectToStore(SettingsModalComponent)

hoistNonReactStatics(SettingsModal, SettingsModalComponent as any)
