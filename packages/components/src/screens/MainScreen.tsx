import _ from 'lodash'
import qs from 'qs'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import url from 'url'

import { AppBannerMessage } from '../components/banners/AppBannerMessage'
import { ColumnSeparator } from '../components/columns/ColumnSeparator'
import { ColumnsRenderer } from '../components/columns/ColumnsRenderer'
import { ConditionalWrap } from '../components/common/ConditionalWrap'
import { Screen } from '../components/common/Screen'
import { Separator } from '../components/common/Separator'
import { useFocusedColumn } from '../components/context/ColumnFocusContext'
import {
  APP_LAYOUT_BREAKPOINTS,
  useAppLayout,
} from '../components/context/LayoutContext'
import { FABRenderer } from '../components/layout/FABRenderer'
import { Sidebar } from '../components/layout/Sidebar'
import { ModalRenderer } from '../components/modals/ModalRenderer'
import { useAppVisibility } from '../hooks/use-app-visibility'
import { useEmitter } from '../hooks/use-emitter'
import useKeyPressCallback from '../hooks/use-key-press-callback'
import useMultiKeyPressCallback from '../hooks/use-multi-key-press-callback'
import { useReduxAction } from '../hooks/use-redux-action'
import { useReduxState } from '../hooks/use-redux-state'
import { analytics } from '../libs/analytics'
import { emitter } from '../libs/emitter'
import { Linking } from '../libs/linking'
import { Platform } from '../libs/platform'
import { SafeAreaView } from '../libs/safe-area-view'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { clearQueryStringFromURL } from '../utils/helpers/auth'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
})

export const MainScreen = React.memo(() => {
  const { appOrientation } = useAppLayout()

  const appToken = useReduxState(selectors.appTokenSelector)!
  const columnIds = useReduxState(selectors.columnIdsSelector)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const { focusedColumnId, focusedColumnIndex } = useFocusedColumn()

  const closeAllModals = useReduxAction(actions.closeAllModals)
  const moveColumn = useReduxAction(actions.moveColumn)
  const popModal = useReduxAction(actions.popModal)
  const pushModal = useReduxAction(actions.pushModal)
  const refreshInstallationsRequest = useReduxAction(
    actions.refreshInstallationsRequest,
  )
  const replaceModal = useReduxAction(actions.replaceModal)
  const syncDown = useReduxAction(actions.syncDown)

  const debounceSyncDown = useMemo(() => {
    return _.debounce(syncDown, 5000, {
      leading: true,
      maxWait: 30000,
      trailing: false,
    })
  }, [syncDown])

  const isVisible = useAppVisibility()
  const wasVisible = useRef(isVisible)

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

  // TODO: Use GraphQL Subscriptions, ffs
  useEffect(() => {
    if (isVisible && !wasVisible.current) {
      debounceSyncDown()
    }

    wasVisible.current = isVisible
  }, [isVisible])

  useEffect(() => {
    const handler = ({
      isInitial,
      url: uri,
    }: {
      isInitial?: boolean
      url: string
    }) => {
      const querystring = url.parse(uri).query || ''
      const query = qs.parse(querystring)

      if (!query.installation_id) return

      clearQueryStringFromURL(['installation_id', 'setup_action'])

      if (!isInitial) {
        refreshInstallationsRequest({
          appToken,
          includeInstallationToken: true,
        })
      }
    }

    Linking.addEventListener('url', handler)

    handler({ isInitial: true, url: Linking.getCurrentURL() })

    return () => {
      Linking.removeEventListener('url', handler)
    }
  }, [appToken])

  const horizontalSidebar = appOrientation === 'portrait'

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

  useEmitter(
    'FOCUS_ON_COLUMN',
    () => {
      if (
        keyboardShortcutsParamsRef.current.currentOpenedModal &&
        Dimensions.get('window').width <= APP_LAYOUT_BREAKPOINTS.MEDIUM
      ) {
        closeAllModals()
      }
    },
    [],
  )

  useEffect(() => {
    if (!currentOpenedModal) {
      analytics.trackScreenView('MAIN_SCREEN')
    }
  }, [currentOpenedModal])

  return (
    <Screen statusBarBackgroundThemeColor="header" useSafeArea={false}>
      <AppBannerMessage />

      <View
        style={[
          styles.container,
          {
            flexDirection:
              appOrientation === 'landscape' ? 'row' : 'column-reverse',
          },
        ]}
      >
        <Sidebar
          key="main-screen-sidebar"
          horizontal={horizontalSidebar}
          zIndex={1000}
        />

        {horizontalSidebar ? (
          <Separator horizontal zIndex={1000} />
        ) : (
          <ColumnSeparator zIndex={1000} />
        )}

        <ConditionalWrap
          key="main-screen-content-container-conditional-wrap"
          condition
          wrap={children =>
            appOrientation === 'landscape' ? (
              <SafeAreaView
                key="main-screen-content-container"
                style={styles.innerContainer}
                children={children}
              />
            ) : (
              <View
                key="main-screen-content-container"
                style={styles.innerContainer}
                children={children}
              />
            )
          }
        >
          <ModalRenderer
            key="modal-renderer"
            renderSeparator={!horizontalSidebar}
          />

          <ColumnsRenderer key="columns-renderer" />
          {/* <ColumnArrowSwitcher key="column-arrow-switcher-renderer" /> */}
          <FABRenderer key="fab-renderer" />
        </ConditionalWrap>
      </View>
    </Screen>
  )
})

MainScreen.displayName = 'MainScreen'
