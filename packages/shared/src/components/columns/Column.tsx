import React, { PureComponent, ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { EventSubscription } from 'fbemitter'
import { Platform } from '../../libs/platform'
import { emitter } from '../../setup'
import * as colors from '../../styles/colors'
import { contentPadding } from '../../styles/variables'
import { DimensionsConsumer } from '../context/DimensionsContext'
import { ThemeConsumer } from '../context/ThemeContext'
import { sidebarSize } from '../layout/Sidebar'

export const columnMargin = contentPadding / 2

export interface ColumnProps extends ViewProps {
  children?: ReactNode
  columnId: string
  maxWidth?: number
  minWidth?: number
  pagingEnabled?: boolean
  style?: StyleProp<ViewStyle>
}

export interface ColumnState {
  showFocusBorder?: boolean
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    borderRightWidth: StyleSheet.hairlineWidth,
  } as ViewStyle,
})

export class Column extends PureComponent<ColumnProps> {
  static defaultProps = {
    maxWidth: Platform.selectUsingRealOS(
      {
        android: 400,
        default: 360,
        ios: 400,
        web: 360,
      },
      { fallbackToWeb: true },
    ),
    minWidth: 320,
  }

  state = {
    showFocusBorder: false,
  }

  focusOnColumnListener?: EventSubscription

  componentDidMount() {
    this.focusOnColumnListener = emitter.addListener(
      'FOCUS_ON_COLUMN',
      this.handleColumnFocusRequest,
    )
  }

  componentWillUnmount() {
    if (this.focusOnColumnListener) this.focusOnColumnListener.remove()
  }

  handleColumnFocusRequest = ({
    columnId,
    highlight,
  }: {
    columnId: string
    highlight?: boolean
  }) => {
    if (!(columnId && columnId === this.props.columnId)) return
    if (!highlight) return

    this.setState({ showFocusBorder: true }, () => {
      setTimeout(() => {
        this.setState({ showFocusBorder: false })
      }, 1000)
    })
  }

  render() {
    const { showFocusBorder } = this.state
    const {
      children,
      columnId,
      maxWidth,
      minWidth,
      pagingEnabled,
      style,
      ...props
    } = this.props

    return (
      <ThemeConsumer key={`column-inner-${columnId}`}>
        {({ theme }) => (
          <DimensionsConsumer>
            {({ width }) => (
              <View
                {...props}
                className={pagingEnabled ? 'snap-item-start' : ''}
                style={[
                  styles.container,
                  {
                    backgroundColor: theme.backgroundColor,
                    borderRightColor: theme.backgroundColorDarker08,
                    width: Math.max(
                      minWidth!,
                      Math.min(
                        maxWidth!,
                        width - (width <= 420 ? 0 : sidebarSize), // TODO: Improve this
                      ),
                    ),
                  },
                  style,
                ]}
              >
                {children}

                {!!showFocusBorder && (
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      borderWidth: 0,
                      borderRightWidth: 4,
                      borderLeftWidth: 4,
                      borderColor: theme.foregroundColorTransparent50,
                    }}
                  />
                )}
              </View>
            )}
          </DimensionsConsumer>
        )}
      </ThemeConsumer>
    )
  }
}
