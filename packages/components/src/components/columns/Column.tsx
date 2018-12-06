import React, { ReactNode, useState } from 'react'
import {
  Animated,
  StyleProp,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useEmitter } from '../../hooks/use-emitter'
import { contentPadding } from '../../styles/variables'
import { useColumnWidth } from '../context/ColumnWidthContext'

export const columnMargin = contentPadding / 2

export interface ColumnProps extends ViewProps {
  children?: ReactNode
  columnId: string
  pagingEnabled?: boolean
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
})

export const Column = React.memo((props: ColumnProps) => {
  const { children, columnId, pagingEnabled, style, ...otherProps } = props

  const [showFocusBorder, setShowFocusBorder] = useState(false)
  const theme = useAnimatedTheme()
  const width = useColumnWidth()

  useEmitter(
    'FOCUS_ON_COLUMN',
    (payload: { columnId: string; highlight?: boolean }) => {
      if (!(payload.columnId && payload.columnId === columnId)) return
      if (!payload.highlight) return

      setShowFocusBorder(true)
      setTimeout(() => {
        setShowFocusBorder(false)
      }, 1000)
    },
  )

  return (
    <Animated.View
      {...otherProps}
      key={`column-inner-${columnId}`}
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
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            borderWidth: 0,
            borderRightWidth: 4,
            borderLeftWidth: 4,
            borderColor: theme.foregroundColorTransparent50,
          }}
        />
      )}
    </Animated.View>
  )
})
