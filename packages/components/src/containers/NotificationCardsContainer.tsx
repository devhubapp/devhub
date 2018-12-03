import _ from 'lodash'
import React, { useEffect, useState } from 'react'

import {
  Column,
  ColumnSubscription,
  GitHubNotification,
  LoadState,
  NotificationSubscription,
  Omit,
} from '@devhub/core/dist/types'
import { getOwnerAndRepo } from '@devhub/core/dist/utils/helpers/github/shared'
import {
  getCommentIdFromUrl,
  getCommitShaFromUrl,
  getIssueOrPullRequestNumberFromUrl,
  getReleaseIdFromUrl,
} from '@devhub/core/dist/utils/helpers/github/url'
import {
  NotificationCards,
  NotificationCardsProps,
} from '../components/cards/NotificationCards'
import { getNotifications } from '../libs/github'
import { getFilteredNotifications } from '../utils/helpers/filters'

export type NotificationCardsContainerProps = Omit<
  NotificationCardsProps,
  'notifications' | 'fetchNextPage' | 'loadState'
> & {
  column: Column
  subscriptions: ColumnSubscription[]
}

export const NotificationCardsContainer = React.memo(
  (props: NotificationCardsContainerProps) => {
    const { column, subscriptions } = props

    const [canFetchMore, setCanFetchMore] = useState(false)
    const [notifications, setNotifications] = useState<GitHubNotification[]>([])
    const [filteredNotifications, setFilteredNotifications] = useState<
      GitHubNotification[]
    >([])
    const [olderNotificationDate, setOlderNotificationDate] = useState<
      string | undefined
    >(undefined)
    const [loadState, setLoadState] = useState<LoadState>('loading_first')
    const [pagination, setPagination] = useState({ page: 1, perPage: 10 })

    useEffect(() => {
      fetchData()
    }, [])

    useEffect(() => {
      const timer = setInterval(fetchData, 1000 * 60)
      return () => clearInterval(timer)
    })

    useEffect(
      () => {
        setFilteredNotifications(
          getFilteredNotifications(notifications, column.filters),
        )
      },
      [notifications, column.filters],
    )

    useEffect(
      () => {
        const clearedAt = column.filters && column.filters.clearedAt
        const olderDate = getOlderNotificationDate(notifications)

        setCanFetchMore(!clearedAt || !olderDate || clearedAt < olderDate)
      },
      [column.filters && column.filters.clearedAt],
    )

    const fetchData = async ({
      page: _page,
      perPage: _perPage,
    }: { page?: number; perPage?: number } = {}) => {
      const {
        id: subscriptionId,
        params: _params,
      } = subscriptions[0] as NotificationSubscription

      const page = Math.max(1, _page || 1)
      const perPage = Math.min(_perPage || pagination.perPage || 10, 50)

      try {
        setLoadState(prevLoadState =>
          page > 1
            ? 'loading_more'
            : !prevLoadState || prevLoadState === 'loading_first'
            ? 'loading_first'
            : 'loading',
        )

        const params = { ..._params, page, per_page: perPage }
        const response = await getNotifications(params, {
          subscriptionId,
        })

        if (Array.isArray(response.data) && response.data.length) {
          const olderDateFromThisResponse = getOlderNotificationDate(
            response.data,
          )

          setNotifications(prevNotifications =>
            _.uniqBy(_.concat(response.data, prevNotifications), 'id'),
          )
          setPagination(prevPagination => ({ ...prevPagination, page }))
          setLoadState('loaded')

          if (
            !olderNotificationDate ||
            (olderDateFromThisResponse &&
              olderDateFromThisResponse <= olderNotificationDate)
          ) {
            setOlderNotificationDate(olderDateFromThisResponse)

            if (response.data.length >= perPage) {
              const clearedAt = column.filters && column.filters.clearedAt
              if (clearedAt && clearedAt >= olderDateFromThisResponse) {
                setCanFetchMore(false)
              } else {
                setCanFetchMore(true)
              }
            } else {
              setCanFetchMore(false)
            }
          }
        } else {
          setLoadState('loaded')
          setPagination(prevPagination => ({ ...prevPagination, page }))
          setCanFetchMore(false)
        }
      } catch (error) {
        console.error('Failed to load GitHub notifications', error)
        setLoadState('loaded')
      }
    }

    const fetchNextPage = ({ perPage }: { perPage?: number } = {}) => {
      const nextPage = (pagination.page || 1) + 1
      fetchData({ page: nextPage, perPage })
    }

    return (
      <NotificationCards
        {...props}
        key={`notification-cards-${column.id}`}
        notifications={filteredNotifications}
        fetchNextPage={canFetchMore ? fetchNextPage : undefined}
        loadState={loadState}
      />
    )
  },
)

function getOlderNotificationDate(notifications: GitHubNotification[]) {
  const olderItem = _.orderBy(notifications, 'updated_at', 'asc')[0]
  return olderItem && olderItem.updated_at
}
