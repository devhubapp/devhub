import React from 'react'
import { Image, StyleSheet, View, ViewStyle } from 'react-native'

import {
  getColumnHeaderDetails,
  getGitHubURLForUser,
  ModalPayload,
} from '@devhub/core'
import { useColumn } from '../../hooks/use-column'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { emitter } from '../../libs/emitter'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import {
  columnHeaderHeight,
  columnHeaderItemContentBiggerSize,
  contentPadding,
  sidebarSize,
} from '../../styles/variables'
import { SpringAnimatedSafeAreaView } from '../animated/spring/SpringAnimatedSafeAreaView'
import { getColumnHeaderThemeColors } from '../columns/ColumnHeader'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { Avatar } from '../common/Avatar'
import { Link } from '../common/Link'
import { ScrollViewWithOverlay } from '../common/ScrollViewWithOverlay'
import { Separator } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { useAppLayout } from '../context/LayoutContext'
import { useTheme } from '../context/ThemeContext'

const logo = require('@devhub/components/assets/logo_circle.png') // tslint:disable-line

const styles = StyleSheet.create({
  centerContainer: {
    alignSelf: 'center',
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
  const { horizontal, zIndex } = props

  const { sizename } = useAppLayout()

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()
  const theme = useTheme()

  const columnIds = useReduxState(selectors.columnIdsSelector)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const modalStack = useReduxState(selectors.modalStack)
  const username = useReduxState(selectors.currentUsernameSelector)
  const closeAllModals = useReduxAction(actions.closeAllModals)
  const replaceModal = useReduxAction(actions.replaceModal)

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
    <SpringAnimatedSafeAreaView
      style={{
        width: horizontal ? undefined : sidebarSize,
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
          <>
            <ColumnHeaderItem
              analyticsLabel={undefined}
              hoverBackgroundThemeColor={
                getColumnHeaderThemeColors(theme.backgroundColor).hover
              }
              enableBackgroundHover={!horizontal}
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
              >
                <Avatar
                  disableLink
                  shape="circle"
                  size={sidebarSize / 2}
                  username={username}
                />
              </Link>
            </ColumnHeaderItem>

            <Separator horizontal={!horizontal} />
          </>
        )}

        <ScrollViewWithOverlay
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          contentContainerStyle={[
            {
              flexGrow: 1,
              justifyContent: small && horizontal ? 'space-evenly' : undefined,
            },
            horizontal && { paddingHorizontal: contentPadding / 2 },
          ]}
          horizontal={horizontal}
          overlayThemeColor={
            getColumnHeaderThemeColors(theme.backgroundColor).normal
          }
          style={{ flex: 1 }}
        >
          {!(columnIds && columnIds.length) ? (
            !large ? (
              <>
                <ColumnHeaderItem
                  analyticsLabel="sidebar_add"
                  hoverBackgroundThemeColor={
                    getColumnHeaderThemeColors(theme.backgroundColor).hover
                  }
                  enableBackgroundHover={!horizontal}
                  forceHoverState={isModalOpen('ADD_COLUMN')}
                  iconName="plus"
                  label="add column"
                  onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
                  showLabel={showLabel}
                  size={columnHeaderItemContentBiggerSize}
                  style={[
                    styles.centerContainer,
                    !showLabel && itemContainerStyle,
                  ]}
                />

                <Separator horizontal={!horizontal} />
              </>
            ) : null
          ) : (
            columnIds.map(columnId => (
              <SidebarColumnItem
                key={`sidebar-column-item-${columnId}`}
                closeAllModals={closeAllModals}
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
              hoverBackgroundThemeColor={
                getColumnHeaderThemeColors(theme.backgroundColor).hover
              }
              enableBackgroundHover={!horizontal}
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
              style={[styles.centerContainer, !showLabel && itemContainerStyle]}
            />
          )}
        </ScrollViewWithOverlay>

        {!small && (
          <>
            <Separator horizontal={!horizontal} />

            {!!large && (
              <>
                <ColumnHeaderItem
                  analyticsLabel="sidebar_add"
                  hoverBackgroundThemeColor={
                    getColumnHeaderThemeColors(theme.backgroundColor).hover
                  }
                  enableBackgroundHover={!horizontal}
                  forceHoverState={isModalOpen('ADD_COLUMN')}
                  iconName="plus"
                  label="add column"
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
            hoverBackgroundThemeColor={
              getColumnHeaderThemeColors(theme.backgroundColor).hover
            }
            enableBackgroundHover={!horizontal}
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
            style={[styles.centerContainer, !showLabel && itemContainerStyle]}
          />
        )}

        {large && (
          <>
            <Separator horizontal={!horizontal} />

            <ColumnHeaderItem
              analyticsLabel={undefined}
              hoverBackgroundThemeColor={
                getColumnHeaderThemeColors(theme.backgroundColor).hover
              }
              enableBackgroundHover={!horizontal}
              noPadding
              size={columnHeaderItemContentBiggerSize}
              style={[styles.centerContainer, !showLabel && itemContainerStyle]}
            >
              <Link
                analyticsLabel="sidebar_devhub_logo_twitter"
                href="https://twitter.com/devhub_app"
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
            </ColumnHeaderItem>
          </>
        )}

        {horizontal && (showFixedSettingsButton || large) && (
          <Spacer width={contentPadding / 2} />
        )}
      </View>
    </SpringAnimatedSafeAreaView>
  )
})

const SidebarColumnItem = React.memo(
  (props: {
    closeAllModals: () => void
    columnId: string
    currentOpenedModal: ModalPayload | undefined
    horizontal: boolean
    itemContainerStyle: ViewStyle
    showLabel: boolean
    small: boolean | undefined
  }) => {
    const {
      closeAllModals,
      columnId,
      currentOpenedModal,
      horizontal,
      itemContainerStyle,
      showLabel,
      small,
    } = props

    const { column, columnIndex, subscriptions } = useColumn(columnId)
    const theme = useTheme()

    if (!(column && subscriptions)) return null

    const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)
    const label = `${requestTypeIconAndData.title || ''}`.toLowerCase()

    return (
      <ColumnHeaderItem
        key={`sidebar-column-${column.id}`}
        analyticsLabel="sidebar_column"
        avatarProps={{
          ...requestTypeIconAndData.avatarProps,
          disableLink: true,
        }}
        hoverBackgroundThemeColor={
          getColumnHeaderThemeColors(theme.backgroundColor).hover
        }
        enableBackgroundHover={!horizontal}
        iconName={requestTypeIconAndData.icon}
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
        style={[styles.centerContainer, !showLabel && itemContainerStyle]}
      />
    )
  },
)
