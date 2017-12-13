import React from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'

import NotificationsScreen from './components/screens/NotificationsScreen'
import theme from './styles/themes/light'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default () => (
  <View style={styles.container}>
    <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
    <NotificationsScreen />
  </View>
)
