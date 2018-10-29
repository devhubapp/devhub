import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation'
import { connect } from 'react-redux'

import { CardItemSeparator } from '../components/cards/partials/CardItemSeparator'
import { Column } from '../components/columns/Column'
import { ColumnHeader } from '../components/columns/ColumnHeader'
import { ColumnHeaderItem } from '../components/columns/ColumnHeaderItem'
import { Screen } from '../components/common/Screen'
import { Spacer } from '../components/common/Spacer'
import { ThemeConsumer } from '../components/context/ThemeContext'
import { ThemePreference } from '../components/widgets/ThemePreference'
import { Platform } from '../libs/platform'
import * as actions from '../redux/actions'
import * as colors from '../styles/colors'
import { contentPadding } from '../styles/variables'
import { ExtractPropsFromConnector } from '../types'

export interface SettingsScreenProps {}

const connectToStore = connect(
  null,
  {
    logout: actions.logout,
    popModal: actions.popModal,
    setTheme: actions.setTheme,
  },
)

class SettingsScreenComponent extends PureComponent<
  SettingsScreenProps &
    ExtractPropsFromConnector<typeof connectToStore> &
    NavigationScreenProps
> {
  static navigationOptions: NavigationStackScreenOptions = {
    header: null,
  }

  logout = () => {
    this.props.logout()
  }

  render() {
    const { popModal } = this.props

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <Screen statusBarBackgroundColor={theme.backgroundColorLess08}>
            <Column>
              <ColumnHeader>
                <ColumnHeaderItem iconName="gear" title="Preferences" />

                {Platform.realOS === 'web' && (
                  <>
                    <Spacer flex={1} />

                    <ColumnHeaderItem iconName="x" onPress={() => popModal()} />
                  </>
                )}
              </ColumnHeader>

              <CardItemSeparator />

              <View style={{ flex: 1 }}>
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{ padding: contentPadding }}
                >
                  <ThemePreference />
                </ScrollView>

                {Platform.realOS !== 'web' && (
                  <View style={{ padding: contentPadding, paddingTop: 0 }}>
                    <TouchableOpacity
                      key="logout-button"
                      onPress={() => this.props.logout()}
                    >
                      <Text style={{ color: colors.red }}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </Column>
          </Screen>
        )}
      </ThemeConsumer>
    )
  }
}

export const SettingsScreen = connectToStore(SettingsScreenComponent)

hoistNonReactStatics(SettingsScreen, SettingsScreenComponent as any)
