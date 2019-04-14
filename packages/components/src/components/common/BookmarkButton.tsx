import React from 'react'

import { Omit } from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import * as actions from '../../redux/actions'
import { contentPadding } from '../../styles/variables'
import {
  ColumnHeaderItem,
  ColumnHeaderItemProps,
} from '../columns/ColumnHeaderItem'
import { useTheme } from '../context/ThemeContext'
import { keyboardShortcutsById } from '../modals/KeyboardShortcutsModal'

export interface BookmarkButtonProps
  extends Omit<ColumnHeaderItemProps, 'tooltip'> {
  isSaved: boolean
  itemIds: Array<string | number>
}

export function BookmarkButton(props: BookmarkButtonProps) {
  const { isSaved, itemIds, ...otherProps } = props

  const theme = useTheme()

  const saveItemsForLater = useReduxAction(actions.saveItemsForLater)

  return (
    <ColumnHeaderItem
      analyticsLabel={isSaved ? 'unsave_for_later' : 'save_for_later'}
      enableBackgroundHover={false}
      enableForegroundHover={!isSaved}
      fixedIconSize
      foregroundColor={
        isSaved ? theme.primaryBackgroundColor : theme.foregroundColorMuted50
      }
      hoverForegroundThemeColor={isSaved ? undefined : 'foregroundColor'}
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
}
