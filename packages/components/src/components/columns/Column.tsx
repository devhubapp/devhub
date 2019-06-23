import React, { ReactNode, useRef } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'

import { useEmitter } from '../../hooks/use-emitter'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { tryFocus } from '../../utils/helpers/shared'
import { separatorThickSize } from '../common/Separator'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { ThemedView } from '../themed/ThemedView'
import { ColumnSeparator } from './ColumnSeparator'

export const columnMargin = contentPadding / 2

export interface ColumnProps extends ViewProps {
  children?: ReactNode
  columnId: string
  fullWidth?: boolean
  pagingEnabled?: boolean
  renderLeftSeparator?: boolean
  renderRightSeparator?: boolean
  style?: StyleProp<ViewStyle>
}

export const Column = React.memo(
  React.forwardRef((props: ColumnProps, ref) => {
    const {
      children,
      columnId,
      fullWidth,
      pagingEnabled,
      renderLeftSeparator,
      renderRightSeparator,
      style,
      ...otherProps
    } = props

    const _columnRef = useRef<View>(null)
    const columnRef = (ref as React.RefObject<View>) || _columnRef

    const columnBorderRef = useRef<View>(null)

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
          const currentFocusedNodeTag =
            typeof document !== 'undefined' &&
            document &&
            document.activeElement &&
            document.activeElement.tagName

          if (
            !(
              currentFocusedNodeTag &&
              currentFocusedNodeTag.toLowerCase() === 'input'
            )
          ) {
            tryFocus(columnRef.current)
          }
        }
      },
    )

    return (
      <ThemedView
        {...otherProps}
        ref={columnRef}
        key={`column-${columnId}-inner`}
        backgroundColor="backgroundColor"
        style={[
          sharedStyles.horizontal,
          {
            height: '100%',
            overflow: 'hidden',
          },
          fullWidth ? sharedStyles.flex : { width: columnWidth },
          style,
        ]}
      >
        {!!renderLeftSeparator && <ColumnSeparator half />}
        <View style={sharedStyles.flex}>{children}</View>
        {!!renderRightSeparator && <ColumnSeparator half />}

        <ThemedView
          ref={columnBorderRef}
          borderColor="foregroundColorMuted60"
          collapsable={false}
          pointerEvents="box-none"
          style={[
            StyleSheet.absoluteFill,
            {
              borderWidth: 0,
              borderRightWidth: Math.max(4, separatorThickSize),
              borderLeftWidth: Math.max(4, separatorThickSize),
              zIndex: 1000,
              opacity: 0,
            },
          ]}
        />
      </ThemedView>
    )
  }),
)
