import React, { PureComponent, ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import Platform from '../../../src/libs/platform'
import { contentPadding } from '../../styles/variables'
import { DimensionsConsumer } from '../context/DimensionsContext'
import { ThemeConsumer } from '../context/ThemeContext'

export const columnMargin = contentPadding / 2

export interface IProps extends ViewProps {
  children?: ReactNode
  maxWidth?: number
  minWidth?: number
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    borderRightWidth: StyleSheet.hairlineWidth,
    flex: 1,
  } as ViewStyle,
})

export default class Column extends PureComponent<IProps> {
  static defaultProps = {
    maxWidth: Platform.selectUsingRealOS({
      android: 800,
      default: 360,
      ios: 680,
      web: 360,
    }),
    minWidth: 320,
  }

  render() {
    const { children, maxWidth, minWidth, style, ...props } = this.props

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <DimensionsConsumer>
            {({ width }) => (
              <View
                {...props}
                style={[
                  styles.container,
                  {
                    backgroundColor: theme.backgroundColor,
                    borderRightColor: theme.backgroundColorMore08,
                    width: Math.max(minWidth!, Math.min(maxWidth!, width)),
                  },
                  style,
                ]}
              >
                {children}
              </View>
            )}
          </DimensionsConsumer>
        )}
      </ThemeConsumer>
    )
  }
}
