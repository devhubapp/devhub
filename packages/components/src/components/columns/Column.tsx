import React, { ReactNode, useRef } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useEmitter } from '../../hooks/use-emitter'
import { Platform } from '../../libs/platform'
import { contentPadding } from '../../styles/variables'
import { findNode, tryFocus } from '../../utils/helpers/shared'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { Separator, separatorTickSize } from '../common/Separator'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { useAppLayout } from '../context/LayoutContext'

export const columnMargin = contentPadding / 2

export interface ColumnProps extends ViewProps {
  children?: ReactNode
  columnId: string
  fullWidth?: boolean
  pagingEnabled?: boolean
  renderSideSeparators?: boolean
  style?: StyleProp<ViewStyle>
}

export const Column = React.memo(
  React.forwardRef((props: ColumnProps, ref) => {
    const {
      children,
      columnId,
      fullWidth,
      pagingEnabled,
      renderSideSeparators,
      style,
      ...otherProps
    } = props

    const _columnRef = useRef<View>(null)
    const columnRef = (ref as React.RefObject<View>) || _columnRef

    const columnBorderRef = useRef<View>(null)

    const { sizename } = useAppLayout()
    const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()
    const columnWidth = useColumnWidth()

    useEmitter(
      'FOCUS_ON_COLUMN',
      (payload: { columnId: string; highlight?: boolean }) => {
        if (!columnBorderRef.current) return

        if (!(payload.columnId && payload.columnId === columnId)) {
          columnBorderRef.current.setNativeProps({ style: { opacity: 0 } })
          return
        }

        if (payload.highlight) {
          columnBorderRef.current.setNativeProps({ style: { opacity: 1 } })
          setTimeout(() => {
            if (!columnBorderRef.current) return
            columnBorderRef.current.setNativeProps({ style: { opacity: 0 } })
          }, 1000)
        }

        if (Platform.OS === 'web' && columnRef.current) {
          tryFocus(columnRef.current)
        }
      },
    )

    return (
      <SpringAnimatedView
        {...otherProps}
        ref={columnRef}
        key={`column-inner-${columnId}`}
        style={[
          {
            flexDirection: 'row',
            height: '100%',
            backgroundColor: springAnimatedTheme.backgroundColor,
          },
          fullWidth ? { flex: 1 } : { width: columnWidth },
          style,
        ]}
      >
        {!!renderSideSeparators && (
          <Separator half horizontal={false} thick={sizename > '1-small'} />
        )}
        <View style={{ flex: 1 }}>{children}</View>
        {!!renderSideSeparators && (
          <Separator half horizontal={false} thick={sizename > '1-small'} />
        )}

        <SpringAnimatedView
          ref={columnBorderRef}
          collapsable={false}
          pointerEvents="box-none"
          style={[
            StyleSheet.absoluteFill,
            {
              borderWidth: 0,
              borderRightWidth: Math.max(4, separatorTickSize),
              borderLeftWidth: Math.max(4, separatorTickSize),
              borderColor: springAnimatedTheme.foregroundColorMuted50,
              zIndex: 1000,
              opacity: 0,
            },
          ]}
        />
      </SpringAnimatedView>
    )
  }),
)
