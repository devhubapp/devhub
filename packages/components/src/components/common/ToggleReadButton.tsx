import React from 'react'

import { ColumnSubscription } from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import * as actions from '../../redux/actions'
import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import {
  ColumnHeaderItem,
  ColumnHeaderItemProps,
} from '../columns/ColumnHeaderItem'
import { keyboardShortcutsById } from '../modals/KeyboardShortcutsModal'

export interface ToggleReadButtonProps
  extends Omit<ColumnHeaderItemProps, 'tooltip'> {
  isRead: boolean
  itemIds: string | number | Array<string | number>
  muted: boolean
  type: ColumnSubscription['type']
}

export const ToggleReadButton = React.memo((props: ToggleReadButtonProps) => {
  const {
    isRead,
    itemIds: _itemIds,
    muted,
    size = columnHeaderItemContentSize,
    type,
    ...otherProps
  } = props

  const itemIds = Array.isArray(_itemIds)
    ? _itemIds.filter(Boolean)
    : [_itemIds].filter(Boolean)

  const markItemsAsReadOrUnread = useReduxAction(
    actions.markItemsAsReadOrUnread,
  )

  return (
    <ColumnHeaderItem
      analyticsLabel={isRead ? 'mark_as_unread' : 'mark_as_read'}
      enableForegroundHover
      fixedIconSize
      foregroundThemeColor={
        muted ? 'foregroundColorMuted60' : 'foregroundColor'
      }
      iconName={isRead ? 'mail-read' : 'mail'}
      noPadding
      onPress={() =>
        markItemsAsReadOrUnread({
          type,
          itemIds,
          unread: !!isRead,
        })
      }
      tooltip={
        isRead
          ? `Mark as unread (${keyboardShortcutsById.toggleRead.keys[0]})`
          : `Mark as read (${keyboardShortcutsById.toggleRead.keys[0]})`
      }
      {...otherProps}
      iconStyle={[!isRead && { lineHeight: size }, otherProps.iconStyle]}
      size={size}
      style={[
        {
          paddingVertical: 0,
          paddingHorizontal: contentPadding / 3,
        },
        otherProps.style,
      ]}
    />
  )
})

ToggleReadButton.displayName = 'TextInput'
