import React, { PureComponent, ReactNode } from 'react'
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { ThemeConsumer } from '../context/ThemeContext'

export interface ScreenProps {
  children?: ReactNode
  useSafeArea?: boolean
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  } as ViewStyle,
})

export default class Screen extends PureComponent<ScreenProps> {
  static defaultProps = {
    useSafeArea: true,
  }

  renderContent({ useSafeArea, style, ...props }: ScreenProps) {
    if (useSafeArea)
      return <SafeAreaView {...props} style={[styles.container, style]} />

    return <View {...props} style={[styles.container, style]} />
  }

  render() {
    return (
      <ThemeConsumer>
        {({ theme }) =>
          this.renderContent({
            ...this.props,
            style: [
              this.props.style,
              { backgroundColor: theme.backgroundColor },
            ],
          })
        }
      </ThemeConsumer>
    )
  }
}
