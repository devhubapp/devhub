import React, { ReactNode, useRef, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useEmitter } from '../../hooks/use-emitter'
import { Platform } from '../../libs/platform'
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

export const Column = React.memo(
  React.forwardRef((props: ColumnProps, ref) => {
    const { children, columnId, pagingEnabled, style, ...otherProps } = props

    const _columnRef = useRef<View>(null)
    const columnRef = (ref as React.RefObject<View>) || _columnRef
    const [showFocusBorder, setShowFocusBorder] = useState(false)
    const { sizename } = useAppLayout()
    const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()
    const width = useColumnWidth()

    useEmitter(
      'FOCUS_ON_COLUMN',
      (payload: { columnId: string; highlight?: boolean }) => {
        if (!(payload.columnId && payload.columnId === columnId)) return

        if (payload.highlight) {
          setShowFocusBorder(true)
          setTimeout(() => {
            setShowFocusBorder(false)
          }, 1000)
        }

        if (Platform.OS === 'web' && columnRef.current) {
          columnRef.current.focus()
        }
      },
    )

    return (
      <SpringAnimatedView
        {...otherProps}
        ref={columnRef}
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
  }),
)
