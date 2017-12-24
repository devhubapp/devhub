import React, { ReactNode, SFC } from 'react'
import { SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native'

import theme from '../../styles/themes/dark'

export const size = 48

export interface IProps {
  children: ReactNode
  useSafeArea?: boolean
  style?: ViewStyle
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.base00,
    flex: 1,
  } as ViewStyle,
})

const Screen: SFC<IProps> = ({ useSafeArea, ...props }) =>
  useSafeArea ? (
    <SafeAreaView {...props} style={[styles.container, props.style]} />
  ) : (
    <View {...props} style={[styles.container, props.style]} />
  )

Screen.defaultProps = {
  useSafeArea: true,
}

export default Screen
