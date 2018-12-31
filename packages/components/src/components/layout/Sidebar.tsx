import React, { useRef } from 'react'
import { findDOMNode } from 'react-dom' // stop using as soon (https://github.com/necolas/react-native-web/issues/1099) get finshed

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
import { useDraggable } from '../../hooks/use-draggable'
import * as actions from '../../redux/actions'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
import { useReduxState } from '../../redux/hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { emitter } from '../../setup'
import {
  columnHeaderHeight,
  columnHeaderItemContentBiggerSize,
  sidebarSize,
} from '../../styles/variables'
import { AnimatedSafeAreaView } from '../animated/AnimatedSafeAreaView'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { Avatar } from '../common/Avatar'
import { Link } from '../common/Link'
import { Separator } from '../common/Separator'
import { TouchableOpacity } from '../common/TouchableOpacity'
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

  const itemContainerRef = useRef(null)
  const theme = useAnimatedTheme()

  const columnIds = useReduxState(selectors.columnIdsSelector)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const username = useReduxState(selectors.currentUsernameSelector)

  const replaceModal = useReduxAction(actions.replaceModal)
  const moveColumn = useReduxAction(actions.moveColumn)

  const small = sizename === '1-small'
  const large = sizename === '3-large'

  const showLabel = !!(horizontal && small)

  const hasColumns = columnIds && columnIds.length

  const itemContainerStyle = {
    width: sidebarSize,
    height: sidebarSize,
  }

  const itemContainerNode = () => {
    const { current } = itemContainerRef

    if (!current) {
      return null
    }

    return findDOMNode(current).firstChild as HTMLElement
  }

  useDraggable(
    itemContainerNode,
    {
      delay: horizontal ? 500 : 0, // long-press if is horizontal
      onEnd: (evt: SortableEvent) => {
        const oldIndex = evt.oldIndex || 0
        const newIndex = evt.newIndex || 0

        if (!isEqual(oldIndex, newIndex)) {
          moveColumn({
            currentIndex: oldIndex,
            columnIndex: newIndex,
          })
        }
      },
    },
    [horizontal],
  )

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

        <ScrollView
          ref={itemContainerRef}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: small && horizontal ? 'space-evenly' : undefined,
          }}
          horizontal={horizontal}
          style={{ flex: 1 }}
        >
          {!hasColumns ? (
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

          {!!small && (
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
          </>
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
        className="draggable-source"
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
