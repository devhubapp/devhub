import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

import { Screen } from '../components/common/Screen'
import { LeftSidebar } from '../components/layout/LeftSidebar'
import { ColumnsContainer } from '../containers/ColumnsContainer'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
})

export class MainScreen extends PureComponent<NavigationScreenProps> {
  render() {
    return (
      <Screen>
        <View style={styles.container}>
          <LeftSidebar navigation={this.props.navigation} />
          <ColumnsContainer />
        </View>
      </Screen>
    )
  }
}
