import React from 'react'
import { View } from 'react-native'

import { ColumnSubscription } from '@devhub/core'
import { useReduxAction } from '../../../hooks/use-redux-action'
import * as actions from '../../../redux/actions'
import { sharedStyles } from '../../../styles/shared'
import {
  contentPadding,
  smallAvatarSize,
  smallerTextSize,
} from '../../../styles/variables'
import { Link } from '../../common/Link'
import { Spacer } from '../../common/Spacer'
import { spacingBetweenLeftAndRightColumn } from '../styles'

export interface CardActionsProps {
  isRead: boolean
  isSaved: boolean
  itemIds: Array<string | number>
  leftSpacing?: number
  rightSpacing?: number
  type: ColumnSubscription['type']
}

export function CardActions(props: CardActionsProps) {
  const {
    isRead,
    isSaved,
    itemIds,
    leftSpacing = 2 * smallAvatarSize +
      2 * spacingBetweenLeftAndRightColumn +
      contentPadding / 3,
    rightSpacing = 0,
    type,
  } = props

  const markItemsAsReadOrUnread = useReduxAction(
    actions.markItemsAsReadOrUnread,
  )
  const saveItemsForLater = useReduxAction(actions.saveItemsForLater)

  return (
    <View style={sharedStyles.horizontal}>
      {leftSpacing > 0 && <Spacer width={leftSpacing} />}

      <Link
        analyticsLabel={isSaved ? 'unsave_for_later' : 'save_for_later'}
        hitSlop={{
          top: contentPadding / 2,
          bottom: contentPadding / 2,
          left: contentPadding,
          right: contentPadding / 4,
        }}
        onPress={() => saveItemsForLater({ itemIds, save: !isSaved })}
        textProps={{
          color: 'foregroundColorMuted50',
          style: {
            fontSize: smallerTextSize,
          },
        }}
      >
        {isSaved ? 'unsave' : 'save'}
      </Link>

      <Spacer width={contentPadding / 2} />

      <Link
        analyticsLabel={isRead ? 'mark_as_unread' : 'mark_as_read'}
        hitSlop={{
          top: contentPadding / 2,
          bottom: contentPadding / 2,
          left: contentPadding / 4,
          right: contentPadding,
        }}
        onPress={() =>
          markItemsAsReadOrUnread({ type, itemIds, unread: !!isRead })
        }
        textProps={{
          color: 'foregroundColorMuted50',
          style: {
            fontSize: smallerTextSize,
          },
        }}
      >
        {isRead ? 'mark as unread' : 'mark as read'}
      </Link>

      {rightSpacing > 0 && <Spacer width={rightSpacing} />}
    </View>
  )
}
