import React, { PureComponent, ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { EventSubscription } from 'fbemitter'
import { emitter } from '../../setup'
import { contentPadding } from '../../styles/variables'
import { DimensionsConsumer } from '../context/DimensionsContext'
import { ThemeConsumer } from '../context/ThemeContext'
import { sidebarSize } from '../layout/Sidebar'

export const columnMargin = contentPadding / 2

export interface ColumnProps extends ViewProps {
  children?: ReactNode
  columnId: string
  maxWidth?: number | null
  minWidth?: number | null
  pagingEnabled?: boolean
  style?: StyleProp<ViewStyle>
}

export interface ColumnState {
  showFocusBorder?: boolean
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
})

export class Column extends PureComponent<ColumnProps> {
  static defaultProps = {
    maxWidth: 360,
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
                    width: Math.max(
                      minWidth && minWidth > 0 ? minWidth : 0,
                      Math.min(
                        width - (width <= 420 ? 0 : sidebarSize), // TODO: Improve this
                        maxWidth && maxWidth >= 0
                          ? width <= 420
                            ? width
                            : maxWidth
                          : width,
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
