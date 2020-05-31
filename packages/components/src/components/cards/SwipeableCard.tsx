import { getItemNodeIdOrId, isItemRead, isItemSaved } from '@devhub/core'
import React, { useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { useItem } from '../../hooks/use-item'
import { SwipeableRow } from '../../libs/swipeable'
import * as actions from '../../redux/actions'
import { useTheme } from '../context/ThemeContext'
import { CardWithLink, CardWithLinkProps } from './CardWithLink'

export interface SwipeableCardProps extends CardWithLinkProps {}

export function SwipeableCard(props: CardWithLinkProps) {
  const { columnId, nodeIdOrId, ownerIsKnown, repoIsKnown, type } = props

  const swipeableRef = useRef<SwipeableRow>(null)
  const theme = useTheme()
  const dispatch = useDispatch()
  const item = useItem(nodeIdOrId)
  const isRead = isItemRead(item)

  function handleMarkAsRead() {
    dispatch(
      actions.markItemsAsReadOrUnread({
        type,
        itemNodeIdOrIds: [getItemNodeIdOrId(item)!],
        localOnly: false,
        unread: isRead,
      }),
    )
  }

  function handleSave() {
    dispatch(
      actions.saveItemsForLater({
        itemNodeIdOrIds: [getItemNodeIdOrId(item)!],
        save: !isItemSaved(item),
      }),
    )
  }

  const Content = useMemo(() => <CardWithLink {...props} isInsideSwipeable />, [
    columnId,
    item,
    ownerIsKnown,
    repoIsKnown,
    type,
  ])

  return (
    <SwipeableRow
      ref={swipeableRef}
      leftActions={[
        {
          ...(!isRead
            ? {
                backgroundColor: theme.backgroundColorDarker2,
                foregroundColor: theme.foregroundColor,
              }
            : {
                backgroundColor: theme.primaryBackgroundColor,
                foregroundColor: theme.primaryForegroundColor,
              }),
          icon: {
            family: 'octicons',
            name: isRead ? 'eye-closed' : 'eye',
          },
          key: 'read',
          label: 'Read',
          onPress: handleMarkAsRead,
          type: 'FULL',
        },
      ]}
      rightActions={[
        {
          key: 'bookmark',
          onPress: handleSave,
          ...(isItemSaved(item)
            ? {
                backgroundColor: theme.backgroundColorDarker2,
                foregroundColor: theme.foregroundColor,
                icon: { family: 'octicon', name: 'bookmark-slash-fill' },
                type: 'FULL',
                label: 'Unsave',
              }
            : {
                backgroundColor: theme.primaryBackgroundColor,
                foregroundColor: theme.primaryForegroundColor,
                icon: { family: 'octicon', name: 'bookmark-fill' },
                type: 'FULL',
                label: 'Save',
              }),
        },
      ]}
    >
      {Content}
    </SwipeableRow>
  )
}
