import React, { useRef } from 'react'
import { View } from 'react-native'

import { AddColumnDetailsPayload } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useHover } from '../../hooks/use-hover'
import { useReduxAction } from '../../hooks/use-redux-action'
import * as actions from '../../redux/actions'
import * as colors from '../../styles/colors'
import { contentPadding, radius } from '../../styles/variables'
import { AnimatedText } from '../animated/AnimatedText'
import { AnimatedView } from '../animated/AnimatedView'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { ModalColumn } from '../columns/ModalColumn'
import { TouchableOpacity } from '../common/TouchableOpacity'
import { useColumnWidth } from '../context/ColumnWidthContext'

export interface AddColumnModalProps {
  showBackButton: boolean
}

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

  const touchableRef = useRef(null)
  const isHovered = useHover(touchableRef)

  if (!(availableWidth > 0)) return null

  return (
    <TouchableOpacity
      ref={touchableRef}
      analyticsLabel={undefined}
      onPress={() =>
        pushModal({
          name: 'ADD_COLUMN_DETAILS',
          params: item,
        })
      }
      style={[
        {
          width:
            availableWidth / Math.floor(availableWidth / (82 + contentPadding)),
          borderRadius: radius,
        },
        isHovered && { backgroundColor: theme.backgroundColorLess08 },
      ]}
    >
      <AnimatedView
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: contentPadding / 4,
          paddingVertical: contentPadding,
        }}
      >
        <ColumnHeaderItem
          analyticsLabel={undefined}
          iconName={item.icon}
          noPadding
          size={24}
          style={{ marginBottom: contentPadding / 2 }}
        />

        <AnimatedText
          style={{
            color: theme.foregroundColor,
          }}
        >
          {item.name}
        </AnimatedText>
      </AnimatedView>
    </TouchableOpacity>
  )
}

export function AddColumnModal(props: AddColumnModalProps) {
  const { showBackButton } = props

  const outerSpacing = (3 / 4) * contentPadding

  const columnWidth = useColumnWidth()
  const availableWidth = columnWidth - 2 * outerSpacing

  return (
    <ModalColumn
      columnId="add-column-modal"
      iconName="plus"
      showBackButton={showBackButton}
      title="Add Column"
    >
      <View
        style={{
          flex: 1,
          padding: outerSpacing,
        }}
      >
        <View
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
