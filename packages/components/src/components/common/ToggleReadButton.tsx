import React from 'react'

import { ColumnSubscription, Omit } from '@devhub/core'
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

export interface ToggleReadButtonProps
  extends Omit<ColumnHeaderItemProps, 'tooltip'> {
  isRead: boolean
  itemIds: Array<string | number>
  type: ColumnSubscription['type']
}

export function ToggleReadButton(props: ToggleReadButtonProps) {
  const {
    isRead,
    itemIds,
    size = columnHeaderItemContentSize,
    type,
    ...otherProps
  } = props

  const markItemsAsReadOrUnread = useReduxAction(
    actions.markItemsAsReadOrUnread,
  )

  return (
    <ColumnHeaderItem
      analyticsLabel={isRead ? 'mark_as_unread' : 'mark_as_read'}
      enableForegroundHover
      fixedIconSize
      iconName={isRead ? 'mail-read' : 'mail'}
      noPadding
      onPress={() =>
        markItemsAsReadOrUnread({
          type,
          itemIds,
          unread: !!isRead,
        })
      }
      tooltip={isRead ? 'Mark as unread' : 'Mark as read'}
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
}
