import React from 'react'
import { Image, ScrollView, StyleSheet, View, ViewStyle } from 'react-native'

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
import { TouchableOpacity } from '../common/TouchableOpacity'
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
  horizontal?: boolean
  zIndex?: number
}

export const Sidebar = React.memo((props: SidebarProps) => {
  const theme = useAnimatedTheme()
  const { sizename } = useAppLayout()

  const columnIds = useReduxState(selectors.columnIdsSelector)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
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

        <AnimatedTransparentTextOverlay
          size={contentPadding}
          spacing={contentPadding / 2}
          themeColor="backgroundColor"
          to={horizontal ? 'horizontal' : 'vertical'}
        >
          <ScrollView
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
            style={{ flex: 1 }}
          >
            {!(columnIds && columnIds.length) ? (
              !large ? (
                <>
                  <TouchableOpacity
                    analyticsLabel="sidebar_add"
                    onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
                    style={[styles.centerContainer, itemContainerStyle]}
                  >
                    <ColumnHeaderItem
                      analyticsLabel={undefined}
                      iconName="plus"
                      label="Add column"
                      showLabel={showLabel}
                      size={columnHeaderItemContentBiggerSize}
                    />
                  </TouchableOpacity>

                  <Separator horizontal={!horizontal} />
                </>
              ) : null
            ) : (
              columnIds.map(columnId => (
                <SidebarColumnItem
                  key={`sidebar-column-item-${columnId}`}
                  columnId={columnId}
                  currentOpenedModal={currentOpenedModal}
                  itemContainerStyle={itemContainerStyle}
                  showLabel={showLabel}
                  small={small}
                />
              ))
            )}

            {!showFixedSettingsButton && (
              <TouchableOpacity
                analyticsLabel="sidebar_settings"
                onPress={() =>
                  currentOpenedModal && currentOpenedModal.name === 'SETTINGS'
                    ? undefined
                    : replaceModal({ name: 'SETTINGS' })
                }
                style={[
                  styles.centerContainer,
                  !showLabel && itemContainerStyle,
                ]}
              >
                <ColumnHeaderItem
                  analyticsLabel={undefined}
                  iconName="gear"
                  label="Preferences"
                  showLabel={showLabel}
                  size={columnHeaderItemContentBiggerSize}
                />
              </TouchableOpacity>
            )}
          </ScrollView>
        </AnimatedTransparentTextOverlay>

        {!small && (
          <>
            <Separator horizontal={!horizontal} />

            {!!large && (
              <>
                <TouchableOpacity
                  analyticsLabel="sidebar_add"
                  onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
                  style={[
                    styles.centerContainer,
                    !showLabel && itemContainerStyle,
                  ]}
                >
                  <ColumnHeaderItem
                    analyticsLabel={undefined}
                    iconName="plus"
                    label="Add column"
                    showLabel={showLabel}
                    size={columnHeaderItemContentBiggerSize}
                  />
                </TouchableOpacity>

                <Separator horizontal={!horizontal} />
              </>
            )}
          </>
        )}

        {horizontal && (showFixedSettingsButton || large) && (
          <Spacer width={contentPadding / 2} />
        )}

        {showFixedSettingsButton && (
          <TouchableOpacity
            analyticsLabel="sidebar_settings"
            onPress={() => replaceModal({ name: 'SETTINGS' })}
            style={[styles.centerContainer, !showLabel && itemContainerStyle]}
          >
            <ColumnHeaderItem
              analyticsLabel={undefined}
              iconName="gear"
              label="Preferences"
              showLabel={showLabel}
              size={columnHeaderItemContentBiggerSize}
            />
          </TouchableOpacity>
        )}

        {large && (
          <Link
            analyticsLabel="sidebar_logo"
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
    itemContainerStyle: ViewStyle
    showLabel: boolean
    small: boolean | undefined
  }) => {
    const {
      columnId,
      currentOpenedModal,
      itemContainerStyle,
      showLabel,
      small,
    } = props

    const { column, columnIndex, subscriptions } = useColumn(columnId)
    if (!(column && subscriptions)) return null

    const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)
    const label = requestTypeIconAndData.title

    return (
      <TouchableOpacity
        key={`sidebar-column-${column.id}`}
        analyticsLabel="sidebar_column"
        onPress={() => {
          emitter.emit('FOCUS_ON_COLUMN', {
            animated: !small || !currentOpenedModal,
            columnId: column.id,
            columnIndex,
            highlight: !small,
          })
        }}
        style={[styles.centerContainer, !showLabel && itemContainerStyle]}
      >
        <ColumnHeaderItem
          analyticsLabel={undefined}
          avatarProps={{
            ...requestTypeIconAndData.avatarProps,
            disableLink: true,
          }}
          iconName={requestTypeIconAndData.icon}
          label={label}
          showLabel={showLabel}
          size={columnHeaderItemContentBiggerSize}
        />
      </TouchableOpacity>
    )
  },
)
