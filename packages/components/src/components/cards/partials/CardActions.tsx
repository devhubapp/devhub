import { ColumnSubscription, fixURLForPlatform } from '@devhub/core'
import React from 'react'
import { View } from 'react-native'

import { useDispatch } from 'react-redux'
import { Platform } from '../../../libs/platform'
import * as actions from '../../../redux/actions'
import { sharedStyles } from '../../../styles/shared'
import { contentPadding, smallerTextSize } from '../../../styles/variables'
import { Link } from '../../common/Link'
import { Spacer } from '../../common/Spacer'
import { sizes } from '../BaseCard.shared'

export interface CardActionsProps {
  commentsCount: number | undefined
  commentsLink: string | (() => void) | undefined
  isRead: boolean
  isSaved: boolean
  itemNodeIdOrIds: string[]
  leftSpacing?: number
  // muted?: boolean
  rightSpacing?: number
  type: ColumnSubscription['type']
}

export const cardActionsHeight = smallerTextSize + 3

export function CardActions(props: CardActionsProps) {
  const {
    commentsCount,
    commentsLink,
    isRead,
    isSaved,
    itemNodeIdOrIds,
    leftSpacing = sizes.avatarContainerWidth + sizes.horizontalSpaceSize,
    rightSpacing = 0,
    type,
  } = props

  const muted = false

  const dispatch = useDispatch()

  return (
    <View style={sharedStyles.horizontal}>
      {leftSpacing > 0 && <Spacer width={leftSpacing} />}

      <Link
        analyticsCategory="card_action"
        analyticsLabel={isSaved ? 'unsave_for_later' : 'save_for_later'}
        enableUnderlineHover
        hitSlop={{
          top: 2,
          bottom: 2,
          left: contentPadding / 4,
          right: contentPadding / 4,
        }}
        href="javascript:void(0)"
        onPress={() => {
          dispatch(
            actions.saveItemsForLater({ itemNodeIdOrIds, save: !isSaved }),
          )
        }}
        textProps={{
          color: muted ? 'foregroundColorMuted40' : 'foregroundColorMuted65',
          style: { lineHeight: smallerTextSize + 3, fontSize: smallerTextSize },
        }}
      >
        {isSaved ? 'saved' : 'save'}
      </Link>

      <Spacer width={contentPadding / 2} />

      <Link
        analyticsCategory="card_action"
        analyticsLabel={isRead ? 'mark_as_unread' : 'mark_as_read'}
        enableUnderlineHover
        hitSlop={{
          top: 2,
          bottom: 2,
          left: contentPadding / 4,
          right: contentPadding / 4,
        }}
        href="javascript:void(0)"
        onPress={() => {
          dispatch(
            actions.markItemsAsReadOrUnread({
              type,
              itemNodeIdOrIds,
              unread: !!isRead,
            }),
          )
        }}
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
                top: 2,
                bottom: 2,
                left: contentPadding / 4,
                right: contentPadding / 4,
              }}
              href={
                typeof commentsLink === 'string'
                  ? fixURLForPlatform(
                      commentsLink,
                      Platform.realOS === 'ios' ||
                        Platform.realOS === 'android',
                      {
                        addBottomAnchor: true,
                      },
                    )
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
