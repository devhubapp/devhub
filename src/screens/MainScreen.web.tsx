import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'

import { Column } from '../components/columns/Column'
import { Screen } from '../components/common/Screen'
import { LeftSidebar } from '../components/layout/LeftSidebar'
import { ColumnsContainer } from '../containers/ColumnsContainer'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { SettingsScreen } from '../screens/SettingsScreen'
import { ExtractPropsFromConnector } from '../types'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
})

const connectToStore = connect(
  (state: any) => ({
    currentOpenedModal: selectors.currentOpenedModal(state),
  }),
  {
    showModal: actions.showModal,
  },
)

class MainScreenComponent extends PureComponent<
  NavigationScreenProps & ExtractPropsFromConnector<typeof connectToStore>
> {
  render() {
    const { currentOpenedModal } = this.props

    return (
      <Screen>
        <View style={styles.container}>
          <LeftSidebar navigation={this.props.navigation} />

          {currentOpenedModal === 'SETTINGS' && (
            <Column>
              <SettingsScreen navigation={{} as any} />
            </Column>
          )}

          <ColumnsContainer />
        </View>
      </Screen>
    )
  }
}

export const MainScreen = connectToStore(MainScreenComponent)

hoistNonReactStatics(MainScreen, MainScreenComponent as any)
