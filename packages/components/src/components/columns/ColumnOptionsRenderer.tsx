import React from 'react'
import { StyleSheet } from 'react-native'

import { useSpring, useTransition } from 'react-spring/native'
import { useColumn } from '../../hooks/use-column'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { columnHeaderHeight } from '../../styles/variables'
import { getDefaultReactSpringAnimationConfig } from '../../utils/helpers/animations'
import { SpringAnimatedTouchableOpacity } from '../animated/spring/SpringAnimatedTouchableOpacity'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { AccordionView } from '../common/AccordionView'
import { ConditionalWrap } from '../common/ConditionalWrap'
import { fabSize } from '../common/FAB'
import { Spacer } from '../common/Spacer'
import { useAppLayout } from '../context/LayoutContext'
import { fabSpacing, shouldRenderFAB } from '../layout/FABRenderer'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptions } from './ColumnOptions'

export interface ColumnOptionsRendererProps {
  close: (() => void) | undefined
  columnId: string
  containerHeight: number
  fixedPosition?: 'left' | 'right'
  fixedWidth?: number | undefined
  forceOpenAll?: boolean
  inlineMode?: boolean
  isOpened: boolean
  renderHeader?: 'yes' | 'no' | 'spacing-only'
  startWithFiltersExpanded?: boolean
}

export const ColumnOptionsRenderer = React.memo(
  (props: ColumnOptionsRendererProps) => {
    const {
      close,
      columnId,
      containerHeight,
      fixedPosition,
      fixedWidth,
      forceOpenAll,
      inlineMode,
      isOpened,
      renderHeader,
      startWithFiltersExpanded,
    } = props

    const { sizename } = useAppLayout()
    const { column, columnIndex } = useColumn(columnId)
    const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

    const immediate = Platform.realOS === 'android'
    const overlayTransition = useTransition<boolean, any>(
      isOpened ? [true] : [],
      () => 'column-options-overlay',
      {
        reset: true,
        unique: true,
        config: getDefaultReactSpringAnimationConfig(),
        immediate,
        from: { opacity: 0 },
        enter: { opacity: 0.75 },
        leave: { opacity: 0 },
      },
    )[0]

    const enableAbsolutePositionAnimation = !!(
      !inlineMode &&
      fixedPosition &&
      fixedWidth
    )

    const absolutePositionAnimation = useSpring<any>(
      !inlineMode && fixedPosition && fixedWidth
        ? {
            config: getDefaultReactSpringAnimationConfig(),
            from: { [fixedPosition]: -fixedWidth },
            to: { [fixedPosition]: isOpened ? 0 : -fixedWidth },
          }
        : {
            config: getDefaultReactSpringAnimationConfig(),
            from: { left: 0, right: 0 },
            to: { left: 0, right: 0 },
          },
    )

    if (!column) return null

    const availableHeight =
      containerHeight -
      (shouldRenderFAB({ sizename, isColumnOptionsVisible: true })
        ? fabSize + 2 * fabSpacing
        : 0)

    return (
      <>
        {!!overlayTransition && !inlineMode && !!close && (
          <SpringAnimatedView
            collapsable={false}
            style={[
              StyleSheet.absoluteFillObject,
              {
                top:
                  renderHeader === 'yes' || renderHeader === 'spacing-only'
                    ? columnHeaderHeight
                    : 0,
              },
              overlayTransition.props,
              { zIndex: 200 },
            ]}
            pointerEvents="box-none"
          >
            <SpringAnimatedTouchableOpacity
              analyticsAction="close_via_overlay"
              analyticsLabel="column_options"
              activeOpacity={1}
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: springAnimatedTheme.backgroundColorMore1,
                zIndex: 200,
                ...Platform.select({ web: { cursor: 'default' } as any }),
              }}
              onPress={close && (() => close())}
              tabIndex={-1}
            />
          </SpringAnimatedView>
        )}

        <SpringAnimatedView
          collapsable={false}
          style={[
            !inlineMode && {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            },
            enableAbsolutePositionAnimation && absolutePositionAnimation,
            !!fixedWidth && fixedPosition === 'left' && { right: undefined },
            !!fixedWidth && fixedPosition === 'right' && { left: undefined },
            !!fixedWidth && { width: fixedWidth },
            {
              zIndex: 200,
            },
          ]}
          pointerEvents="box-none"
        >
          {renderHeader === 'yes' ? (
            <ColumnHeader pointerEvents="none">
              <ColumnHeaderItem
                analyticsLabel={undefined}
                fixedIconSize
                iconName="settings"
                subtitle=""
                title="filters"
                style={[sharedStyles.flex, { alignItems: 'flex-start' }]}
                tooltip={undefined}
              />
            </ColumnHeader>
          ) : renderHeader === 'spacing-only' ? (
            <Spacer height={columnHeaderHeight} pointerEvents="none" />
          ) : null}

          <ConditionalWrap
            condition={!enableAbsolutePositionAnimation}
            wrap={children => (
              <AccordionView isOpen={isOpened}>{children}</AccordionView>
            )}
          >
            <ColumnOptions
              key={`column-options-${column.type}`}
              availableHeight={
                availableHeight -
                (renderHeader === 'yes' || renderHeader === 'spacing-only'
                  ? columnHeaderHeight
                  : 0)
              }
              column={column}
              columnIndex={columnIndex}
              forceOpenAll={forceOpenAll}
              fullHeight={inlineMode || !!fixedWidth}
              startWithFiltersExpanded={startWithFiltersExpanded}
            />
          </ConditionalWrap>
        </SpringAnimatedView>
      </>
    )
  },
)
