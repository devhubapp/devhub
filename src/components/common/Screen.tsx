import React, { ReactNode } from 'react'
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native'

import theme from '../../styles/themes/light'

export const size = 48

export interface IProps {
  children: ReactNode
  style?: ViewStyle
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.base00,
    flex: 1,
  } as ViewStyle,
})

const Screen = (props: IProps) => (
  <SafeAreaView {...props} style={[styles.container, props.style]} />
)

export default Screen
