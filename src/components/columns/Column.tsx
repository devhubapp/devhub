import React, { PureComponent, ReactNode } from 'react'
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import Platform from '../../../src/libs/platform'
import theme from '../../styles/themes/dark'
import { contentPadding } from '../../styles/variables'
import DimensionsWatcher from '../render-props/DimensionsWatcher'

export const columnMargin = contentPadding / 2

export interface IProps extends ViewProps {
  children?: ReactNode
  maxWidth?: number
  minWidth?: number
  style?: ViewStyle
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.base00,
    borderRightColor: theme.base01,
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
    minWidth: 300,
  }

  render() {
    const { children, maxWidth, minWidth, style, ...props } = this.props

    return (
      <DimensionsWatcher>
        {({ width }) => (
          <View
            {...props}
            style={[
              styles.container,
              {
                width: Math.max(minWidth!, Math.min(maxWidth!, width)),
              },
              style,
            ]}
          >
            {children}
          </View>
        )}
      </DimensionsWatcher>
    )
  }
}
