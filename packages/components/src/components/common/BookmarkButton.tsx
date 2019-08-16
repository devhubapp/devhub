import React from 'react'

import { useReduxAction } from '../../hooks/use-redux-action'
import * as actions from '../../redux/actions'
import { contentPadding } from '../../styles/variables'
import {
  ColumnHeaderItem,
  ColumnHeaderItemProps,
} from '../columns/ColumnHeaderItem'
import { keyboardShortcutsById } from '../modals/KeyboardShortcutsModal'

export interface BookmarkButtonProps
  extends Omit<ColumnHeaderItemProps, 'tooltip'> {
  isSaved: boolean
  itemIds: string | number | Array<string | number>
}

export const BookmarkButton = React.memo((props: BookmarkButtonProps) => {
  const { isSaved, itemIds: _itemIds, ...otherProps } = props

  const itemIds = Array.isArray(_itemIds)
    ? _itemIds.filter(Boolean)
    : [_itemIds].filter(Boolean)

  const saveItemsForLater = useReduxAction(actions.saveItemsForLater)

  return (
    <ColumnHeaderItem
      analyticsLabel={isSaved ? 'unsave_for_later' : 'save_for_later'}
      fixedIconSize
      foregroundThemeColor={
        isSaved ? 'primaryBackgroundColor' : 'foregroundColorMuted25'
      }
      hoverForegroundThemeColor="foregroundColor"
      iconName="bookmark"
      noPadding
      onPress={() => saveItemsForLater({ itemIds, save: !isSaved })}
      tooltip={
        isSaved
          ? `Unsave (${keyboardShortcutsById.toggleSave.keys[0]})`
          : `Save for later (${keyboardShortcutsById.toggleSave.keys[0]})`
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
})

BookmarkButton.displayName = 'BookmarkButton'
