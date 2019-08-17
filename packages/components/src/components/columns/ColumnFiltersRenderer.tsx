import React, { Fragment } from 'react'
import { StyleSheet } from 'react-native'

import { constants } from '@devhub/core'
import { useTransition } from 'react-spring/native'
import { useColumn } from '../../hooks/use-column'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { columnHeaderHeight, contentPadding } from '../../styles/variables'
import { getDefaultReactSpringAnimationConfig } from '../../utils/helpers/animations'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { AccordionView } from '../common/AccordionView'
import { ConditionalWrap } from '../common/ConditionalWrap'
import { Spacer } from '../common/Spacer'
import { useColumnFilters } from '../context/ColumnFiltersContext'
import { ThemedTouchableOpacity } from '../themed/ThemedTouchableOpacity'
import { ColumnFilters } from './ColumnFilters'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnSeparator } from './ColumnSeparator'

export interface ColumnFiltersRendererProps {
  close: (() => void) | undefined
  columnId: string
  fixedPosition?: 'left' | 'right'
  fixedWidth?: number | undefined
  forceOpenAll?: boolean
  inlineMode?: boolean
  isOpen: boolean
  shouldRenderHeader?: 'yes' | 'no' | 'spacing-only'
  startWithFiltersExpanded?: boolean
}

export const ColumnFiltersRenderer = React.memo(
  (props: ColumnFiltersRendererProps) => {
    const {
      close,
      columnId,
      fixedPosition,
      fixedWidth,
      forceOpenAll,
      inlineMode,
      isOpen,
      shouldRenderHeader,
      startWithFiltersExpanded,
    } = props

    const { column, columnIndex } = useColumn(columnId)

    const { enableSharedFiltersView } = useColumnFilters()

    const immediate = constants.DISABLE_ANIMATIONS

    const overlayTransition = useTransition<boolean, any>(
      isOpen ? [true] : [],
      () => 'column-options-overlay',
      {
        reset: false,
        unique: true,
        config: getDefaultReactSpringAnimationConfig({ precision: 0.01 }),
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
      isOpen || enableSharedFiltersView ? [true] : [],
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
            config: getDefaultReactSpringAnimationConfig({ precision: 1 }),
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
            config: getDefaultReactSpringAnimationConfig({ precision: 1 }),
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

    const key = absolutePositionTransition.key || 'column-options-renderer'
    return (
      <Fragment key={`${key}-inner-container`}>
        {!!overlayTransition && !inlineMode && !!close && (
          <SpringAnimatedView
            key={`${key}-overlay-container`}
            collapsable={false}
            style={[
              StyleSheet.absoluteFill,
              {
                zIndex: 200,
                opacity: overlayTransition.props.opacity.interpolate(
                  (opacity: number) => Number(opacity.toFixed(2)),
                ),
              },
            ]}
            pointerEvents="box-none"
          >
            <ThemedTouchableOpacity
              analyticsAction="close_via_overlay"
              analyticsLabel="column_filters"
              activeOpacity={1}
              backgroundColor="backgroundColorMore1"
              style={[
                StyleSheet.absoluteFill,
                {
                  zIndex: 200,
                  ...Platform.select({ web: { cursor: 'default' } as any }),
                },
              ]}
              onPress={close && (() => close())}
              tabIndex={-1}
            />
          </SpringAnimatedView>
        )}

        <SpringAnimatedView
          collapsable={false}
          hidden={
            enableAbsolutePositionAnimation &&
            absolutePositionTransition.props &&
            fixedPosition &&
            fixedWidth
              ? fixedPosition === 'left' || fixedPosition === 'right'
                ? // TODO: Fix types
                  absolutePositionTransition.props[fixedPosition].interpolate(
                    (value: number) =>
                      (fixedWidth + value <= 0 ? true : false) as any,
                  )
                : false
              : false
          }
          style={[
            !inlineMode && StyleSheet.absoluteFill,
            !inlineMode && {
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
            enableAbsolutePositionAnimation &&
              absolutePositionTransition.props.left && {
                left: absolutePositionTransition.props.left.interpolate(
                  (left: number) => Math.floor(left),
                ),
              },
            enableAbsolutePositionAnimation &&
              absolutePositionTransition.props.right && {
                right: absolutePositionTransition.props.right.interpolate(
                  (right: number) => Math.floor(right),
                ),
              },
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
            Platform.OS === 'web' &&
            Platform.realOS !== 'ios' &&
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
          {shouldRenderHeader === 'yes' ? (
            <ColumnHeader>
              <ColumnHeaderItem
                analyticsLabel={undefined}
                fixedIconSize
                iconName="settings"
                subtitle=""
                title="filters"
                style={[sharedStyles.flex, { alignItems: 'flex-start' }]}
                tooltip={undefined}
              />

              <Spacer flex={1} />

              {!inlineMode && !!close && (
                <ColumnHeaderItem
                  key="column-flters-close-button"
                  analyticsAction={undefined}
                  analyticsLabel={undefined}
                  fixedIconSize
                  iconName="x"
                  onPress={() => close()}
                  style={{
                    paddingHorizontal: contentPadding / 3,
                  }}
                  tooltip="Close"
                />
              )}
            </ColumnHeader>
          ) : shouldRenderHeader === 'spacing-only' ? (
            <Spacer height={columnHeaderHeight} pointerEvents="none" />
          ) : null}

          <ConditionalWrap
            condition={!enableAbsolutePositionAnimation}
            wrap={children => (
              <AccordionView isOpen={isOpen}>{children}</AccordionView>
            )}
          >
            <ColumnFilters
              key={`column-options-${column.type}`}
              column={column}
              columnIndex={columnIndex}
              forceOpenAll={forceOpenAll}
              startWithFiltersExpanded={startWithFiltersExpanded}
            />
          </ConditionalWrap>
        </SpringAnimatedView>

        {!!inlineMode && <ColumnSeparator />}
      </Fragment>
    )
  },
)

ColumnFiltersRenderer.displayName = 'ColumnFiltersRenderer'
