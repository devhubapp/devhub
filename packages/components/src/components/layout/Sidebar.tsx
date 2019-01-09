import React from 'react'
import SortableList from 'react-native-draggable-flatlist'

import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { getColumnHeaderDetails, ModalPayload } from '@devhub/core'
import { isEqual } from 'lodash'
import { SortableEvent } from 'sortablejs'
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
}

export const Sidebar = React.memo((props: SidebarProps) => {
  const { sizename } = useAppLayout()
  const { horizontal } = props

  const theme = useAnimatedTheme()

  const columnIds = useReduxState(selectors.columnIdsSelector)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const username = useReduxState(selectors.currentUsernameSelector)

  const replaceModal = useReduxAction(actions.replaceModal)
  const moveColumn = useReduxAction(actions.moveColumn)

  const small = sizename === '1-small'
  const large = sizename === '3-large'

  const showLabel = !!horizontal
  const showFixedSettingsButton = !horizontal || columnIds.length > 3

  const itemContainerStyle = {
    width: sidebarSize,
    height: sidebarSize,
  }

  return (
    <AnimatedSafeAreaView
      style={{
        width: horizontal ? undefined : sidebarSize,
        backgroundColor: theme.backgroundColor as any,
      }}
    >
      <View
        style={{
          flexGrow: 1,
          flexDirection: horizontal ? 'row' : 'column',
          width: horizontal ? '100%' : sidebarSize,
          height: horizontal ? undefined : '100%',
        }}
      >
        {!horizontal && (
          <>
            <Animated.View
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
            </Animated.View>

            <Separator horizontal={!horizontal} />
          </>
        )}

        <AnimatedTransparentTextOverlay
          from={horizontal ? 'horizontal' : 'vertical'}
          size={contentPadding}
          themeColor="backgroundColor"
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
              horizontal && { marginHorizontal: contentPadding / 2 },
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
              <SortableList
                horizontal={horizontal}
                data={columnIds}
                renderItem={data => {
                  const columnId = data.item
                  return (
                    <SidebarColumnItem
                      key={`sidebar-column-item-${columnId}`}
                      columnId={columnId}
                      currentOpenedModal={currentOpenedModal}
                      itemContainerStyle={itemContainerStyle}
                      showLabel={showLabel}
                      small={small}
                      move={props.move}
                      moveEnd={props.moveEnd}
                    />
                  )
                }}
              />
            )}

            {!showFixedSettingsButton && (
              <TouchableOpacity
                analyticsLabel="sidebar_settings"
                onPress={() =>
                  currentOpenedModal && currentOpenedModal.name === 'SETTINGS'
                    ? undefined
                    : replaceModal({ name: 'SETTINGS' })
                }
                style={[styles.centerContainer, itemContainerStyle]}
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
            )}
          </>
        )}

        {horizontal && <Spacer width={contentPadding / 2} />}

        {showFixedSettingsButton && (
          <TouchableOpacity
            analyticsLabel="sidebar_settings"
            onPress={() => replaceModal({ name: 'SETTINGS' })}
            style={[styles.centerContainer, itemContainerStyle]}
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

        {!!large && (
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

        {horizontal && <Spacer width={contentPadding / 2} />}
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
    move: () => void
    moveEnd: () => void
  }) => {
    const {
      columnId,
      currentOpenedModal,
      itemContainerStyle,
      showLabel,
      small,
      move,
      moveEnd,
    } = props

    const { column, columnIndex, subscriptions } = useColumn(columnId)

    if (!(column && subscriptions)) return null

    const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)
    const label = requestTypeIconAndData.title

    return (
      <TouchableOpacity
        style={[styles.centerContainer, !showLabel && itemContainerStyle]}
        key={`sidebar-column-${column.id}`}
        analyticsLabel="sidebar_column"
        onPressOut={moveEnd}
        onLongPress={move}
        onPress={() => {
          emitter.emit('FOCUS_ON_COLUMN', {
            animated: !small || !currentOpenedModal,
            columnId: column.id,
            columnIndex,
            highlight: !small,
          })
        }}
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
