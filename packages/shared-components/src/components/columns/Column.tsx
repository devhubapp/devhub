import React, { PureComponent, ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { EventSubscription } from 'fbemitter'
import { emitter } from '../../setup'
import { contentPadding } from '../../styles/variables'
import { ColumnSizeConsumer } from '../context/ColumnSizeContext'
import { ThemeConsumer } from '../context/ThemeContext'

export const columnMargin = contentPadding / 2

export interface ColumnProps extends ViewProps {
  children?: ReactNode
  columnId: string
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
    const { children, columnId, pagingEnabled, style, ...props } = this.props

    return (
      <ThemeConsumer key={`column-inner-${columnId}`}>
        {({ theme }) => (
          <ColumnSizeConsumer>
            {({ width }) => (
              <View
                {...props}
                className={pagingEnabled ? 'snap-item-start' : ''}
                style={[
                  styles.container,
                  {
                    backgroundColor: theme.backgroundColor,
                    width,
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
          </ColumnSizeConsumer>
        )}
      </ThemeConsumer>
    )
  }
}
