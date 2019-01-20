import React, { Ref } from 'react'
import { StyleSheet, View } from 'react-native'

import { Column as ColumnType } from '@devhub/core'
import { useTransition } from 'react-spring/native-hooks'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../libs/platform'
import { SpringAnimatedTouchableOpacity } from '../animated/spring/SpringAnimatedTouchableOpacity'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { AccordionView } from '../common/AccordionView'
import { fabSize } from '../common/FAB'
import { useAppLayout } from '../context/LayoutContext'
import { fabSpacing } from '../layout/FABRenderer'
import { ColumnOptions } from './ColumnOptions'

export interface ColumnOptionsRendererProps {
  accordionRef: Ref<AccordionView>
  close: () => void
  column: ColumnType
  columnIndex: number
  containerHeight: number
  visible: boolean
}

export const ColumnOptionsRenderer = React.memo(
  (props: ColumnOptionsRendererProps) => {
    const {
      accordionRef,
      close,
      column,
      columnIndex,
      containerHeight,
      visible,
    } = props

    const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()
    const { sizename } = useAppLayout()

    const overlayTransition = useTransition<boolean, any>({
      native: true,
      reset: true,
      unique: true,
      items: visible ? [true] : [],
      keys: () => 'column-options-overlay',
      config: { duration: 200, precision: 0.01 },
      from: { opacity: 0 },
      enter: { opacity: 0.75 },
      leave: { opacity: 0 },
    })[0]

    const isFabVisible = sizename < '3-large'

    return (
      <>
        {!!overlayTransition && (
          <SpringAnimatedView
            collapsable={false}
            style={{
              ...StyleSheet.absoluteFillObject,
              ...overlayTransition.props,
              zIndex: 200,
            }}
          >
            <SpringAnimatedTouchableOpacity
              analyticsAction="close_via_overlay"
              analyticsLabel="column_options"
              activeOpacity={1}
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: springAnimatedTheme.backgroundColor,
                zIndex: 200,
                ...Platform.select({ web: { cursor: 'default' } as any }),
              }}
              onPress={() => close()}
            />
          </SpringAnimatedView>
        )}

        <View
          collapsable={false}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 200,
          }}
        >
          <AccordionView ref={accordionRef} property="height">
            {!!visible && (
              <ColumnOptions
                availableHeight={
                  containerHeight -
                  (isFabVisible ? fabSize + 2 * fabSpacing : 0)
                }
                column={column}
                columnIndex={columnIndex}
              />
            )}
          </AccordionView>
        </View>
      </>
    )
  },
)
