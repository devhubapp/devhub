import React from 'react'

import { useReduxAction } from '../../hooks/use-redux-action'
import * as actions from '../../redux/actions'
import { contentPadding } from '../../styles/variables'
import {
  ColumnHeaderItem,
  ColumnHeaderItemProps,
} from '../columns/ColumnHeaderItem'

export interface ToggleReadButtonProps extends ColumnHeaderItemProps {
  isRead: boolean
  itemIds: Array<string | number>
  type: 'notifications' | 'activity'
}

export function ToggleReadButton(props: ToggleReadButtonProps) {
  const { isRead, itemIds, type, ...otherProps } = props

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
      {...otherProps}
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
