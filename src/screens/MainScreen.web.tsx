import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'

import Screen from '../components/common/Screen'
import { LeftSidebar } from '../components/layout/LeftSidebar'
import { ColumnsContainer } from '../containers/ColumnsContainer'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
})

export default class MainScreen extends PureComponent {
  render() {
    return (
      <Screen>
        <View style={styles.container}>
          <LeftSidebar />
          <ColumnsContainer />
        </View>
      </Screen>
    )
  }
}
