import _ from 'lodash'
import qs from 'qs'
import React, { useEffect, useMemo, useRef } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import url from 'url'

import { AppKeyboardShortcuts } from '../components/AppKeyboardShortcuts'
import { AppBannerMessage } from '../components/banners/AppBannerMessage'
import { ColumnSeparator } from '../components/columns/ColumnSeparator'
import { ColumnsRenderer } from '../components/columns/ColumnsRenderer'
import { ConditionalWrap } from '../components/common/ConditionalWrap'
import { Screen } from '../components/common/Screen'
import { Separator } from '../components/common/Separator'
import {
  APP_LAYOUT_BREAKPOINTS,
  useAppLayout,
} from '../components/context/LayoutContext'
import { FABRenderer } from '../components/layout/FABRenderer'
import { Sidebar } from '../components/layout/Sidebar'
import { ModalRenderer } from '../components/modals/ModalRenderer'
import { useAppVisibility } from '../hooks/use-app-visibility'
import { useEmitter } from '../hooks/use-emitter'
import { useReduxAction } from '../hooks/use-redux-action'
import { useReduxState } from '../hooks/use-redux-state'
import { analytics } from '../libs/analytics'
import { Linking } from '../libs/linking'
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

  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)

  const closeAllModals = useReduxAction(actions.closeAllModals)
  const refreshInstallationsRequest = useReduxAction(
    actions.refreshInstallationsRequest,
  )
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
        refreshInstallationsRequest({ includeInstallationToken: true })
      }
    }

    Linking.addEventListener('url', handler)

    handler({ isInitial: true, url: Linking.getCurrentURL() })

    return () => {
      Linking.removeEventListener('url', handler)
    }
  }, [])

  const horizontalSidebar = appOrientation === 'portrait'

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
    [!!currentOpenedModal],
  )

  useEffect(() => {
    if (!currentOpenedModal) {
      analytics.trackScreenView('MAIN_SCREEN')
    }
  }, [currentOpenedModal])

  return (
    <>
      <AppKeyboardShortcuts />

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
    </>
  )
})

MainScreen.displayName = 'MainScreen'
