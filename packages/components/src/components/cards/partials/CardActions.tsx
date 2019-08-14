import React from 'react'
import { View } from 'react-native'

import { ColumnSubscription, fixURLForPlatform } from '@devhub/core'
import { useReduxAction } from '../../../hooks/use-redux-action'
import { Platform } from '../../../libs/platform'
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
  commentsCount: number | undefined
  commentsLink: string | (() => void) | undefined
  isRead: boolean
  isSaved: boolean
  itemIds: Array<string | number>
  leftSpacing?: number
  muted: boolean
  rightSpacing?: number
  type: ColumnSubscription['type']
}

export function CardActions(props: CardActionsProps) {
  const {
    commentsCount,
    commentsLink,
    isRead,
    isSaved,
    itemIds,
    leftSpacing = 2 * smallAvatarSize +
      2 * spacingBetweenLeftAndRightColumn +
      contentPadding / 3,
    muted,
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
        analyticsCategory="card_action"
        analyticsLabel={isSaved ? 'unsave_for_later' : 'save_for_later'}
        hitSlop={{
          top: contentPadding / 2,
          bottom: contentPadding / 2,
          left: contentPadding / 4,
          right: contentPadding / 4,
        }}
        onPress={() => saveItemsForLater({ itemIds, save: !isSaved })}
        textProps={{
          color: muted ? 'foregroundColorMuted40' : 'foregroundColorMuted65',
          style: { fontSize: smallerTextSize },
        }}
      >
        {isSaved ? 'saved' : 'save'}
      </Link>

      <Spacer width={contentPadding / 2} />

      <Link
        analyticsCategory="card_action"
        analyticsLabel={isRead ? 'mark_as_unread' : 'mark_as_read'}
        hitSlop={{
          top: contentPadding / 2,
          bottom: contentPadding / 2,
          left: contentPadding / 4,
          right: contentPadding / 4,
        }}
        onPress={() =>
          markItemsAsReadOrUnread({ type, itemIds, unread: !!isRead })
        }
        textProps={{
          color: muted ? 'foregroundColorMuted40' : 'foregroundColorMuted65',
          style: { fontSize: smallerTextSize },
        }}
      >
        {isRead ? 'mark as unread' : 'mark as read'}
      </Link>

      {typeof commentsCount === 'number' &&
        commentsCount >= 0 &&
        !!commentsLink && (
          <>
            <Spacer width={contentPadding / 2} />

            <Link
              analyticsCategory="card_action"
              analyticsLabel="commentsCount"
              hitSlop={{
                top: contentPadding / 2,
                bottom: contentPadding / 2,
                left: contentPadding / 4,
                right: contentPadding / 4,
              }}
              href={
                typeof commentsLink === 'string'
                  ? fixURLForPlatform(commentsLink, Platform.realOS, {
                      addBottomAnchor: true,
                    })
                  : undefined
              }
              onPress={
                typeof commentsLink === 'function' ? commentsLink : undefined
              }
              openOnNewTab
              textProps={{
                color: muted
                  ? 'foregroundColorMuted40'
                  : 'foregroundColorMuted65',
                style: { fontSize: smallerTextSize },
              }}
            >
              {commentsCount === 1
                ? 'comment (1)'
                : `comments (${commentsCount})`}
            </Link>
          </>
        )}

      {rightSpacing > 0 && <Spacer width={rightSpacing} />}
    </View>
  )
}
