import React from 'react'
import { Animated, Image, ScrollView, StyleSheet, View } from 'react-native'

import { ModalPayload } from '@devhub/core/src/types'
import { getColumnHeaderDetails } from '@devhub/core/src/utils/helpers/github/events'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useColumn } from '../../hooks/use-column'
import * as actions from '../../redux/actions'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
import { useReduxState } from '../../redux/hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { emitter } from '../../setup'
import { sidebarSize } from '../../styles/variables'
import { AnimatedSafeAreaView } from '../animated/AnimatedSafeAreaView'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { Avatar } from '../common/Avatar'
import { Link } from '../common/Link'
import { Separator } from '../common/Separator'
import { TouchableOpacity } from '../common/TouchableOpacity'

const logo = require('@devhub/components/assets/logo.png') // tslint:disable-line

const styles = StyleSheet.create({
  centerContainer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export interface SidebarProps {
  horizontal?: boolean
  small?: boolean
}

const squareStyle = {
  width: sidebarSize,
  height: sidebarSize,
}

export const Sidebar = React.memo((props: SidebarProps) => {
  const columnIds = useReduxState(selectors.columnIdsSelector)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)
  const replaceModal = useReduxAction(actions.replaceModal)
  const theme = useAnimatedTheme()
  const username = useReduxState(selectors.currentUsernameSelector)

  const { horizontal, small } = props

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
          height: horizontal ? sidebarSize : '100%',
        }}
      >
        {!horizontal && (
          <>
            <Animated.View
              style={[
                styles.centerContainer,
                squareStyle,
                {
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

        {!small && (
          <>
            <TouchableOpacity
              analyticsLabel="sidebar_add"
              onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
              style={[styles.centerContainer, squareStyle]}
            >
              <ColumnHeaderItem analyticsLabel={undefined} iconName="plus" />
            </TouchableOpacity>

            <Separator horizontal={!horizontal} />
          </>
        )}

        <ScrollView
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: small && horizontal ? 'space-evenly' : undefined,
          }}
          horizontal={horizontal}
          style={{ flex: 1 }}
        >
          {!(columnIds && columnIds.length) ? (
            small ? (
              <>
                <TouchableOpacity
                  analyticsLabel="sidebar_add"
                  onPress={() => replaceModal({ name: 'ADD_COLUMN' })}
                  style={[styles.centerContainer, squareStyle]}
                >
                  <ColumnHeaderItem
                    analyticsLabel={undefined}
                    iconName="plus"
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
                small={small}
                currentOpenedModal={currentOpenedModal}
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
              style={[styles.centerContainer, squareStyle]}
            >
              <ColumnHeaderItem analyticsLabel={undefined} iconName="gear" />
            </TouchableOpacity>
          )}
        </ScrollView>

        {!small && (
          <>
            <Separator horizontal={!horizontal} />

            <TouchableOpacity
              analyticsLabel="sidebar_settings"
              onPress={() => replaceModal({ name: 'SETTINGS' })}
              style={[styles.centerContainer, squareStyle]}
            >
              <ColumnHeaderItem analyticsLabel={undefined} iconName="gear" />
            </TouchableOpacity>

            <Link
              analyticsLabel="sidebar_logo"
              href="https://twitter.com/brunolemos"
              openOnNewTab
              style={[styles.centerContainer, squareStyle]}
            >
              <Image
                resizeMode="contain"
                source={logo}
                style={{
                  width: sidebarSize / 2,
                  height: sidebarSize / 2,
                  borderRadius: sidebarSize / (2 * 2),
                }}
              />
            </Link>
          </>
        )}
      </View>
    </AnimatedSafeAreaView>
  )
})

const SidebarColumnItem = React.memo(
  (props: {
    columnId: string
    small: boolean | undefined
    currentOpenedModal: ModalPayload | undefined
  }) => {
    const { columnId, small, currentOpenedModal } = props

    const { column, columnIndex, subscriptions } = useColumn(columnId)
    if (!(column && subscriptions)) return null

    const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)

    return (
      <TouchableOpacity
        key={`sidebar-column-${column.id}`}
        analyticsLabel="sidebar_column"
        style={[styles.centerContainer, squareStyle]}
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
        />
      </TouchableOpacity>
    )
  },
)
