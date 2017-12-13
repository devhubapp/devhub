import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import theme from '../../../styles/themes/light'

const styles = StyleSheet.create({
  separator: {
    borderBottomColor: theme.base01,
    borderBottomWidth: 1,
    flexGrow: 1,
    height: 1,
  } as ViewStyle,
})

const CardItemSeparator = () => <View style={styles.separator} />

export default CardItemSeparator
