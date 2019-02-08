import React, { ReactNode, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useEmitter } from '../../hooks/use-emitter'
import { contentPadding } from '../../styles/variables'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { Separator, separatorTickSize } from '../common/Separator'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { useAppLayout } from '../context/LayoutContext'

export const columnMargin = contentPadding / 2

export interface ColumnProps extends ViewProps {
  children?: ReactNode
  columnId: string
  pagingEnabled?: boolean
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100%',
  },
})

export const Column = React.memo((props: ColumnProps) => {
  const { children, columnId, pagingEnabled, style, ...otherProps } = props

  const [showFocusBorder, setShowFocusBorder] = useState(false)
  const { sizename } = useAppLayout()
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()
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
    <SpringAnimatedView
      {...otherProps}
      key={`column-inner-${columnId}`}
      className={pagingEnabled ? 'snap-item-start' : ''}
      style={[
        styles.container,
        {
          backgroundColor: springAnimatedTheme.backgroundColor,
          width,
        },
        style,
      ]}
    >
      <Separator half horizontal={false} thick={sizename > '1-small'} />
      <View style={{ flex: 1 }}>{children}</View>
      <Separator half horizontal={false} thick={sizename > '1-small'} />

      {!!showFocusBorder && (
        <SpringAnimatedView
          collapsable={false}
          pointerEvents="box-none"
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              borderWidth: 0,
              borderRightWidth: Math.max(4, separatorTickSize),
              borderLeftWidth: Math.max(4, separatorTickSize),
              borderColor: springAnimatedTheme.foregroundColorMuted50,
              zIndex: 1000,
            },
          ]}
        />
      )}
    </SpringAnimatedView>
  )
})
