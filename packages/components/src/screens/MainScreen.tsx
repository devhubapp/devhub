import _ from 'lodash'
import qs from 'qs'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native'
import url from 'url'

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
import { ColumnsContainer } from '../containers/ColumnsContainer'
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
  const focusedColumnId = useFocusedColumn()

  const closeAllModals = useReduxAction(actions.closeAllModals)
  const moveColumn = useReduxAction(actions.moveColumn)
  const popModal = useReduxAction(actions.popModal)
  const pushModal = useReduxAction(actions.pushModal)
  const refreshInstallationsRequest = useReduxAction(
    actions.refreshInstallationsRequest,
  )
  const replaceModal = useReduxAction(actions.replaceModal)
  const syncDown = useReduxAction(actions.syncDown)

  const focusedColumnIndex = focusedColumnId
    ? columnIds.findIndex(id => id === focusedColumnId)
    : -1

  const debounceSyncDown = useMemo(() => {
    return _.debounce(syncDown, 5000, {
      leading: true,
      maxWait: 30000,
      trailing: false,
    })
  }, [syncDown])

  const isVisible = useAppVisibility()
  const wasVisible = useRef(isVisible)

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

      if (currentOpenedModal) popModal()
      else if (Platform.isElectron && window.ipc)
        window.ipc.send('exit-full-screen')
    }, [currentOpenedModal]),
  )

  useKeyPressCallback(
    'n',
    useCallback(() => {
      if (!(!currentOpenedModal || currentOpenedModal.name === 'SETTINGS'))
        return
      replaceModal({ name: 'ADD_COLUMN' })
    }, [currentOpenedModal]),
  )

  useKeyPressCallback(
    'p',
    useCallback(() => {
      if (!(!currentOpenedModal || currentOpenedModal.name === 'ADD_COLUMN'))
        return
      replaceModal({ name: 'SETTINGS' })
    }, [currentOpenedModal]),
  )

  const scrollDown = useCallback(() => {
    if (currentOpenedModal) return

    const fixedColumnIndex = Math.max(
      0,
      Math.min(focusedColumnIndex, columnIds.length - 1),
    )

    emitter.emit('SCROLL_DOWN_COLUMN', {
      columnId: columnIds[fixedColumnIndex],
    })
  }, [currentOpenedModal, focusedColumnIndex, columnIds])

  useKeyPressCallback('ArrowDown', scrollDown)
  useKeyPressCallback('j', scrollDown)

  const scrollUp = useCallback(() => {
    if (currentOpenedModal) return

    const fixedColumnIndex = Math.max(
      0,
      Math.min(focusedColumnIndex, columnIds.length - 1),
    )

    emitter.emit('SCROLL_UP_COLUMN', {
      columnId: columnIds[fixedColumnIndex],
    })
  }, [currentOpenedModal, focusedColumnIndex, columnIds])

  useKeyPressCallback('ArrowUp', scrollUp)
  useKeyPressCallback('k', scrollUp)

  const scrollLeft = useCallback(() => {
    if (currentOpenedModal) return

    const previousColumnIndex = Math.max(
      0,
      Math.min(focusedColumnIndex - 1, columnIds.length - 1),
    )

    emitter.emit('FOCUS_ON_COLUMN', {
      animated: true,
      columnId: columnIds[previousColumnIndex],
      columnIndex: previousColumnIndex,
      focusOnVisibleItem: true,
      highlight: false,
      scrollTo: true,
    })
  }, [currentOpenedModal, focusedColumnIndex, columnIds])

  useKeyPressCallback('ArrowLeft', scrollLeft)
  useKeyPressCallback('h', scrollLeft)

  const scrollRight = useCallback(() => {
    if (currentOpenedModal) return

    const nextColumnIndex = Math.max(
      0,
      Math.min(focusedColumnIndex + 1, columnIds.length - 1),
    )

    emitter.emit('FOCUS_ON_COLUMN', {
      animated: true,
      columnId: columnIds[nextColumnIndex],
      columnIndex: nextColumnIndex,
      focusOnVisibleItem: true,
      highlight: false,
      scrollTo: true,
    })
  }, [currentOpenedModal, focusedColumnIndex, columnIds])

  useKeyPressCallback('ArrowRight', scrollRight)
  useKeyPressCallback('l', scrollRight)

  const scrollToColumnNumber = useCallback(
    (n: number) => {
      if (currentOpenedModal) return

      if (n === 0) {
        const columnIndex = columnIds.length - 1
        emitter.emit('FOCUS_ON_COLUMN', {
          animated: true,
          columnId: columnIds[columnIndex],
          columnIndex,
          highlight: true,
          scrollTo: true,
        })
        return
      }

      if (n >= 1 && n <= columnIds.length) {
        const columnIndex = n - 1
        emitter.emit('FOCUS_ON_COLUMN', {
          animated: true,
          columnId: columnIds[columnIndex],
          columnIndex,
          highlight: true,
          scrollTo: true,
        })
        return
      }
    },
    [currentOpenedModal, columnIds],
  )

  useKeyPressCallback('1', scrollToColumnNumber.bind(null, 1))
  useKeyPressCallback('2', scrollToColumnNumber.bind(null, 2))
  useKeyPressCallback('3', scrollToColumnNumber.bind(null, 3))
  useKeyPressCallback('4', scrollToColumnNumber.bind(null, 4))
  useKeyPressCallback('5', scrollToColumnNumber.bind(null, 5))
  useKeyPressCallback('6', scrollToColumnNumber.bind(null, 6))
  useKeyPressCallback('7', scrollToColumnNumber.bind(null, 7))
  useKeyPressCallback('8', scrollToColumnNumber.bind(null, 8))
  useKeyPressCallback('9', scrollToColumnNumber.bind(null, 9))
  useKeyPressCallback('0', scrollToColumnNumber.bind(null, 0))

  useMultiKeyPressCallback(
    ['Alt', 'ArrowLeft'],
    useCallback(() => {
      if (currentOpenedModal) return
      if (!focusedColumnId) return

      moveColumn({
        columnId: focusedColumnId,
        columnIndex: focusedColumnIndex - 1,
      })
    }, [currentOpenedModal, columnIds, focusedColumnId, focusedColumnIndex]),
  )

  useMultiKeyPressCallback(
    ['Alt', 'ArrowRight'],
    useCallback(() => {
      if (currentOpenedModal) return
      if (!focusedColumnId) return

      moveColumn({
        columnId: focusedColumnId,
        columnIndex: focusedColumnIndex + 1,
      })
    }, [currentOpenedModal, columnIds, focusedColumnId, focusedColumnIndex]),
  )

  const showKeyboardShortcuts = useCallback(() => {
    pushModal({ name: 'KEYBOARD_SHORTCUTS' })
  }, [])

  useKeyPressCallback('?', showKeyboardShortcuts)
  useMultiKeyPressCallback(['Shift', '?'], showKeyboardShortcuts)

  useEmitter(
    'FOCUS_ON_COLUMN',
    () => {
      if (
        currentOpenedModal &&
        Dimensions.get('window').width <= APP_LAYOUT_BREAKPOINTS.MEDIUM
      ) {
        closeAllModals()
      }
    },
    [currentOpenedModal],
  )

  if (!currentOpenedModal) {
    analytics.trackScreenView('MAIN_SCREEN')
  }

  return (
    <Screen statusBarBackgroundThemeColor="header" useSafeArea={false}>
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

        <Separator
          horizontal={horizontalSidebar}
          thick={!horizontalSidebar}
          zIndex={1000}
        />

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

          <ColumnsContainer key="columns-container" />
          <FABRenderer key="fab-renderer" />
        </ConditionalWrap>
      </View>
    </Screen>
  )
})
