import React, { useLayoutEffect, useRef } from 'react'
import { Image, StyleSheet, View, ViewStyle } from 'react-native'

import {
  getFilteredItems,
  getGitHubURLForUser,
  getItemsFilterMetadata,
  ModalPayload,
} from '@devhub/core'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useColumn } from '../../hooks/use-column'
import { useColumnData } from '../../hooks/use-column-data'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { bugsnag } from '../../libs/bugsnag'
import { emitter } from '../../libs/emitter'
import { FlatList } from '../../libs/flatlist'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderHeight,
  columnHeaderItemContentBiggerSize,
  contentPadding,
  mutedOpacity,
  radius,
  sidebarSize,
} from '../../styles/variables'
import {
  ColumnHeader,
  getColumnHeaderThemeColors,
} from '../columns/ColumnHeader'
import {
  ColumnHeaderItem,
  ColumnHeaderItemProps,
} from '../columns/ColumnHeaderItem'
import { Avatar } from '../common/Avatar'
import { Link } from '../common/Link'
import { Separator } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { useAppLayout } from '../context/LayoutContext'
import { keyboardShortcutsById } from '../modals/KeyboardShortcutsModal'
import { ThemedSafeAreaView } from '../themed/ThemedSafeAreaView'
import { shouldRenderFAB } from './FABRenderer'

const logo = require('@devhub/components/assets/logo_circle.png') // tslint:disable-line

const styles = StyleSheet.create({
  centerContainer: {
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemContainerStyle__withLabel: {
    width: undefined,
    height: sidebarSize - contentPadding / 4,
  },
})

export interface SidebarProps {
  horizontal: boolean
  zIndex?: number
}

export const Sidebar = React.memo((props: SidebarProps) => {
  const { horizontal, zIndex } = props

  const flatListRef = useRef<FlatList<string>>(null)

  const { appViewMode } = useAppViewMode()
  const { sizename } = useAppLayout()
  const { focusedColumnId, focusedColumnIndex } = useFocusedColumn()

  const columnIds = useReduxState(selectors.columnIdsSelector)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const modalStack = useReduxState(selectors.modalStack)
  const username = useReduxState(selectors.currentGitHubUsernameSelector)

  const closeAllModals = useReduxAction(actions.closeAllModals)
  const replaceModal = useReduxAction(actions.replaceModal)

  useLayoutEffect(() => {
    if (!(flatListRef.current && focusedColumnId)) return

    flatListRef.current.scrollToItem({
      animated: true,
      item: focusedColumnId,
      viewPosition: 0.5,
    })
  }, [focusedColumnId, focusedColumnIndex, flatListRef.current])

  const small = sizename === '1-small'
  const large = sizename >= '3-large'

  const showLabel = !!horizontal
  const showFixedSettingsButton = !horizontal || columnIds.length >= 4
  const highlightFocusedColumn =
    (appViewMode === 'single-column' || small) && !currentOpenedModal

  function getItemProps({
    highlight,
  }: {
    highlight: boolean
  }): {
    activeOpacity: ColumnHeaderItemProps['activeOpacity']
    enableBackgroundHover: ColumnHeaderItemProps['enableBackgroundHover']
    enableForegroundHover: ColumnHeaderItemProps['enableForegroundHover']
    foregroundThemeColor: ColumnHeaderItemProps['foregroundThemeColor']
    hoverForegroundThemeColor: ColumnHeaderItemProps['hoverForegroundThemeColor']
    itemContainerStyle: ViewStyle
  } {
    return {
      activeOpacity: horizontal ? 1 : undefined,
      enableBackgroundHover: !horizontal,
      enableForegroundHover: horizontal,
      foregroundThemeColor: 'foregroundColor',
      hoverForegroundThemeColor: 'foregroundColor',
      itemContainerStyle: {
        width: sidebarSize,
        height: horizontal
          ? sidebarSize
          : columnHeaderItemContentBiggerSize + contentPadding * (3 / 2),
        borderRadius: 0,
        ...(horizontal
          ? {
              marginHorizontal: 1,
              borderTopLeftRadius: radius,
              borderTopRightRadius: radius,
              opacity: highlight ? 1 : mutedOpacity,
            }
          : {
              marginVertical: 1,
              borderTopRightRadius: sidebarSize / 2,
              borderBottomRightRadius: sidebarSize / 2,
              opacity: 1,
            }),
      },
    }
  }

  const SectionSpacer = horizontal
    ? () => null
    : () => <Spacer height={contentPadding / 3} />

  function isModalOpen(modalName: ModalPayload['name']) {
    return !!modalStack && modalStack.some(m => m.name === modalName)
  }

  return (
    <ThemedSafeAreaView
      backgroundColor={theme =>
        theme[getColumnHeaderThemeColors(theme.backgroundColor).normal]
      }
      style={{ zIndex: zIndex || 1000 }}
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
          <ColumnHeader noPadding>
            <ColumnHeaderItem
              activeOpacity={getItemProps({ highlight: false }).activeOpacity}
              analyticsLabel={undefined}
              foregroundThemeColor={
                getItemProps({ highlight: false }).foregroundThemeColor
              }
              hoverForegroundThemeColor={
                getItemProps({ highlight: false }).hoverForegroundThemeColor
              }
              noPadding
              size={columnHeaderItemContentBiggerSize}
              style={[
                styles.centerContainer,
                {
                  width: sidebarSize,
                  height: columnHeaderHeight,
                },
              ]}
              tooltip={undefined}
            >
              <Link
                analyticsLabel="sidebar_user_avatar"
                enableBackgroundHover={
                  getItemProps({ highlight: false }).enableBackgroundHover
                }
                enableForegroundHover={
                  getItemProps({ highlight: false }).enableForegroundHover
                }
                hoverBackgroundThemeColor={theme =>
                  getColumnHeaderThemeColors(theme.backgroundColor).hover
                }
                href={getGitHubURLForUser(username!)}
                openOnNewTab
                style={[
                  styles.centerContainer,
                  getItemProps({ highlight: false }).itemContainerStyle,
                  {
                    width: sidebarSize,
                    height: columnHeaderHeight,
                  },
                ]}
                tooltip="Open profile on GitHub"
              >
                <Avatar
                  disableLink
                  shape="circle"
                  size={sidebarSize / 2}
                  username={username}
                />
              </Link>
            </ColumnHeaderItem>
          </ColumnHeader>
        )}

        <SectionSpacer />

        <FlatList
          ref={flatListRef}
          ListHeaderComponent={
            !(columnIds && columnIds.length) && !large ? (
              <>
                <ColumnHeaderItem
                  activeOpacity={
                    getItemProps({ highlight: isModalOpen('ADD_COLUMN') })
                      .activeOpacity
                  }
                  analyticsLabel="sidebar_add"
                  foregroundThemeColor={
                    getItemProps({ highlight: isModalOpen('ADD_COLUMN') })
                      .foregroundThemeColor
                  }
                  hoverBackgroundThemeColor={
                    isModalOpen('ADD_COLUMN')
                      ? theme =>
                          getColumnHeaderThemeColors(theme.backgroundColor)
                            .selected
                      : theme =>
                          getColumnHeaderThemeColors(theme.backgroundColor)
                            .hover
                  }
                  hoverForegroundThemeColor={
                    getItemProps({ highlight: isModalOpen('ADD_COLUMN') })
                      .hoverForegroundThemeColor
                  }
                  enableBackgroundHover={
                    getItemProps({ highlight: isModalOpen('ADD_COLUMN') })
                      .enableBackgroundHover
                  }
                  enableForegroundHover={
                    getItemProps({ highlight: isModalOpen('ADD_COLUMN') })
                      .enableForegroundHover
                  }
                  forceHoverState={isModalOpen('ADD_COLUMN')}
                  iconName="plus"
                  label="add column"
                  noPadding
                  onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
                  showLabel={showLabel}
                  size={columnHeaderItemContentBiggerSize}
                  style={[
                    styles.centerContainer,
                    getItemProps({
                      highlight: isModalOpen('ADD_COLUMN'),
                    }).itemContainerStyle,
                    showLabel && styles.itemContainerStyle__withLabel,
                  ]}
                  tooltip={`Add column (${
                    keyboardShortcutsById.addColumn.keys[0]
                  })`}
                />

                {/* <Separator horizontal={!horizontal} /> */}
              </>
            ) : null
          }
          ListFooterComponent={
            showFixedSettingsButton ? null : (
              <ColumnHeaderItem
                activeOpacity={
                  getItemProps({ highlight: isModalOpen('SETTINGS') })
                    .activeOpacity
                }
                analyticsLabel="sidebar_settings"
                foregroundThemeColor={
                  getItemProps({ highlight: isModalOpen('SETTINGS') })
                    .foregroundThemeColor
                }
                hoverBackgroundThemeColor={
                  isModalOpen('SETTINGS')
                    ? theme =>
                        getColumnHeaderThemeColors(theme.backgroundColor)
                          .selected
                    : theme =>
                        getColumnHeaderThemeColors(theme.backgroundColor).hover
                }
                hoverForegroundThemeColor={
                  getItemProps({ highlight: isModalOpen('SETTINGS') })
                    .hoverForegroundThemeColor
                }
                enableBackgroundHover={
                  getItemProps({ highlight: isModalOpen('SETTINGS') })
                    .enableBackgroundHover
                }
                enableForegroundHover={
                  getItemProps({ highlight: isModalOpen('SETTINGS') })
                    .enableForegroundHover
                }
                forceHoverState={isModalOpen('SETTINGS')}
                iconName="gear"
                label="preferences"
                noPadding
                onPress={() =>
                  small &&
                  currentOpenedModal &&
                  currentOpenedModal.name === 'SETTINGS'
                    ? columnIds.length === 0
                      ? closeAllModals()
                      : undefined
                    : replaceModal({ name: 'SETTINGS' })
                }
                showLabel={showLabel}
                size={columnHeaderItemContentBiggerSize}
                style={[
                  styles.centerContainer,
                  getItemProps({ highlight: isModalOpen('SETTINGS') })
                    .itemContainerStyle,
                  showLabel && styles.itemContainerStyle__withLabel,
                ]}
                tooltip={`Preferences (${
                  keyboardShortcutsById.openPreferences.keys[0]
                })`}
              />
            )
          }
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          contentContainerStyle={[
            {
              flexGrow: 1,
              justifyContent: small && horizontal ? 'space-evenly' : undefined,
            },
            horizontal && { paddingHorizontal: contentPadding / 2 },
          ]}
          data={columnIds}
          disableVirtualization
          horizontal={horizontal}
          keyExtractor={columnId => `sidebar-column-item-${columnId}`}
          onScrollToIndexFailed={(info: {
            index: number
            highestMeasuredFrameIndex: number
            averageItemLength: number
          }) => {
            console.error(info)
            bugsnag.notify({
              name: 'ScrollToIndexFailed',
              message: 'Failed to scroll to index',
              ...info,
            })
          }}
          overScrollMode="never"
          style={sharedStyles.flex}
          removeClippedSubviews={false}
          renderItem={({ item: columnId }) => (
            <SidebarColumnItem
              {...getItemProps({
                highlight:
                  highlightFocusedColumn && columnId === focusedColumnId,
              })}
              closeAllModals={closeAllModals}
              columnId={columnId}
              currentOpenedModal={currentOpenedModal}
              highlight={highlightFocusedColumn && columnId === focusedColumnId}
              horizontal={horizontal}
              showLabel={showLabel}
              small={small}
            />
          )}
        />

        <SectionSpacer />

        <Separator horizontal={!horizontal} thick={false} />

        <SectionSpacer />

        {!small && (
          <>
            {/* <Separator horizontal={!horizontal} /> */}

            {!!large && !shouldRenderFAB({ sizename }) && (
              <>
                <ColumnHeaderItem
                  activeOpacity={
                    getItemProps({ highlight: isModalOpen('ADD_COLUMN') })
                      .activeOpacity
                  }
                  analyticsLabel="sidebar_add"
                  enableBackgroundHover={
                    getItemProps({ highlight: isModalOpen('ADD_COLUMN') })
                      .enableBackgroundHover
                  }
                  enableForegroundHover={
                    getItemProps({ highlight: isModalOpen('ADD_COLUMN') })
                      .enableForegroundHover
                  }
                  forceHoverState={isModalOpen('ADD_COLUMN')}
                  foregroundThemeColor={
                    getItemProps({ highlight: isModalOpen('ADD_COLUMN') })
                      .foregroundThemeColor
                  }
                  hoverBackgroundThemeColor={theme =>
                    getColumnHeaderThemeColors(theme.backgroundColor).hover
                  }
                  hoverForegroundThemeColor={
                    getItemProps({ highlight: isModalOpen('ADD_COLUMN') })
                      .hoverForegroundThemeColor
                  }
                  iconName="plus"
                  label="add column"
                  noPadding
                  onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
                  style={[
                    styles.centerContainer,
                    getItemProps({
                      highlight: isModalOpen('ADD_COLUMN'),
                    }).itemContainerStyle,
                    showLabel && styles.itemContainerStyle__withLabel,
                  ]}
                  showLabel={showLabel}
                  size={columnHeaderItemContentBiggerSize}
                  tooltip={`Add column (${
                    keyboardShortcutsById.addColumn.keys[0]
                  })`}
                />

                {/* <Separator horizontal={!horizontal} /> */}
              </>
            )}
          </>
        )}

        {horizontal && (showFixedSettingsButton || large) && (
          <Spacer width={contentPadding / 2} />
        )}

        {showFixedSettingsButton && (
          <ColumnHeaderItem
            activeOpacity={
              getItemProps({ highlight: isModalOpen('SETTINGS') }).activeOpacity
            }
            analyticsLabel="sidebar_settings"
            hoverBackgroundThemeColor={
              isModalOpen('SETTINGS')
                ? theme =>
                    getColumnHeaderThemeColors(theme.backgroundColor).selected
                : theme =>
                    getColumnHeaderThemeColors(theme.backgroundColor).hover
            }
            enableBackgroundHover={
              getItemProps({ highlight: isModalOpen('SETTINGS') })
                .enableBackgroundHover
            }
            enableForegroundHover={
              getItemProps({ highlight: isModalOpen('SETTINGS') })
                .enableForegroundHover
            }
            forceHoverState={isModalOpen('SETTINGS')}
            foregroundThemeColor={
              getItemProps({ highlight: isModalOpen('SETTINGS') })
                .foregroundThemeColor
            }
            hoverForegroundThemeColor={
              getItemProps({ highlight: isModalOpen('SETTINGS') })
                .hoverForegroundThemeColor
            }
            iconName="gear"
            label="preferences"
            noPadding
            onPress={() =>
              small &&
              currentOpenedModal &&
              currentOpenedModal.name === 'SETTINGS'
                ? columnIds.length === 0
                  ? closeAllModals()
                  : undefined
                : replaceModal({ name: 'SETTINGS' })
            }
            showLabel={showLabel}
            size={columnHeaderItemContentBiggerSize}
            style={[
              styles.centerContainer,
              getItemProps({ highlight: isModalOpen('SETTINGS') })
                .itemContainerStyle,
              showLabel && styles.itemContainerStyle__withLabel,
            ]}
            tooltip={`Preferences (${
              keyboardShortcutsById.openPreferences.keys[0]
            })`}
          />
        )}

        {large && (
          <>
            {/* <Separator horizontal={!horizontal} /> */}

            <ColumnHeaderItem
              activeOpacity={getItemProps({ highlight: false }).activeOpacity}
              analyticsLabel={undefined}
              foregroundThemeColor={
                getItemProps({ highlight: false }).foregroundThemeColor
              }
              hoverForegroundThemeColor={
                getItemProps({ highlight: false }).hoverForegroundThemeColor
              }
              noPadding
              size={columnHeaderItemContentBiggerSize}
              style={[
                styles.centerContainer,
                showLabel && styles.itemContainerStyle__withLabel,
              ]}
              tooltip={undefined}
            >
              <Link
                analyticsLabel="sidebar_devhub_logo"
                enableBackgroundHover={
                  getItemProps({ highlight: false }).enableBackgroundHover
                }
                enableForegroundHover={
                  getItemProps({ highlight: false }).enableForegroundHover
                }
                hoverBackgroundThemeColor={theme =>
                  getColumnHeaderThemeColors(theme.backgroundColor).hover
                }
                href="https://github.com/devhubapp/devhub"
                openOnNewTab
                style={[
                  styles.centerContainer,
                  getItemProps({ highlight: false }).itemContainerStyle,
                ]}
                tooltip="Open DevHub on GitHub"
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
            </ColumnHeaderItem>
          </>
        )}

        {horizontal && (showFixedSettingsButton || large) && (
          <Spacer width={contentPadding / 2} />
        )}

        <SectionSpacer />
      </View>
    </ThemedSafeAreaView>
  )
})

Sidebar.displayName = 'Sidebar'

const SidebarColumnItem = React.memo(
  (props: {
    activeOpacity?: ColumnHeaderItemProps['activeOpacity']
    closeAllModals: () => void
    columnId: string
    currentOpenedModal: ModalPayload | undefined
    enableBackgroundHover: ColumnHeaderItemProps['enableBackgroundHover']
    enableForegroundHover: ColumnHeaderItemProps['enableForegroundHover']
    foregroundThemeColor?: ColumnHeaderItemProps['foregroundThemeColor']
    highlight: boolean
    horizontal: boolean
    hoverForegroundThemeColor: ColumnHeaderItemProps['hoverForegroundThemeColor']
    itemContainerStyle: ViewStyle
    showLabel: ColumnHeaderItemProps['showLabel']
    small: boolean | undefined
  }) => {
    const {
      activeOpacity,
      closeAllModals,
      columnId,
      currentOpenedModal,
      enableBackgroundHover,
      enableForegroundHover,
      foregroundThemeColor,
      highlight,
      hoverForegroundThemeColor,
      itemContainerStyle,
      showLabel,
      small,
    } = props

    const { column, columnIndex, headerDetails } = useColumn(columnId)

    if (!(column && columnIndex >= 0 && headerDetails)) return null

    const getFilteredItemsOptions: Parameters<typeof getFilteredItems>[3] = {
      mergeSimilar: false,
    }

    const { allItems } = useColumnData(column.id, getFilteredItemsOptions)

    const filteredItemsMetadata = getItemsFilterMetadata(
      column.type,
      getFilteredItems(
        column.type,
        allItems,
        column.filters,
        getFilteredItemsOptions,
      ),
    )

    const inbox =
      column.type === 'notifications' &&
      column.filters &&
      column.filters.notifications &&
      column.filters.notifications.participating
        ? 'participating'
        : 'all'

    const isUnread = filteredItemsMetadata.inbox[inbox].unread > 0

    const label = `${headerDetails.title ||
      headerDetails.subtitle ||
      ''}`.toLowerCase()

    return (
      <ColumnHeaderItem
        key={`sidebar-column-${column.id}`}
        activeOpacity={activeOpacity}
        analyticsLabel="sidebar_column"
        avatarProps={{
          ...headerDetails.avatarProps,
          disableLink: true,
        }}
        enableBackgroundHover={enableBackgroundHover}
        enableForegroundHover={enableForegroundHover}
        forceHoverState={highlight}
        foregroundThemeColor={foregroundThemeColor}
        hoverBackgroundThemeColor={
          highlight
            ? theme =>
                getColumnHeaderThemeColors(theme.backgroundColor).selected
            : theme => getColumnHeaderThemeColors(theme.backgroundColor).hover
        }
        hoverForegroundThemeColor={hoverForegroundThemeColor}
        iconName={headerDetails.icon}
        isUnread={isUnread}
        label={label}
        noPadding
        onPress={() => {
          if (currentOpenedModal) closeAllModals()

          emitter.emit('FOCUS_ON_COLUMN', {
            animated: !small || !currentOpenedModal,
            columnId: column.id,
            highlight: !small,
            scrollTo: true,
          })
        }}
        showLabel={showLabel}
        size={columnHeaderItemContentBiggerSize}
        style={[
          styles.centerContainer,
          itemContainerStyle,
          showLabel && styles.itemContainerStyle__withLabel,
        ]}
        tooltip={`${headerDetails.title} (${headerDetails.subtitle})`
          .toLowerCase()
          .trim()}
      />
    )
  },
)

SidebarColumnItem.displayName = 'SidebarColumnItem'
