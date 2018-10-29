import React, { PureComponent, ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { Platform } from '../../../src/libs/platform'
import { contentPadding } from '../../styles/variables'
import { DimensionsConsumer } from '../context/DimensionsContext'
import { ThemeConsumer } from '../context/ThemeContext'
import { sidebarSize } from '../layout/LeftSidebar'

export const columnMargin = contentPadding / 2

export interface ColumnProps extends ViewProps {
  children?: ReactNode
  maxWidth?: number
  minWidth?: number
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    borderRightWidth: StyleSheet.hairlineWidth,
  } as ViewStyle,
})

export class Column extends PureComponent<ColumnProps> {
  static defaultProps = {
    maxWidth: Platform.selectUsingRealOS(
      {
        android: 800,
        default: 360,
        ios: 680,
        web: 360,
      },
      { fallbackToWeb: true },
    ),
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
                className={width <= 600 ? 'snap-item-start' : ''}
                style={[
                  styles.container,
                  {
                    backgroundColor: theme.backgroundColor,
                    borderRightColor: theme.backgroundColorDarker08,
                    width: Math.max(
                      minWidth!,
                      Math.min(
                        maxWidth!,
                        width -
                          Platform.selectUsingRealOS(
                            {
                              default: 0,
                              web: sidebarSize,
                            },
                            { fallbackToWeb: false },
                          ),
                      ),
                    ),
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
