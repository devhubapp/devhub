import React, { Fragment } from 'react'
import { StyleSheet } from 'react-native'

import { constants } from '@devhub/core'
import { useTransition } from 'react-spring/native'
import { useColumn } from '../../hooks/use-column'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { columnHeaderHeight } from '../../styles/variables'
import { getDefaultReactSpringAnimationConfig } from '../../utils/helpers/animations'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { AccordionView } from '../common/AccordionView'
import { ConditionalWrap } from '../common/ConditionalWrap'
import { fabSize } from '../common/FAB'
import { Spacer } from '../common/Spacer'
import { useColumnFilters } from '../context/ColumnFiltersContext'
import { useAppLayout } from '../context/LayoutContext'
import { fabSpacing, shouldRenderFAB } from '../layout/FABRenderer'
import { ThemedTouchableOpacity } from '../themed/ThemedTouchableOpacity'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptions } from './ColumnOptions'
import { ColumnSeparator } from './ColumnSeparator'

export interface ColumnOptionsRendererProps {
  close: (() => void) | undefined
  columnId: string
  containerHeight: number
  fixedPosition?: 'left' | 'right'
  fixedWidth?: number | undefined
  forceOpenAll?: boolean
  inlineMode?: boolean
  isOpen: boolean
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
      isOpen,
      renderHeader,
      startWithFiltersExpanded,
    } = props

    const { sizename } = useAppLayout()
    const { column, columnIndex } = useColumn(columnId)

    const { enableSharedFiltersView } = useColumnFilters()

    const immediate = constants.DISABLE_ANIMATIONS

    const overlayTransition = useTransition<boolean, any>(
      isOpen ? [true] : [],
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

    const absolutePositionTransitions = useTransition<boolean, any>(
      [true], // isOpen || enableSharedFiltersView ? [true] : [],
      isOpen
        ? [
            `column-options-renderer-${
              enableSharedFiltersView ? 'shared' : columnId
            }`,
          ]
        : [],
      enableAbsolutePositionAnimation &&
        (!inlineMode && fixedPosition && fixedWidth)
        ? {
            config: getDefaultReactSpringAnimationConfig(),
            immediate: constants.DISABLE_ANIMATIONS,
            unique: true,
            from: {
              [fixedPosition]:
                -fixedWidth - Platform.select({ default: 0, ios: 40 }),
            },
            leave: {
              [fixedPosition]:
                -fixedWidth - Platform.select({ default: 0, ios: 40 }),
            },
            enter: {
              [fixedPosition]: isOpen
                ? 0
                : -fixedWidth - Platform.select({ default: 0, ios: 40 }),
            },
            update: {
              [fixedPosition]: isOpen
                ? 0
                : -fixedWidth - Platform.select({ default: 0, ios: 40 }),
            },
          }
        : {
            config: getDefaultReactSpringAnimationConfig(),
            immediate: constants.DISABLE_ANIMATIONS,
            unique: true,
            from: { left: 0, right: 0 },
            leave: { left: 0, right: 0 },
            enter: { left: 0, right: 0 },
            update: { left: 0, right: 0 },
          },
    )
    const absolutePositionTransition = absolutePositionTransitions[0] as
      | typeof absolutePositionTransitions[0]
      | undefined

    if (!column) return null

    if (!(absolutePositionTransition && absolutePositionTransition.item))
      return null

    const availableHeight =
      containerHeight -
      (shouldRenderFAB({ sizename, isColumnOptionsVisible: true })
        ? fabSize + 2 * fabSpacing
        : 0)

    const key = absolutePositionTransition.key || 'column-options-renderer'
    return (
      <Fragment key={`${key}-inner-container`}>
        {!!overlayTransition && !inlineMode && !!close && (
          <SpringAnimatedView
            key={`${key}-overlay-container`}
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
            <ThemedTouchableOpacity
              analyticsAction="close_via_overlay"
              analyticsLabel="column_options"
              activeOpacity={1}
              backgroundColor="backgroundColorMore1"
              style={{
                ...StyleSheet.absoluteFillObject,
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
              opacity:
                enableAbsolutePositionAnimation &&
                absolutePositionTransition.props &&
                fixedPosition &&
                fixedWidth
                  ? fixedPosition === 'left' || fixedPosition === 'right'
                    ? absolutePositionTransition.props[
                        fixedPosition
                      ].interpolate((value: number) =>
                        fixedWidth + value <= 0 ? 0 : 1,
                      )
                    : 1
                  : 1,
              visibility:
                enableAbsolutePositionAnimation &&
                absolutePositionTransition.props &&
                fixedPosition &&
                fixedWidth
                  ? fixedPosition === 'left' || fixedPosition === 'right'
                    ? absolutePositionTransition.props[
                        fixedPosition
                      ].interpolate((value: number) =>
                        fixedWidth + value <= 0 ? 'hidden' : 'visible',
                      )
                    : 'visible'
                  : 'visible',
            },
            enableAbsolutePositionAnimation && absolutePositionTransition.props,
            !!fixedWidth && fixedPosition === 'left' && { right: undefined },
            !!fixedWidth && fixedPosition === 'right' && { left: undefined },
            !!fixedWidth && { width: fixedWidth },
            {
              zIndex: 200,
            },
          ]}
          pointerEvents={
            // prevent clicking on filters even when they are hidden behind column
            // (only enabled for web desktop because this is causing bugs on ios safari)
            Platform.realOS === 'web' &&
            enableAbsolutePositionAnimation &&
            absolutePositionTransition.props &&
            fixedPosition &&
            fixedWidth
              ? absolutePositionTransition.props[fixedPosition].interpolate(
                  (value: number) => (value < 0 ? 'none' : 'box-none'),
                )
              : 'box-none'
          }
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
              <AccordionView isOpen={isOpen}>{children}</AccordionView>
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

        {!!inlineMode && <ColumnSeparator />}
      </Fragment>
    )
  },
)

ColumnOptionsRenderer.displayName = 'ColumnOptionsRenderer'
