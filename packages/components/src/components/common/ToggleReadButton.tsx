import React, { useCallback, useMemo } from 'react'
import { StyleSheet } from 'react-native'

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

const styles = StyleSheet.create({
  style: {
    paddingVertical: 0,
    paddingHorizontal: contentPadding / 3,
  },
  unreadIconStyle: {
    lineHeight: columnHeaderItemContentSize,
  },
})

export const ToggleReadButton = React.memo((props: ToggleReadButtonProps) => {
  const { isRead, itemIds: _itemIds, muted, type, ...otherProps } = props

  const itemIds = Array.isArray(_itemIds)
    ? _itemIds.filter(Boolean)
    : [_itemIds].filter(Boolean)

  const markItemsAsReadOrUnread = useReduxAction(
    actions.markItemsAsReadOrUnread,
  )

  const onPress = useCallback(
    () =>
      markItemsAsReadOrUnread({
        type,
        itemIds,
        unread: !!isRead,
      }),
    [type, itemIds.join(','), !!isRead],
  )

  const iconStyle = useMemo(
    () => [!isRead && styles.unreadIconStyle, otherProps.iconStyle],
    [!isRead, otherProps.iconStyle],
  )

  const style = useMemo(() => [styles.style, otherProps.style], [
    otherProps.style,
  ])

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
      onPress={onPress}
      tooltip={
        isRead
          ? `Mark as unread (${keyboardShortcutsById.toggleRead.keys[0]})`
          : `Mark as read (${keyboardShortcutsById.toggleRead.keys[0]})`
      }
      {...otherProps}
      iconStyle={iconStyle}
      size={columnHeaderItemContentSize}
      style={style}
    />
  )
})

ToggleReadButton.displayName = 'TextInput'
