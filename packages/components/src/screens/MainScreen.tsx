import _ from 'lodash'
import React, { useEffect, useMemo, useRef } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

import { Screen } from '../components/common/Screen'
import { Separator } from '../components/common/Separator'
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
import { useKeyDownCallback } from '../hooks/use-key-down-callback'
import { useKeyPressCallback } from '../hooks/use-key-press-callback'
import { useReduxAction } from '../hooks/use-redux-action'
import { useReduxState } from '../hooks/use-redux-state'
import { analytics } from '../libs/analytics'
import { Platform } from '../libs/platform'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { emitter } from '../setup'

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
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const columnIds = useReduxState(selectors.columnIdsSelector)
  const focusedColumn = useReduxState(selectors.focusedColumnSelector)
  const closeAllModals = useReduxAction(actions.closeAllModals)
  const focusColumn = useReduxAction(actions.focusColumn)
  const popModal = useReduxAction(actions.popModal)
  const replaceModal = useReduxAction(actions.replaceModal)
  const syncDown = useReduxAction(actions.syncDown)
  const { appOrientation } = useAppLayout()

  const debounceSyncDown = useMemo(
    () => {
      return _.debounce(syncDown, 5000, {
        leading: true,
        maxWait: 30000,
        trailing: false,
      })
    },
    [syncDown],
  )

  const isVisible = useAppVisibility()
  const wasVisible = useRef(isVisible)

  // TODO: Use GraphQL Subscriptions, ffs
  useEffect(
    () => {
      if (isVisible && !wasVisible.current) {
        debounceSyncDown()
      }

      wasVisible.current = isVisible
    },
    [isVisible],
  )

  const horizontalSidebar = appOrientation === 'portrait'

  useKeyDownCallback(
    e => {
      const target = e.target as any
      const targetTagName = target && `${target.tagName || ''}`.toLowerCase()

      if (targetTagName !== 'input') {
        analytics.trackEvent('keyboard_shortcut', 'keydown', e.key)
      }

      if (e.key === 'Escape') {
        // never happens apparently
        if (targetTagName === 'input') target.blur()
        else if (currentOpenedModal) popModal()
        else if (Platform.isElectron && window.ipc)
          window.ipc.send('exit-full-screen')

        return
      }
    },
    undefined,
    [currentOpenedModal],
  )

  useKeyPressCallback(
    e => {
      const target = e.target as any
      const targetTagName = target && `${target.tagName || ''}`.toLowerCase()
      if (targetTagName === 'input') return

      if (e.key === 'a' || e.key === 'n') {
        replaceModal({ name: 'ADD_COLUMN' })
        return
      }

      if (e.key === 'j') {
        emitter.emit(
          'SCROLL_DOWN_COLUMN',
          {
            columnId: columnIds[focusedColumn],
          },
          [focusedColumn],
        )
        return
      }

      if (e.key === 'l') {
        const nextColumn = focusedColumn + 1
        if (nextColumn < columnIds.length) {
          emitter.emit('FOCUS_ON_COLUMN', {
            animated: true,
            columnId: columnIds[nextColumn],
            columnIndex: nextColumn,
            highlight: true,
          })
          focusColumn(nextColumn)
        }
        return
      }
      if (e.key === 'h') {
        const previousColumn = focusedColumn - 1
        if (previousColumn >= 0) {
          emitter.emit('FOCUS_ON_COLUMN', {
            animated: true,
            columnId: columnIds[previousColumn],
            columnIndex: previousColumn,
            highlight: true,
          })
          focusColumn(previousColumn)
        }
        return
      }

      if (e.key === 'k') {
        emitter.emit(
          'SCROLL_UP_COLUMN',
          {
            columnId: columnIds[focusedColumn],
          },
          [focusedColumn],
        )
        return
      }

      if (columnIds.length > 0) {
        const n = e.key >= '0' && e.key <= '9' ? parseInt(e.key, 10) : -1

        if (n === 0) {
          const columnIndex = columnIds.length - 1
          emitter.emit('FOCUS_ON_COLUMN', {
            animated: true,
            columnId: columnIds[columnIndex],
            columnIndex,
            highlight: true,
          })
          focusColumn(columnIndex)
          return
        }

        if (n >= 1 && n <= columnIds.length) {
          const columnIndex = n - 1
          emitter.emit('FOCUS_ON_COLUMN', {
            animated: true,
            columnId: columnIds[columnIndex],
            columnIndex,
            highlight: true,
          })
          focusColumn(columnIndex)
          return
        }
      }
    },
    undefined,
    [columnIds, focusedColumn],
  )

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
    <Screen
      statusBarBackgroundThemeColor="backgroundColorLess1"
      useSafeArea={false}
    >
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
          half
          horizontal={horizontalSidebar}
          thick={!horizontalSidebar}
          zIndex={1000}
        />

        <View style={styles.innerContainer}>
          <ModalRenderer renderSeparator={!horizontalSidebar} />

          <ColumnsContainer />
          <FABRenderer />
        </View>
      </View>
    </Screen>
  )
})
