import React, { PureComponent } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import theme from '../../../styles/themes/dark'

const styles = StyleSheet.create({
  separator: {
    borderBottomColor: theme.base01,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexGrow: 1,
    height: 1,
  } as ViewStyle,
})

export default class CardItemSeparator extends PureComponent {
  render() {
    return <View style={styles.separator} />
  }
}
