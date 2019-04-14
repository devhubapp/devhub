import React, { useEffect, useRef } from 'react'
import { FlatList, Image, StyleSheet, View, ViewStyle } from 'react-native'

import { getGitHubURLForUser, ModalPayload } from '@devhub/core'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useColumn } from '../../hooks/use-column'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { emitter } from '../../libs/emitter'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderHeight,
  columnHeaderItemContentBiggerSize,
  contentPadding,
  radius,
  sidebarSize,
} from '../../styles/variables'
import { SpringAnimatedSafeAreaView } from '../animated/spring/SpringAnimatedSafeAreaView'
import {
  ColumnHeader,
  getColumnHeaderThemeColors,
} from '../columns/ColumnHeader'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { Avatar } from '../common/Avatar'
import { Link } from '../common/Link'
import { Separator } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { useAppLayout } from '../context/LayoutContext'
import { useTheme } from '../context/ThemeContext'
import { keyboardShortcutsById } from '../modals/KeyboardShortcutsModal'
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

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()
  const theme = useTheme()
  const { appViewMode } = useAppViewMode()
  const { sizename } = useAppLayout()

  const columnIds = useReduxState(selectors.columnIdsSelector)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const modalStack = useReduxState(selectors.modalStack)
  const username = useReduxState(selectors.currentGitHubUsernameSelector)

  const closeAllModals = useReduxAction(actions.closeAllModals)
  const replaceModal = useReduxAction(actions.replaceModal)

  const {
    focusedColumnId: _focusedColumnId,
    focusedColumnIndex,
  } = useFocusedColumn()
  const focusedColumnId = _focusedColumnId || columnIds[0]

  useEffect(() => {
    if (!(flatListRef.current && focusedColumnId)) return

    flatListRef.current.scrollToItem({
      animated: true,
      item: focusedColumnId,
      viewPosition: 0.5,
    })
  }, [focusedColumnId, focusedColumnIndex, flatListRef.current])

  const small = sizename === '1-small'
  const large = sizename >= '3-large'

  const enableBackgroundHover = true
  const showLabel = !!horizontal
  const showFixedSettingsButton = !horizontal || columnIds.length >= 4
  const highlightFocusedColumn =
    (appViewMode === 'single-column' || small) && !currentOpenedModal

  const itemContainerStyle: ViewStyle = {
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
        }
      : {
          marginVertical: 1,
          borderTopRightRadius: sidebarSize / 2,
          borderBottomRightRadius: sidebarSize / 2,
        }),
  }

  const SectionSpacer = horizontal
    ? () => null
    : () => <Spacer height={contentPadding / 3} />

  function isModalOpen(modalName: ModalPayload['name']) {
    return !!modalStack && modalStack.some(m => m.name === modalName)
  }

  return (
    <SpringAnimatedSafeAreaView
      style={{
        backgroundColor:
          springAnimatedTheme[
            getColumnHeaderThemeColors(theme.backgroundColor).normal
          ],
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
          <ColumnHeader noPadding>
            <ColumnHeaderItem
              analyticsLabel={undefined}
              hoverBackgroundThemeColor={
                getColumnHeaderThemeColors(theme.backgroundColor).hover
              }
              enableBackgroundHover={enableBackgroundHover}
              noPadding
              size={columnHeaderItemContentBiggerSize}
              style={[
                styles.centerContainer,
                itemContainerStyle,
                {
                  width: sidebarSize,
                  height: columnHeaderHeight,
                },
              ]}
              tooltip={undefined}
            >
              <Link
                analyticsLabel="sidebar_user_avatar"
                href={getGitHubURLForUser(username!)}
                openOnNewTab
                style={[
                  styles.centerContainer,
                  itemContainerStyle,
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
            !(columnIds && columnIds.length) &&
            !large &&
            !shouldRenderFAB(sizename) ? (
              <>
                <ColumnHeaderItem
                  analyticsLabel="sidebar_add"
                  hoverBackgroundThemeColor={
                    isModalOpen('ADD_COLUMN')
                      ? getColumnHeaderThemeColors(theme.backgroundColor)
                          .selected
                      : getColumnHeaderThemeColors(theme.backgroundColor).hover
                  }
                  enableBackgroundHover={enableBackgroundHover}
                  forceHoverState={isModalOpen('ADD_COLUMN')}
                  iconName="plus"
                  label="add column"
                  onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
                  showLabel={showLabel}
                  size={columnHeaderItemContentBiggerSize}
                  style={[
                    styles.centerContainer,
                    itemContainerStyle,
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
                analyticsLabel="sidebar_settings"
                hoverBackgroundThemeColor={
                  isModalOpen('SETTINGS')
                    ? getColumnHeaderThemeColors(theme.backgroundColor).selected
                    : getColumnHeaderThemeColors(theme.backgroundColor).hover
                }
                enableBackgroundHover={enableBackgroundHover}
                forceHoverState={isModalOpen('SETTINGS')}
                iconName="gear"
                label="preferences"
                onPress={() =>
                  small && isModalOpen('SETTINGS')
                    ? undefined
                    : replaceModal({ name: 'SETTINGS' })
                }
                showLabel={showLabel}
                size={columnHeaderItemContentBiggerSize}
                style={[
                  styles.centerContainer,
                  itemContainerStyle,
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
          horizontal={horizontal}
          keyExtractor={columnId => `sidebar-column-item-${columnId}`}
          style={sharedStyles.flex}
          renderItem={({ item: columnId }) => (
            <SidebarColumnItem
              closeAllModals={closeAllModals}
              columnId={columnId}
              currentOpenedModal={currentOpenedModal}
              enableBackgroundHover={enableBackgroundHover}
              highlight={highlightFocusedColumn && columnId === focusedColumnId}
              horizontal={horizontal}
              itemContainerStyle={itemContainerStyle}
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

            {!!large && !shouldRenderFAB(sizename) && (
              <>
                <ColumnHeaderItem
                  analyticsLabel="sidebar_add"
                  hoverBackgroundThemeColor={
                    getColumnHeaderThemeColors(theme.backgroundColor).hover
                  }
                  enableBackgroundHover={enableBackgroundHover}
                  forceHoverState={isModalOpen('ADD_COLUMN')}
                  iconName="plus"
                  label="add column"
                  onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
                  style={[
                    styles.centerContainer,
                    itemContainerStyle,
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
            analyticsLabel="sidebar_settings"
            hoverBackgroundThemeColor={
              isModalOpen('SETTINGS')
                ? getColumnHeaderThemeColors(theme.backgroundColor).selected
                : getColumnHeaderThemeColors(theme.backgroundColor).hover
            }
            enableBackgroundHover={enableBackgroundHover}
            forceHoverState={isModalOpen('SETTINGS')}
            iconName="gear"
            label="preferences"
            onPress={() =>
              small && isModalOpen('SETTINGS')
                ? undefined
                : replaceModal({ name: 'SETTINGS' })
            }
            showLabel={showLabel}
            size={columnHeaderItemContentBiggerSize}
            style={[
              styles.centerContainer,
              itemContainerStyle,
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
              analyticsLabel={undefined}
              hoverBackgroundThemeColor={
                getColumnHeaderThemeColors(theme.backgroundColor).hover
              }
              enableBackgroundHover={enableBackgroundHover}
              noPadding
              size={columnHeaderItemContentBiggerSize}
              style={[
                styles.centerContainer,
                itemContainerStyle,
                showLabel && styles.itemContainerStyle__withLabel,
              ]}
              tooltip={undefined}
            >
              <Link
                analyticsLabel="sidebar_devhub_logo"
                href="https://github.com/devhubapp/devhub"
                openOnNewTab
                style={[styles.centerContainer, itemContainerStyle]}
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
    </SpringAnimatedSafeAreaView>
  )
})

const SidebarColumnItem = React.memo(
  (props: {
    closeAllModals: () => void
    columnId: string
    currentOpenedModal: ModalPayload | undefined
    enableBackgroundHover: boolean
    highlight: boolean
    horizontal: boolean
    itemContainerStyle: ViewStyle
    showLabel: boolean
    small: boolean | undefined
  }) => {
    const {
      closeAllModals,
      columnId,
      currentOpenedModal,
      enableBackgroundHover,
      highlight,
      itemContainerStyle,
      showLabel,
      small,
    } = props

    const { column, columnIndex, headerDetails } = useColumn(columnId)
    const theme = useTheme()

    if (!(column && columnIndex >= 0 && headerDetails)) return null

    const label = `${headerDetails.title || ''}`.toLowerCase()

    return (
      <ColumnHeaderItem
        key={`sidebar-column-${column.id}`}
        analyticsLabel="sidebar_column"
        avatarProps={{
          ...headerDetails.avatarProps,
          disableLink: true,
        }}
        forceHoverState={highlight}
        hoverBackgroundThemeColor={
          highlight
            ? getColumnHeaderThemeColors(theme.backgroundColor).selected
            : getColumnHeaderThemeColors(theme.backgroundColor).hover
        }
        enableBackgroundHover={enableBackgroundHover || highlight}
        iconName={headerDetails.icon}
        label={label}
        onPress={() => {
          if (currentOpenedModal) closeAllModals()

          emitter.emit('FOCUS_ON_COLUMN', {
            animated: !small || !currentOpenedModal,
            columnId: column.id,
            columnIndex,
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
