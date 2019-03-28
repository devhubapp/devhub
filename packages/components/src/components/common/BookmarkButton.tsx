import React from 'react'

import { useReduxAction } from '../../hooks/use-redux-action'
import * as actions from '../../redux/actions'
import {
  ColumnHeaderItem,
  ColumnHeaderItemProps,
} from '../columns/ColumnHeaderItem'
import { useTheme } from '../context/ThemeContext'

export interface BookmarkButtonProps extends ColumnHeaderItemProps {
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
      {...otherProps}
    />
  )
}
