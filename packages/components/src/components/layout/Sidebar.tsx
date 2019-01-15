import React, { useEffect, useRef } from 'react'
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { getColumnHeaderDetails, ModalPayload } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useColumn } from '../../hooks/use-column'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { emitter } from '../../setup'
import {
  columnHeaderHeight,
  columnHeaderItemContentBiggerSize,
  contentPadding,
  sidebarSize,
} from '../../styles/variables'
import { AnimatedSafeAreaView } from '../animated/AnimatedSafeAreaView'
import { AnimatedView } from '../animated/AnimatedView'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { Avatar } from '../common/Avatar'
import { Link } from '../common/Link'
import { Separator } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { AnimatedTransparentTextOverlay } from '../common/TransparentTextOverlay'
import { useAppLayout } from '../context/LayoutContext'

const logo = require('@devhub/components/assets/logo_circle.png') // tslint:disable-line

const styles = StyleSheet.create({
  centerContainer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export interface SidebarProps {
  horizontal: boolean
  zIndex?: number
}

export const Sidebar = React.memo((props: SidebarProps) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const leftOrTopOverlayRef = useRef<View>(null)
  const rightOrBottomOverlayRef = useRef<View>(null)
  const isLeftOrTopOverlayVisible = useRef(true)
  const isRightOrBottomOverlayVisible = useRef(true)
  const isScrollAtTheStartRef = useRef(true)
  const isScrollAtTheEndRef = useRef(false)

  function updateOverlayVisibility() {
    const shouldShowLeftOverlay = !isScrollAtTheStartRef.current
    const shouldShowRightOverlay = !isScrollAtTheEndRef.current

    if (
      leftOrTopOverlayRef.current &&
      shouldShowLeftOverlay !== isLeftOrTopOverlayVisible.current
    ) {
      isLeftOrTopOverlayVisible.current = shouldShowLeftOverlay
      leftOrTopOverlayRef.current.setNativeProps({
        style: { opacity: shouldShowLeftOverlay ? 1 : 0 },
      })
    }

    if (
      rightOrBottomOverlayRef.current &&
      shouldShowRightOverlay !== isRightOrBottomOverlayVisible.current
    ) {
      isRightOrBottomOverlayVisible.current = shouldShowRightOverlay
      rightOrBottomOverlayRef.current.setNativeProps({
        style: { opacity: shouldShowRightOverlay ? 1 : 0 },
      })
    }
  }

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    isScrollAtTheStartRef.current = horizontal
      ? e.nativeEvent.contentOffset.x < 1
      : e.nativeEvent.contentOffset.y < 1

    isScrollAtTheEndRef.current = horizontal
      ? e.nativeEvent.contentSize.width -
          e.nativeEvent.layoutMeasurement.width -
          e.nativeEvent.contentOffset.x <
        1
      : e.nativeEvent.contentSize.height -
          e.nativeEvent.layoutMeasurement.height -
          e.nativeEvent.contentOffset.y <
        1

    updateOverlayVisibility()
  }

  useEffect(() => {
    updateOverlayVisibility()
  }, [])

  const theme = useAnimatedTheme()
  const { sizename } = useAppLayout()

  const columnIds = useReduxState(selectors.columnIdsSelector)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const modalStack = useReduxState(selectors.modalStack)
  const username = useReduxState(selectors.currentUsernameSelector)

  const replaceModal = useReduxAction(actions.replaceModal)

  const { horizontal, zIndex } = props

  const small = sizename === '1-small'
  const large = sizename === '3-large'

  const showLabel = !!horizontal
  const showFixedSettingsButton = !horizontal || columnIds.length >= 4

  const itemContainerStyle = {
    width: sidebarSize,
    height: sidebarSize,
  }

  function isModalOpen(modalName: ModalPayload['name']) {
    return !!modalStack && modalStack.some(m => m.name === modalName)
  }

  return (
    <AnimatedSafeAreaView
      style={{
        width: horizontal ? undefined : sidebarSize,
        backgroundColor: theme.backgroundColor as any,
        zIndex: zIndex || 1000,
      }}
    >
      <View
        style={{
          flexGrow: 1,
          flexDirection: horizontal ? 'row' : 'column',
          width: horizontal ? '100%' : sidebarSize,
          height: horizontal ? sidebarSize : '100%',
        }}
      >
        {!horizontal && (
          <>
            <AnimatedView
              style={[
                styles.centerContainer,
                {
                  width: sidebarSize,
                  height: columnHeaderHeight,
                  backgroundColor: theme.backgroundColorLess08,
                },
              ]}
            >
              <Avatar
                shape="circle"
                size={sidebarSize / 2}
                username={username}
              />
            </AnimatedView>

            <Separator horizontal={!horizontal} />
          </>
        )}

        <View
          style={{
            position: 'relative',
            flex: 1,
          }}
        >
          <ScrollView
            ref={scrollViewRef}
            alwaysBounceHorizontal={false}
            alwaysBounceVertical={false}
            contentContainerStyle={[
              {
                flexGrow: 1,
                justifyContent:
                  small && horizontal ? 'space-evenly' : undefined,
              },
              horizontal && { paddingHorizontal: contentPadding / 2 },
            ]}
            horizontal={horizontal}
            onScroll={onScroll}
            scrollEventThrottle={10}
            style={{ flex: 1 }}
          >
            {!(columnIds && columnIds.length) ? (
              !large ? (
                <>
                  <ColumnHeaderItem
                    analyticsLabel="sidebar_add"
                    enableBackgroundHover={!horizontal}
                    forceHoverState={isModalOpen('ADD_COLUMN')}
                    iconName="plus"
                    label="Add column"
                    onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
                    showLabel={showLabel}
                    size={columnHeaderItemContentBiggerSize}
                    style={[styles.centerContainer, itemContainerStyle]}
                  />

                  <Separator horizontal={!horizontal} />
                </>
              ) : null
            ) : (
              columnIds.map(columnId => (
                <SidebarColumnItem
                  key={`sidebar-column-item-${columnId}`}
                  columnId={columnId}
                  currentOpenedModal={currentOpenedModal}
                  horizontal={horizontal}
                  itemContainerStyle={itemContainerStyle}
                  showLabel={showLabel}
                  small={small}
                />
              ))
            )}

            {!showFixedSettingsButton && (
              <ColumnHeaderItem
                analyticsLabel="sidebar_settings"
                enableBackgroundHover={!horizontal}
                forceHoverState={isModalOpen('SETTINGS')}
                iconName="gear"
                label="Preferences"
                onPress={() =>
                  isModalOpen('SETTINGS')
                    ? undefined
                    : replaceModal({ name: 'SETTINGS' })
                }
                showLabel={showLabel}
                size={columnHeaderItemContentBiggerSize}
                style={[
                  styles.centerContainer,
                  !showLabel && itemContainerStyle,
                ]}
              />
            )}
          </ScrollView>

          <AnimatedTransparentTextOverlay
            ref={leftOrTopOverlayRef}
            containerStyle={StyleSheet.absoluteFill}
            size={contentPadding}
            spacing={contentPadding / 2}
            themeColor="backgroundColor"
            to={horizontal ? 'right' : 'bottom'}
          />

          <AnimatedTransparentTextOverlay
            ref={rightOrBottomOverlayRef}
            containerStyle={StyleSheet.absoluteFill}
            size={contentPadding}
            spacing={contentPadding / 2}
            themeColor="backgroundColor"
            to={horizontal ? 'left' : 'top'}
          />
        </View>

        {!small && (
          <>
            <Separator horizontal={!horizontal} />

            {!!large && (
              <>
                <ColumnHeaderItem
                  analyticsLabel="sidebar_add"
                  enableBackgroundHover={!horizontal}
                  forceHoverState={isModalOpen('ADD_COLUMN')}
                  iconName="plus"
                  label="Add column"
                  onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
                  style={[
                    styles.centerContainer,
                    !showLabel && itemContainerStyle,
                  ]}
                  showLabel={showLabel}
                  size={columnHeaderItemContentBiggerSize}
                />

                <Separator horizontal={!horizontal} />
              </>
            )}
          </>
        )}

        {horizontal && (showFixedSettingsButton || large) && (
          <Spacer width={contentPadding / 2} />
        )}

        {showFixedSettingsButton && (
          <ColumnHeaderItem
            analyticsLabel="sidebar_settings"
            enableBackgroundHover={!horizontal}
            forceHoverState={isModalOpen('SETTINGS')}
            iconName="gear"
            label="Preferences"
            onPress={() => replaceModal({ name: 'SETTINGS' })}
            showLabel={showLabel}
            size={columnHeaderItemContentBiggerSize}
            style={[styles.centerContainer, !showLabel && itemContainerStyle]}
          />
        )}

        {large && (
          <Link
            analyticsLabel="sidebar_logo"
            enableBackgroundHover
            hoverBackgroundColor={theme.backgroundColorLess08}
            href="https://github.com/devhubapp/devhub"
            openOnNewTab
            style={[styles.centerContainer, itemContainerStyle]}
          >
            <Image
              resizeMode="contain"
              source={logo}
              style={{
                width: sidebarSize / 2,
                height: sidebarSize / 2,
              }}
            />
          </Link>
        )}

        {horizontal && (showFixedSettingsButton || large) && (
          <Spacer width={contentPadding / 2} />
        )}
      </View>
    </AnimatedSafeAreaView>
  )
})

const SidebarColumnItem = React.memo(
  (props: {
    columnId: string
    currentOpenedModal: ModalPayload | undefined
    horizontal: boolean
    itemContainerStyle: ViewStyle
    showLabel: boolean
    small: boolean | undefined
  }) => {
    const {
      columnId,
      currentOpenedModal,
      horizontal,
      itemContainerStyle,
      showLabel,
      small,
    } = props

    const theme = useAnimatedTheme()

    const { column, columnIndex, subscriptions } = useColumn(columnId)
    if (!(column && subscriptions)) return null

    const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)
    const label = requestTypeIconAndData.title

    return (
      <ColumnHeaderItem
        key={`sidebar-column-${column.id}`}
        analyticsLabel="sidebar_column"
        avatarProps={{
          ...requestTypeIconAndData.avatarProps,
          disableLink: true,
        }}
        enableBackgroundHover={!horizontal}
        iconName={requestTypeIconAndData.icon}
        label={label}
        onPress={() => {
          emitter.emit('FOCUS_ON_COLUMN', {
            animated: !small || !currentOpenedModal,
            columnId: column.id,
            columnIndex,
            highlight: !small,
          })
        }}
        showLabel={showLabel}
        size={columnHeaderItemContentBiggerSize}
        style={[
          styles.centerContainer,
          !showLabel && itemContainerStyle,
          { backgroundColor: theme.backgroundColor },
        ]}
      />
    )
  },
)
