import React, { useCallback } from 'react'
import { StyleSheet } from 'react-native'

import { useReduxAction } from '../../hooks/use-redux-action'
import * as actions from '../../redux/actions'
import { contentPadding } from '../../styles/variables'
import {
  ColumnHeaderItem,
  ColumnHeaderItemProps,
} from '../columns/ColumnHeaderItem'
import { keyboardShortcutsById } from '../modals/KeyboardShortcutsModal'

export interface BookmarkButtonProps
  extends Omit<ColumnHeaderItemProps, 'style' | 'tooltip'> {
  isSaved: boolean
  itemIds: string | number | Array<string | number>
}

const styles = StyleSheet.create({
  bookmarkButton: {
    paddingVertical: 0,
    paddingHorizontal: contentPadding / 3,
  },
})

export const BookmarkButton = React.memo((props: BookmarkButtonProps) => {
  const { isSaved, itemIds: _itemIds, ...otherProps } = props

  const itemIds = Array.isArray(_itemIds)
    ? _itemIds.filter(Boolean)
    : [_itemIds].filter(Boolean)

  const saveItemsForLater = useReduxAction(actions.saveItemsForLater)

  const onPress = useCallback(
    () => saveItemsForLater({ itemIds, save: !isSaved }),
    [itemIds.join(','), !isSaved],
  )

  return (
    <ColumnHeaderItem
      analyticsLabel={isSaved ? 'unsave_for_later' : 'save_for_later'}
      enableBackgroundHover={false}
      enableForegroundHover={!isSaved}
      fixedIconSize
      foregroundThemeColor={
        isSaved ? 'primaryBackgroundColor' : 'foregroundColorMuted25'
      }
      hoverForegroundThemeColor="foregroundColor"
      iconName="bookmark"
      noPadding
      onPress={onPress}
      tooltip={
        isSaved
          ? `Unsave (${keyboardShortcutsById.toggleSave.keys[0]})`
          : `Save for later (${keyboardShortcutsById.toggleSave.keys[0]})`
      }
      {...otherProps}
      style={styles.bookmarkButton}
    />
  )
})

BookmarkButton.displayName = 'BookmarkButton'
