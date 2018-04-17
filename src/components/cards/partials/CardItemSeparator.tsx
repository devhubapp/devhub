import React, { PureComponent } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import theme from '../../../styles/themes/dark'

const styles = StyleSheet.create({
  separator: {
    alignSelf: 'stretch',
    borderBottomColor: theme.base01,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 1,
  } as ViewStyle,
})

export default class CardItemSeparator extends PureComponent {
  render() {
    return <View style={styles.separator} />
  }
}
