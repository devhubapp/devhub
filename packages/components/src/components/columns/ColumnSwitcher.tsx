import React from 'react'
import { StyleSheet } from 'react-native'

import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxState } from '../../hooks/use-redux-state'
import { emitter } from '../../libs/emitter'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { SpringAnimatedIcon } from '../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedTouchableOpacity } from '../animated/spring/SpringAnimatedTouchableOpacity'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { fabSize } from '../common/FAB'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { useAppLayout } from '../context/LayoutContext'
import { fabSpacing, shouldRenderFAB } from '../layout/FABRenderer'
import { keyboardShortcutsById } from '../modals/KeyboardShortcutsModal'

const spacing = fabSpacing

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing,
    left: contentPadding,
    flexDirection: 'row',
    borderRadius: fabSize / 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    overflow: 'hidden',
    zIndex: 1000,
  },
})

export function ColumnSwitcher() {
  const columnIds = useReduxState(selectors.columnIdsSelector)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const { focusedColumnId: _focusedColumnId } = useFocusedColumn()
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()
  const { appViewMode } = useAppViewMode()
  const { sizename } = useAppLayout()

  const focusedColumnId = _focusedColumnId || columnIds[0]

  if (!(appViewMode === 'single-column' && shouldRenderFAB(sizename)))
    return null
  if (currentOpenedModal) return null

  const isFirst = focusedColumnId === columnIds[0]
  const isLast = focusedColumnId === columnIds.slice(-1)[0]

  return (
    <SpringAnimatedView
      style={[
        styles.container,
        {
          backgroundColor: springAnimatedTheme.backgroundColorMore1,
        },
      ]}
    >
      <SpringAnimatedTouchableOpacity
        analyticsCategory="switch-column-previous"
        hitSlop={{
          top: contentPadding / 2,
          bottom: contentPadding / 2,
          left: contentPadding,
        }}
        onPress={() => {
          emitter.emit('FOCUS_ON_PREVIOUS_COLUMN', {
            highlight: isFirst,
          })
        }}
        style={[
          {
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            width: fabSize,
            height: fabSize,
            borderRadius: 0,
            borderTopLeftRadius: fabSize / 2,
            borderBottomLeftRadius: fabSize / 2,
            backgroundColor: springAnimatedTheme.backgroundColor,
          },
          isFirst && { opacity: 0.5 },
        ]}
        tooltip={`Previous column (${
          keyboardShortcutsById.selectPreviousColumn.keys[0]
        })`}
      >
        <SpringAnimatedIcon
          name="chevron-left"
          size={14}
          style={{
            lineHeight: fabSize / 2.5,
            fontSize: fabSize / 2.5,
            color: springAnimatedTheme.foregroundColor,
          }}
        />
      </SpringAnimatedTouchableOpacity>
      <SpringAnimatedTouchableOpacity
        analyticsCategory="switch-column-next"
        hitSlop={{
          top: contentPadding / 2,
          bottom: contentPadding / 2,
          right: contentPadding,
        }}
        onPress={() => {
          emitter.emit('FOCUS_ON_NEXT_COLUMN', {
            highlight: isLast,
          })
        }}
        style={[
          {
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            width: fabSize,
            height: fabSize,
            borderRadius: 0,
            borderTopRightRadius: fabSize / 2,
            borderBottomRightRadius: fabSize / 2,
            backgroundColor: springAnimatedTheme.backgroundColor,
          },
          isLast && { opacity: 0.5 },
        ]}
        tooltip={`Next column (${
          keyboardShortcutsById.selectNextColumn.keys[0]
        })`}
      >
        <SpringAnimatedIcon
          name="chevron-right"
          size={14}
          style={{
            lineHeight: fabSize / 2.5,
            fontSize: fabSize / 2.5,
            color: springAnimatedTheme.foregroundColor,
          }}
        />
      </SpringAnimatedTouchableOpacity>
    </SpringAnimatedView>
  )
}
