import React, { Fragment, useState } from 'react'
import { StyleSheet } from 'react-native'

import { constants } from '@devhub/core'
import { useTransition } from 'react-spring/native'
import { useEmitter } from '../../hooks/use-emitter'
import { useForceRerender } from '../../hooks/use-force-rerender'
import { emitter } from '../../libs/emitter'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { columnHeaderHeight, contentPadding } from '../../styles/variables'
import { getDefaultReactSpringAnimationConfig } from '../../utils/helpers/animations'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { AccordionView } from '../common/AccordionView'
import { ConditionalWrap } from '../common/ConditionalWrap'
import { Spacer } from '../common/Spacer'
import { useColumnFilters } from '../context/ColumnFiltersContext'
import { getCurrentFocusedColumnId } from '../context/ColumnFocusContext'
import { ThemedTouchableOpacity } from '../themed/ThemedTouchableOpacity'
import { ColumnFilters } from './ColumnFilters'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnSeparator } from './ColumnSeparator'

export interface ColumnFiltersRendererProps {
  columnId: string | 'focused'
  fixedPosition?: 'left' | 'right'
  forceOpenAll?: boolean
  header?: 'header' | 'spacing' | 'none'
  startWithFiltersExpanded?: boolean
  type: 'shared' | 'local'
}

export const ColumnFiltersRenderer = React.memo(
  (props: ColumnFiltersRendererProps) => {
    const {
      columnId: _columnIdOrFocused,
      fixedPosition,
      forceOpenAll,
      header,
      startWithFiltersExpanded,
      type,
    } = props

    const columnId =
      _columnIdOrFocused === 'focused'
        ? getCurrentFocusedColumnId()
        : _columnIdOrFocused

    const forceRerender = useForceRerender()

    const [_isLocalFiltersOpened, setIsLocalFiltersOpened] = useState(false)

    const {
      enableSharedFiltersView,
      fixedWidth,
      inlineMode,
      isSharedFiltersOpened: _isSharedFiltersOpened,
    } = useColumnFilters()

    const isOpen = enableSharedFiltersView
      ? _isSharedFiltersOpened
      : _isLocalFiltersOpened
    const renderFilter = !!(
      (type === 'shared' && enableSharedFiltersView) ||
      (type === 'local' && !enableSharedFiltersView && !inlineMode)
    )

    function focusColumn() {
      if (_columnIdOrFocused === 'focused') return

      if (!columnId) return

      emitter.emit('FOCUS_ON_COLUMN', {
        columnId,
        highlight: false,
        scrollTo: false,
      })
    }

    const close = () => {
      focusColumn()

      if (!columnId) return
      emitter.emit('TOGGLE_COLUMN_FILTERS', { columnId })
    }

    useEmitter(
      'FOCUS_ON_COLUMN',
      payload => {
        if (_columnIdOrFocused === 'focused' && columnId !== payload.columnId)
          forceRerender()
      },
      [_columnIdOrFocused, columnId],
    )

    useEmitter(
      'TOGGLE_COLUMN_FILTERS',
      payload => {
        if (payload.columnId !== columnId) return
        if (enableSharedFiltersView) return
        setIsLocalFiltersOpened(v => !v)
      },
      [columnId, enableSharedFiltersView],
    )

    const immediate = constants.DISABLE_ANIMATIONS
    const overlayTransition = useTransition<boolean, any>(
      isOpen ? [true] : [],
      isOpen ? ['column-options-overlay'] : [],
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
      [true],
      [`column-options-renderer-${type === 'shared' ? 'shared' : columnId}`],
      enableAbsolutePositionAnimation &&
        (!inlineMode && fixedPosition && fixedWidth)
        ? {
            config: getDefaultReactSpringAnimationConfig({ precision: 1 }),
            immediate: constants.DISABLE_ANIMATIONS,
            unique: true,
            from: {
              [fixedPosition]: -fixedWidth,
            },
            leave: {
              [fixedPosition]: -fixedWidth,
            },
            enter: {
              [fixedPosition]: isOpen ? 0 : -fixedWidth,
            },
            update: {
              [fixedPosition]: isOpen ? 0 : -fixedWidth,
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

    if (!renderFilter) return null
    if (!columnId) return null

    const key =
      (absolutePositionTransition && absolutePositionTransition.key) ||
      'column-options-renderer'
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
                opacity: overlayTransition.props.opacity.to((opacity: number) =>
                  Number(opacity.toFixed(2)),
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
          style={[
            !inlineMode && StyleSheet.absoluteFill,
            !inlineMode && {
              opacity:
                enableAbsolutePositionAnimation &&
                absolutePositionTransition &&
                absolutePositionTransition.props &&
                fixedPosition &&
                fixedWidth
                  ? fixedPosition === 'left' || fixedPosition === 'right'
                    ? absolutePositionTransition.props[fixedPosition].to(
                        (value: number) => (fixedWidth + value <= 0 ? 0 : 1),
                      )
                    : 1
                  : 1,
              visibility:
                enableAbsolutePositionAnimation &&
                absolutePositionTransition &&
                absolutePositionTransition.props &&
                fixedPosition &&
                fixedWidth
                  ? fixedPosition === 'left' || fixedPosition === 'right'
                    ? absolutePositionTransition.props[fixedPosition].to(
                        (value: number) =>
                          fixedWidth + value <= 0 ? 'hidden' : 'visible',
                      )
                    : 'visible'
                  : 'visible',
            },
            enableAbsolutePositionAnimation &&
              absolutePositionTransition &&
              absolutePositionTransition.props &&
              absolutePositionTransition.props.left && {
                left: absolutePositionTransition.props.left.to((left: number) =>
                  Math.floor(left),
                ),
              },
            enableAbsolutePositionAnimation &&
              absolutePositionTransition &&
              absolutePositionTransition.props &&
              absolutePositionTransition.props.right && {
                right: absolutePositionTransition.props.right.to(
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
            absolutePositionTransition &&
            absolutePositionTransition.props &&
            fixedPosition &&
            fixedWidth
              ? absolutePositionTransition.props[fixedPosition].to(
                  (value: number) => (value < 0 ? 'none' : 'box-none'),
                )
              : 'box-none'
          }
        >
          {header === 'header' ? (
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
          ) : header === 'spacing' ? (
            <Spacer height={columnHeaderHeight} pointerEvents="none" />
          ) : null}

          <ConditionalWrap
            condition={!enableAbsolutePositionAnimation}
            wrap={children => (
              <AccordionView isOpen={isOpen}>{children}</AccordionView>
            )}
          >
            <ColumnFilters
              key={`column-options-${columnId}`}
              columnId={columnId}
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
