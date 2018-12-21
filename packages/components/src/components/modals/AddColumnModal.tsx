import React, { useState } from 'react'
import { Animated, View } from 'react-native'

import { AddColumnDetailsPayload } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import * as actions from '../../redux/actions'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
import { contentPadding } from '../../styles/variables'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { ModalColumn } from '../columns/ModalColumn'
import { TouchableOpacity } from '../common/TouchableOpacity'
import { useColumnWidth } from '../context/ColumnWidthContext'

const columnTypes: AddColumnDetailsPayload[] = [
  {
    name: 'Dashboard',
    icon: 'home',
    subscription: {
      type: 'activity',
      subtype: 'USER_RECEIVED_EVENTS',
    },
    paramList: ['username'],
  },
  {
    name: 'User',
    icon: 'person',
    subscription: {
      type: 'activity',
      subtype: 'USER_EVENTS',
    },
    paramList: ['username'],
  },
  {
    name: 'Notifications',
    icon: 'bell',
    subscription: {
      type: 'notifications',
      subtype: '',
    },
    paramList: ['all'],
  },
  {
    name: 'Organization',
    icon: 'organization',
    subscription: {
      type: 'activity',
      subtype: 'ORG_PUBLIC_EVENTS',
    },
    paramList: ['org'],
  },
  {
    name: 'Repository',
    icon: 'repo',
    subscription: {
      type: 'activity',
      subtype: 'REPO_EVENTS',
    },
    paramList: ['owner', 'repo'],
  },
]

function keyExtractor(columnType: AddColumnDetailsPayload) {
  return `add-column-button-${columnType.subscription.type}-${columnType
    .subscription.subtype || ''}`
}

function AddColumnModalItem({
  availableWidth,
  item,
}: {
  availableWidth: number
  item: AddColumnDetailsPayload
}) {
  const theme = useAnimatedTheme()
  const pushModal = useReduxAction(actions.pushModal)

  if (!(availableWidth > 0)) return null

  return (
    <TouchableOpacity
      analyticsLabel={undefined}
      onPress={() =>
        pushModal({
          name: 'ADD_COLUMN_DETAILS',
          params: item,
        })
      }
      style={{
        width:
          availableWidth / Math.floor(availableWidth / (82 + contentPadding)),
      }}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: contentPadding / 4,
          marginBottom: contentPadding,
          paddingVertical: contentPadding / 2,
        }}
      >
        <ColumnHeaderItem
          analyticsLabel={undefined}
          iconName={item.icon}
          noPadding
          size={24}
          style={{ fontSize: 24, marginBottom: contentPadding / 2 }}
        />

        <Animated.Text style={{ color: theme.foregroundColor }}>
          {item.name}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  )
}

export function AddColumnModal() {
  const outerSpacing = (3 / 4) * contentPadding

  const columnWidth = useColumnWidth()
  const [availableWidth, setAvailableWidth] = useState(
    columnWidth - 2 * outerSpacing,
  )

  return (
    <ModalColumn columnId="add-column-modal" iconName="plus" title="Add Column">
      <View
        style={{
          flex: 1,
          padding: outerSpacing,
        }}
      >
        <View
          onLayout={e => setAvailableWidth(e.nativeEvent.layout.width)}
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
          }}
        >
          {columnTypes.map(item => (
            <AddColumnModalItem
              key={keyExtractor(item)}
              availableWidth={availableWidth}
              item={item}
            />
          ))}
        </View>
      </View>
    </ModalColumn>
  )
}
