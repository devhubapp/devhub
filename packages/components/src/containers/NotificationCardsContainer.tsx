import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'

import {
  Column,
  ColumnSubscription,
  EnhancedGitHubNotification,
  enhanceNotifications,
  fetchNotificationsEnhancements,
  GitHubNotification,
  LoadState,
  NotificationSubscription,
  Omit,
} from '@devhub/core'
import {
  NotificationCards,
  NotificationCardsProps,
} from '../components/cards/NotificationCards'
import { getNotifications, octokit } from '../libs/github'
import { useReduxState } from '../redux/hooks/use-redux-state'
import * as selectors from '../redux/selectors'
import { getFilteredNotifications } from '../utils/helpers/filters'

export type NotificationCardsContainerProps = Omit<
  NotificationCardsProps,
  'errorMessage' | 'notifications' | 'fetchNextPage' | 'loadState' | 'refresh'
> & {
  column: Column
  subscriptions: ColumnSubscription[]
}

export const NotificationCardsContainer = React.memo(
  (props: NotificationCardsContainerProps) => {
    const { column, subscriptions } = props

    const cacheRef = useRef(new Map())
    const hasFetchedRef = useRef(false)
    const [_canFetchMore, setCanFetchMore] = useState(false)
    const [notifications, setNotifications] = useState<GitHubNotification[]>([])
    const [filteredNotifications, setFilteredNotifications] = useState<
      GitHubNotification[]
    >([])
    const [enhancedNotifications, setEnhancedNotifications] = useState<
      EnhancedGitHubNotification[]
    >([])
    const [olderNotificationDate, setOlderNotificationDate] = useState<
      string | undefined
    >(undefined)
    const [loadState, setLoadState] = useState<LoadState>('loading_first')
    const [pagination, setPagination] = useState({ page: 1, perPage: 10 })
    const githubToken = useReduxState(selectors.githubTokenSelector)!

    const [error, setError] = useState<{
      [key: string]: any
      message: string
    } | null>(null)

    useEffect(() => {
      fetchData()
    }, [])

    useEffect(() => {
      const timer = setInterval(fetchData, 1000 * 60)
      return () => clearInterval(timer)
    })

    useEffect(
      () => {
        ;(async () => {
          const enhancementMap = await fetchNotificationsEnhancements(
            notifications,
            { cache: cacheRef.current, githubToken },
          )

          setEnhancedNotifications(currentEnhancedNotifications =>
            enhanceNotifications(
              notifications,
              enhancementMap,
              currentEnhancedNotifications,
            ),
          )
        })()
      },
      [notifications],
    )

    useEffect(
      () => {
        if (!hasFetchedRef.current) return
        setLoadState('loaded')
      },
      [enhancedNotifications],
    )

    useEffect(
      () => {
        setFilteredNotifications(
          getFilteredNotifications(enhancedNotifications, column.filters),
        )
      },
      [enhancedNotifications, column.filters],
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
            : !prevLoadState ||
              prevLoadState === 'not_loaded' ||
              prevLoadState === 'loading_first'
            ? 'loading_first'
            : 'loading',
        )

        const params = { ..._params, page, per_page: perPage }
        const response = await getNotifications(params, {
          subscriptionId,
        })

        if (!hasFetchedRef.current) hasFetchedRef.current = true

        if (Array.isArray(response.data) && response.data.length) {
          const olderDateFromThisResponse = getOlderNotificationDate(
            response.data,
          )

          setNotifications(prevNotifications =>
            _.uniqBy(_.concat(response.data, prevNotifications), 'id'),
          )
          setPagination(prevPagination => ({ ...prevPagination, page }))
          // setLoadState('loaded') // moved to the enchancement effect

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
        setError(null)
      } catch (error) {
        console.error('Failed to load GitHub notifications', error)
        setLoadState('error')
        setError(error)
      }
    }

    const fetchNextPage = ({ perPage }: { perPage?: number } = {}) => {
      const nextPage = (pagination.page || 1) + 1
      fetchData({ page: nextPage, perPage })
    }

    const canFetchMore = (() => {
      const clearedAt = column.filters && column.filters.clearedAt
      const olderDate = getOlderNotificationDate(notifications)

      if (clearedAt && olderDate && clearedAt >= olderDate) return false
      return _canFetchMore
    })()

    return (
      <NotificationCards
        {...props}
        key={`notification-cards-${column.id}`}
        errorMessage={(error && error.message) || ''}
        fetchNextPage={canFetchMore ? fetchNextPage : undefined}
        loadState={loadState}
        notifications={filteredNotifications}
        refresh={() => fetchData()}
      />
    )
  },
)

function getOlderNotificationDate(notifications: GitHubNotification[]) {
  const olderItem = _.orderBy(notifications, 'updated_at', 'asc')[0]
  return olderItem && olderItem.updated_at
}
