import _ from 'lodash'
import React, { useCallback, useMemo, useRef } from 'react'

import { useFocusedColumn } from '../components/context/ColumnFocusContext'
import useKeyPressCallback from '../hooks/use-key-press-callback'
import useMultiKeyPressCallback from '../hooks/use-multi-key-press-callback'
import { useReduxAction } from '../hooks/use-redux-action'
import { useReduxState } from '../hooks/use-redux-state'
import { emitter } from '../libs/emitter'
import { Platform } from '../libs/platform'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'

export const KeyboardKeyIsPressed = {
  meta: false,
  shift: false,
  alt: false,
}

export const AppKeyboardShortcuts = React.memo(() => {
  const columnIds = useReduxState(selectors.columnIdsSelector)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const { focusedColumnId, focusedColumnIndex } = useFocusedColumn()

  const moveColumn = useReduxAction(actions.moveColumn)
  const popModal = useReduxAction(actions.popModal)
  const pushModal = useReduxAction(actions.pushModal)
  const replaceModal = useReduxAction(actions.replaceModal)

  const keyboardShortcutsParamsRef = useRef({
    currentOpenedModal,
    columnIds,
    focusedColumnId,
    focusedColumnIndex,
  })
  keyboardShortcutsParamsRef.current.currentOpenedModal = currentOpenedModal
  keyboardShortcutsParamsRef.current.columnIds = columnIds
  keyboardShortcutsParamsRef.current.focusedColumnId = focusedColumnId
  keyboardShortcutsParamsRef.current.focusedColumnIndex = focusedColumnIndex

  useKeyPressCallback(
    'Alt',
    useCallback(() => {
      KeyboardKeyIsPressed.alt = true
    }, []),
    useCallback(() => {
      KeyboardKeyIsPressed.alt = false
    }, []),
  )

  useKeyPressCallback(
    'Shift',
    useCallback(() => {
      KeyboardKeyIsPressed.shift = true
    }, []),
    useCallback(() => {
      KeyboardKeyIsPressed.shift = false
    }, []),
  )

  useKeyPressCallback(
    'Meta',
    useCallback(() => {
      KeyboardKeyIsPressed.meta = true
    }, []),
    useCallback(() => {
      KeyboardKeyIsPressed.meta = false
    }, []),
  )

  useKeyPressCallback(
    'Escape',
    useCallback(() => {
      if (
        typeof document !== 'undefined' &&
        document &&
        document.activeElement &&
        (document.activeElement as any).blur
      )
        (document.activeElement as any).blur()

      if (keyboardShortcutsParamsRef.current.currentOpenedModal) popModal()
      else if (Platform.isElectron && window.ipc)
        window.ipc.send('exit-full-screen')
    }, []),
  )

  useKeyPressCallback(
    'n',
    useCallback(() => {
      if (
        !(
          !keyboardShortcutsParamsRef.current.currentOpenedModal ||
          keyboardShortcutsParamsRef.current.currentOpenedModal.name ===
            'SETTINGS'
        )
      )
        return
      replaceModal({ name: 'ADD_COLUMN' })
    }, []),
  )

  useKeyPressCallback(
    'p',
    useCallback(() => {
      if (
        !(
          !keyboardShortcutsParamsRef.current.currentOpenedModal ||
          keyboardShortcutsParamsRef.current.currentOpenedModal.name ===
            'ADD_COLUMN'
        )
      )
        return
      replaceModal({ name: 'SETTINGS' })
    }, []),
  )

  const scrollDown = useCallback(() => {
    if (keyboardShortcutsParamsRef.current.currentOpenedModal) return

    const fixedColumnIndex = Math.max(
      0,
      Math.min(
        keyboardShortcutsParamsRef.current.focusedColumnIndex,
        keyboardShortcutsParamsRef.current.columnIds.length - 1,
      ),
    )

    emitter.emit('SCROLL_DOWN_COLUMN', {
      columnId: keyboardShortcutsParamsRef.current.columnIds[fixedColumnIndex],
      columnIndex: fixedColumnIndex,
    })
  }, [])

  useKeyPressCallback('ArrowDown', scrollDown)
  useKeyPressCallback('j', scrollDown)

  const scrollUp = useCallback(() => {
    if (keyboardShortcutsParamsRef.current.currentOpenedModal) return

    const fixedColumnIndex = Math.max(
      0,
      Math.min(
        keyboardShortcutsParamsRef.current.focusedColumnIndex,
        keyboardShortcutsParamsRef.current.columnIds.length - 1,
      ),
    )

    emitter.emit('SCROLL_UP_COLUMN', {
      columnId: keyboardShortcutsParamsRef.current.columnIds[fixedColumnIndex],
      columnIndex: fixedColumnIndex,
    })
  }, [])

  useKeyPressCallback('ArrowUp', scrollUp)
  useKeyPressCallback('k', scrollUp)

  const scrollLeft = useCallback(() => {
    if (keyboardShortcutsParamsRef.current.currentOpenedModal) return

    emitter.emit('FOCUS_ON_PREVIOUS_COLUMN', {
      animated: true,
      focusOnVisibleItem: true,
      highlight: false,
      scrollTo: true,
    })
  }, [])

  useKeyPressCallback('ArrowLeft', scrollLeft)
  useKeyPressCallback('h', scrollLeft)

  const scrollRight = useCallback(() => {
    if (keyboardShortcutsParamsRef.current.currentOpenedModal) return

    emitter.emit('FOCUS_ON_NEXT_COLUMN', {
      animated: true,
      focusOnVisibleItem: true,
      highlight: false,
      scrollTo: true,
    })
  }, [])

  useKeyPressCallback('ArrowRight', scrollRight)
  useKeyPressCallback('l', scrollRight)

  const scrollToColumnNumber = useCallback((n: number) => {
    if (keyboardShortcutsParamsRef.current.currentOpenedModal) return

    if (n === 0) {
      const columnIndex =
        keyboardShortcutsParamsRef.current.columnIds.length - 1
      emitter.emit('FOCUS_ON_COLUMN', {
        animated: true,
        columnId: keyboardShortcutsParamsRef.current.columnIds[columnIndex],
        highlight: true,
        scrollTo: true,
      })
      return
    }

    if (n >= 1 && n <= keyboardShortcutsParamsRef.current.columnIds.length) {
      const columnIndex = n - 1
      emitter.emit('FOCUS_ON_COLUMN', {
        animated: true,
        columnId: keyboardShortcutsParamsRef.current.columnIds[columnIndex],
        highlight: true,
        scrollTo: true,
      })
      return
    }
  }, [])

  useKeyPressCallback(
    '1',
    useMemo(() => scrollToColumnNumber.bind(null, 1), []),
  )
  useKeyPressCallback(
    '2',
    useMemo(() => scrollToColumnNumber.bind(null, 2), []),
  )
  useKeyPressCallback(
    '3',
    useMemo(() => scrollToColumnNumber.bind(null, 3), []),
  )
  useKeyPressCallback(
    '4',
    useMemo(() => scrollToColumnNumber.bind(null, 4), []),
  )
  useKeyPressCallback(
    '5',
    useMemo(() => scrollToColumnNumber.bind(null, 5), []),
  )
  useKeyPressCallback(
    '6',
    useMemo(() => scrollToColumnNumber.bind(null, 6), []),
  )
  useKeyPressCallback(
    '7',
    useMemo(() => scrollToColumnNumber.bind(null, 7), []),
  )
  useKeyPressCallback(
    '8',
    useMemo(() => scrollToColumnNumber.bind(null, 8), []),
  )
  useKeyPressCallback(
    '9',
    useMemo(() => scrollToColumnNumber.bind(null, 9), []),
  )
  useKeyPressCallback(
    '0',
    useMemo(() => scrollToColumnNumber.bind(null, 0), []),
  )

  const moveColumnTopOrLeft = useCallback(() => {
    if (keyboardShortcutsParamsRef.current.currentOpenedModal) return
    if (!keyboardShortcutsParamsRef.current.focusedColumnId) return

    moveColumn({
      columnId: keyboardShortcutsParamsRef.current.focusedColumnId,
      columnIndex: keyboardShortcutsParamsRef.current.focusedColumnIndex - 1,
    })
  }, [])
  useMultiKeyPressCallback(['Alt', 'ArrowUp'], moveColumnTopOrLeft)
  useMultiKeyPressCallback(['Alt', 'ArrowLeft'], moveColumnTopOrLeft)

  const moveColumnBottomOrRight = useCallback(() => {
    if (keyboardShortcutsParamsRef.current.currentOpenedModal) return
    if (!keyboardShortcutsParamsRef.current.focusedColumnId) return

    moveColumn({
      columnId: keyboardShortcutsParamsRef.current.focusedColumnId,
      columnIndex: keyboardShortcutsParamsRef.current.focusedColumnIndex + 1,
    })
  }, [])
  useMultiKeyPressCallback(['Alt', 'ArrowDown'], moveColumnBottomOrRight)
  useMultiKeyPressCallback(['Alt', 'ArrowRight'], moveColumnBottomOrRight)

  const showKeyboardShortcuts = useCallback(() => {
    pushModal({ name: 'KEYBOARD_SHORTCUTS' })
  }, [])

  useKeyPressCallback('?', showKeyboardShortcuts)
  useMultiKeyPressCallback(['Shift', '?'], showKeyboardShortcuts)

  return null
})

AppKeyboardShortcuts.displayName = 'AppKeyboardShortcuts'
