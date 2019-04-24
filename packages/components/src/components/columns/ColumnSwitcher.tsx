import React from 'react'
import { StyleSheet } from 'react-native'

import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useReduxState } from '../../hooks/use-redux-state'
import { emitter } from '../../libs/emitter'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { fabSize } from '../common/FAB'
import { useColumnFilters } from '../context/ColumnFiltersContext'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { useAppLayout } from '../context/LayoutContext'
import { fabSpacing, shouldRenderFAB } from '../layout/FABRenderer'
import { keyboardShortcutsById } from '../modals/KeyboardShortcutsModal'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedTouchableOpacity } from '../themed/ThemedTouchableOpacity'
import { ThemedView } from '../themed/ThemedView'

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

  leftSwitcher: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: fabSize,
    height: fabSize,
    borderRadius: 0,
    borderTopLeftRadius: fabSize / 2,
    borderBottomLeftRadius: fabSize / 2,
    opacity: 1,
  },

  rightSwitcher: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: fabSize,
    height: fabSize,
    borderRadius: 0,
    borderTopRightRadius: fabSize / 2,
    borderBottomRightRadius: fabSize / 2,
  },
})

export function ColumnSwitcher() {
  const { appViewMode } = useAppViewMode()
  const { focusedColumnId } = useFocusedColumn()
  const { isSharedFiltersOpened } = useColumnFilters()
  const { sizename } = useAppLayout()
  const columnIds = useReduxState(selectors.columnIdsSelector)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)

  if (
    !(
      (appViewMode === 'single-column' && shouldRenderFAB({ sizename })) ||
      (appViewMode === 'multi-column' && isSharedFiltersOpened)
    )
  )
    return null
  if (currentOpenedModal) return null

  const isFirst = focusedColumnId === columnIds[0]
  const isLast = focusedColumnId === columnIds.slice(-1)[0]

  return (
    <ThemedView backgroundColor="backgroundColorMore1" style={styles.container}>
      <ThemedTouchableOpacity
        analyticsCategory="switch-column-previous"
        backgroundColor="backgroundColor"
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
        style={[styles.leftSwitcher, !!isFirst && { opacity: 0.5 }]}
        tooltip={`Previous column (${
          keyboardShortcutsById.selectPreviousColumn.keys[0]
        })`}
      >
        <ThemedIcon
          color="foregroundColor"
          name="chevron-left"
          size={14}
          style={{ lineHeight: fabSize / 2.5, fontSize: fabSize / 2.5 }}
        />
      </ThemedTouchableOpacity>
      <ThemedTouchableOpacity
        analyticsCategory="switch-column-next"
        backgroundColor="backgroundColor"
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
        style={[styles.rightSwitcher, isLast && { opacity: 0.5 }]}
        tooltip={`Next column (${
          keyboardShortcutsById.selectNextColumn.keys[0]
        })`}
      >
        <ThemedIcon
          color="foregroundColor"
          name="chevron-right"
          size={14}
          style={{ lineHeight: fabSize / 2.5, fontSize: fabSize / 2.5 }}
        />
      </ThemedTouchableOpacity>
    </ThemedView>
  )
}
