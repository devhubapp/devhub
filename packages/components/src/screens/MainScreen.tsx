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
import { emitter } from '../libs/emitter'
import { Platform } from '../libs/platform'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'

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
  const closeAllModals = useReduxAction(actions.closeAllModals)
  const selectColumn = useReduxAction(actions.selectColumn)
  const popModal = useReduxAction(actions.popModal)
  const replaceModal = useReduxAction(actions.replaceModal)
  const syncDown = useReduxAction(actions.syncDown)
  const { appOrientation } = useAppLayout()

  const selectedColumnId = useReduxState(selectors.selectedColumnSelector)
  const selectedColumnIndex = selectedColumnId
    ? columnIds.findIndex(id => id === selectedColumnId)
    : -1

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
        if (targetTagName === 'input') {
          e.preventDefault()
          target.blur()
        } else if (currentOpenedModal) {
          e.preventDefault()
          popModal()
        } else if (Platform.isElectron && window.ipc) {
          e.preventDefault()
          window.ipc.send('exit-full-screen')
        }

        return
      }

      if (targetTagName === 'input') return
      if (currentOpenedModal) return

      if (e.key === 'n') {
        e.preventDefault()

        replaceModal({ name: 'ADD_COLUMN' })
        return
      }

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault()

        const fixedColumnIndex = Math.max(
          0,
          Math.min(selectedColumnIndex, columnIds.length - 1),
        )

        if (
          fixedColumnIndex === 0 &&
          fixedColumnIndex !== selectedColumnIndex
        ) {
          selectColumn({ columnId: columnIds[fixedColumnIndex] })
        }

        emitter.emit('SCROLL_DOWN_COLUMN', {
          columnId: columnIds[fixedColumnIndex],
        })
        return
      }

      if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault()

        const fixedColumnIndex = Math.max(
          0,
          Math.min(selectedColumnIndex, columnIds.length - 1),
        )

        if (
          fixedColumnIndex === 0 &&
          fixedColumnIndex !== selectedColumnIndex
        ) {
          selectColumn({ columnId: columnIds[fixedColumnIndex] })
        }

        emitter.emit('SCROLL_UP_COLUMN', {
          columnId: columnIds[fixedColumnIndex],
        })
        return
      }

      if (e.key === 'ArrowLeft' || e.key === 'h') {
        e.preventDefault()

        const previousColumnIndex = Math.max(
          0,
          Math.min(selectedColumnIndex - 1, columnIds.length - 1),
        )

        selectColumn({ columnId: columnIds[previousColumnIndex] })

        emitter.emit('FOCUS_ON_COLUMN', {
          animated: true,
          columnId: columnIds[previousColumnIndex],
          columnIndex: previousColumnIndex,
          focusOnVisibleItem: true,
          highlight: false,
        })
        return
      }

      if (e.key === 'ArrowRight' || e.key === 'l') {
        e.preventDefault()

        const nextColumnIndex = Math.max(
          0,
          Math.min(selectedColumnIndex + 1, columnIds.length - 1),
        )

        selectColumn({ columnId: columnIds[nextColumnIndex] })

        emitter.emit('FOCUS_ON_COLUMN', {
          animated: true,
          columnId: columnIds[nextColumnIndex],
          columnIndex: nextColumnIndex,
          focusOnVisibleItem: true,
          highlight: false,
        })
        return
      }

      if (columnIds.length > 0) {
        e.preventDefault()

        const n = e.key >= '0' && e.key <= '9' ? parseInt(e.key, 10) : -1

        if (n === 0) {
          const columnIndex = columnIds.length - 1
          emitter.emit('FOCUS_ON_COLUMN', {
            animated: true,
            columnId: columnIds[columnIndex],
            columnIndex,
            highlight: true,
          })
          selectColumn({ columnId: columnIds[columnIndex] })
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
          selectColumn({ columnId: columnIds[columnIndex] })
          return
        }
      }
    },
    undefined,
    [columnIds, currentOpenedModal, selectedColumnIndex],
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
