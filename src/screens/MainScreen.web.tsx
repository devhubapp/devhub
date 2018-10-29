import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'

import { Screen } from '../components/common/Screen'
import { LeftSidebar } from '../components/layout/LeftSidebar'
import { ModalRenderer } from '../components/modals/ModalRenderer'
import { ColumnsContainer } from '../containers/ColumnsContainer'
import * as selectors from '../redux/selectors'
import { ExtractPropsFromConnector } from '../types'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
})

const connectToStore = connect((state: any) => ({
  currentOpenedModal: selectors.currentOpenedModal(state),
}))

class MainScreenComponent extends PureComponent<
  NavigationScreenProps & ExtractPropsFromConnector<typeof connectToStore>
> {
  render() {
    return (
      <Screen>
        <View style={styles.container}>
          <LeftSidebar navigation={this.props.navigation} />
          <ModalRenderer />
          <ColumnsContainer />
        </View>
      </Screen>
    )
  }
}

export const MainScreen = connectToStore(MainScreenComponent)

hoistNonReactStatics(MainScreen, MainScreenComponent as any)
