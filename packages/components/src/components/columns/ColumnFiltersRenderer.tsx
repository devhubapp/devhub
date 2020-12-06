import { constants } from '@devhub/core'
import React, { useCallback, useState } from 'react'
import { StyleSheet } from 'react-native'

import { useTransition } from '@react-spring/native'
import { useEmitter } from '../../hooks/use-emitter'
import { useForceRerender } from '../../hooks/use-force-rerender'
import { emitter } from '../../libs/emitter'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { getDefaultReactSpringAnimationConfig } from '../../utils/helpers/animations'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { AccordionView } from '../common/AccordionView'
import { ConditionalWrap } from '../common/ConditionalWrap'
import { useColumnFilters } from '../context/ColumnFiltersContext'
import { getCurrentFocusedColumnId } from '../context/ColumnFocusContext'
import { ThemedTouchableOpacity } from '../themed/ThemedTouchableOpacity'
import { ColumnFilters } from './ColumnFilters'
import { ColumnHeader } from './ColumnHeader'
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

    const close = useCallback(() => {
      focusColumn()

      if (!columnId) return
      emitter.emit('TOGGLE_COLUMN_FILTERS', { columnId, isOpen: false })
    }, [columnId])

    useEmitter(
      'FOCUS_ON_COLUMN',
      (payload) => {
        if (_columnIdOrFocused === 'focused' && columnId !== payload.columnId)
          forceRerender()
      },
      [_columnIdOrFocused, _isLocalFiltersOpened, columnId, close],
    )

    useEmitter(
      'TOGGLE_COLUMN_FILTERS',
      (payload) => {
        if (enableSharedFiltersView) return
        setIsLocalFiltersOpened(
          payload.columnId !== columnId
            ? false
            : typeof payload.isOpen === 'boolean'
            ? payload.isOpen
            : (v) => !v,
        )
      },
      [columnId, enableSharedFiltersView],
    )

    const immediate = constants.DISABLE_ANIMATIONS
    const overlayTransition = useTransition(isOpen, {
      config: getDefaultReactSpringAnimationConfig({ precision: 0.01 }),
      immediate,
      unique: true,
      from: { opacity: 0 },
      enter: { opacity: 0.75 },
      update: { opacity: isOpen ? 0.75 : 0 },
      leave: { opacity: 0 },
    })

    const enableAbsolutePositionAnimation = !!(
      !inlineMode &&
      fixedPosition &&
      fixedWidth
    )

    const absolutePositionTransitionKey = [
      `column-options-renderer-${type === 'shared' ? 'shared' : columnId}`,
    ]
    const absolutePositionTransition = useTransition(true, {
      config: getDefaultReactSpringAnimationConfig({ precision: 1 }),
      immediate: constants.DISABLE_ANIMATIONS,
      unique: true,
      from: { left: 0, right: 0 },
      leave: { left: 0, right: 0 },
      enter: { left: 0, right: 0 },
      update: { left: 0, right: 0 },
      ...(!!(
        enableAbsolutePositionAnimation &&
        !inlineMode &&
        fixedPosition &&
        fixedWidth
      ) &&
        ({
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
        } as {})),
    })

    if (!renderFilter) return null
    if (!columnId) return null

    return absolutePositionTransition(
      ({ left, right }, _item, absolutePositionT) => {
        const fixedPositionSpringValue =
          fixedPosition === 'left'
            ? left
            : fixedPosition === 'right'
            ? right
            : undefined

        return (
          <SpringAnimatedView
            key={absolutePositionT.key}
            style={[
              !inlineMode && sharedStyles.fullWidth,
              sharedStyles.fullHeight,

              !inlineMode && StyleSheet.absoluteFill,
              !inlineMode && {
                opacity:
                  enableAbsolutePositionAnimation &&
                  fixedPositionSpringValue &&
                  fixedWidth
                    ? fixedPositionSpringValue.to((value) =>
                        fixedWidth + value <= 0 ? 0 : 1,
                      )
                    : 1,
                visibility:
                  enableAbsolutePositionAnimation &&
                  fixedPositionSpringValue &&
                  fixedWidth
                    ? fixedPositionSpringValue.to((value) =>
                        fixedWidth + value <= 0 ? 'hidden' : 'visible',
                      )
                    : 'visible',
                zIndex: 200,
              },
            ]}
            pointerEvents={
              // prevent clicking on filters even when they are hidden behind column
              // (only enabled for web desktop because this is causing bugs on ios safari)
              Platform.OS === 'web' &&
              Platform.realOS !== 'ios' &&
              enableAbsolutePositionAnimation &&
              fixedPositionSpringValue &&
              fixedWidth
                ? fixedPositionSpringValue.to((value) =>
                    value < 0 ? 'none' : 'box-none',
                  )
                : 'box-none'
            }
          >
            {!inlineMode &&
              !!close &&
              overlayTransition(({ opacity }, overlayItem) => {
                if (!overlayItem) return null

                return (
                  <SpringAnimatedView
                    key={`${absolutePositionTransitionKey}-overlay-container`}
                    collapsable={false}
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        zIndex: 200,
                        opacity: opacity.to((opacity) =>
                          Math.max(
                            0,
                            Math.min(Number(opacity.toFixed(2)), 0.75),
                          ),
                        ),
                      },
                    ]}
                    pointerEvents="box-none"
                  >
                    <ThemedTouchableOpacity
                      activeOpacity={1}
                      backgroundColor="backgroundColorMore1"
                      style={[
                        StyleSheet.absoluteFill,
                        {
                          zIndex: 200,
                          ...Platform.select({
                            web: { cursor: 'default' } as any,
                          }),
                        },
                      ]}
                      onPress={close && (() => close())}
                      tabIndex={-1}
                    />
                  </SpringAnimatedView>
                )
              })}

            <SpringAnimatedView
              collapsable={false}
              style={[
                !inlineMode && StyleSheet.absoluteFill,
                fixedPosition &&
                  fixedPositionSpringValue && {
                    [fixedPosition]: fixedPositionSpringValue.to((value) =>
                      Math.floor(value),
                    ),
                  },
                !!fixedWidth &&
                  fixedPosition === 'left' && { right: undefined },
                !!fixedWidth &&
                  fixedPosition === 'right' && { left: undefined },
                !!fixedWidth && { width: fixedWidth },
                {
                  zIndex: 200,
                },
              ]}
            >
              {header === 'header' ? (
                <ColumnHeader
                  icon={{ family: 'octicon', name: 'filter' }}
                  title="Filters"
                  right={
                    !inlineMode &&
                    !!close && (
                      <ColumnHeader.Button
                        key="column-flters-close-button"
                        family="octicon"
                        name="x"
                        onPress={() => close()}
                        tooltip="Close"
                      />
                    )
                  }
                  style={{ paddingRight: contentPadding / 2 }}
                />
              ) : header === 'spacing' ? (
                <ColumnHeader
                  avatar={undefined as any}
                  title=""
                  icon={undefined}
                />
              ) : null}

              <ConditionalWrap
                condition={!enableAbsolutePositionAnimation}
                wrap={(children) => (
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
          </SpringAnimatedView>
        )
      },
    )
  },
)

ColumnFiltersRenderer.displayName = 'ColumnFiltersRenderer'
