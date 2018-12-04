import axios, { CancelToken } from 'axios'
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
import { getNotifications } from '../libs/github'
import { useReduxState } from '../redux/hooks/use-redux-state'
import * as selectors from '../redux/selectors'
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

    const [hasFetched, setHasFetched] = useState(false)
    const [canFetchMore, setCanFetchMore] = useState(false)
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
    const fetchDataCancelTokenRef = useRef(axios.CancelToken.source())
    const fetchNextPageCancelTokenRef = useRef(axios.CancelToken.source())

    useEffect(() => {
      fetchDataCancelTokenRef.current = axios.CancelToken.source()
      fetchData({ cancelToken: fetchDataCancelTokenRef.current.token })

      return () => {
        fetchDataCancelTokenRef.current.cancel()
        if (fetchNextPageCancelTokenRef.current)
          fetchNextPageCancelTokenRef.current.cancel()
      }
    }, [])

    useEffect(() => {
      fetchDataCancelTokenRef.current = axios.CancelToken.source()

      const timer = setInterval(() => {
        fetchData({ cancelToken: fetchDataCancelTokenRef.current.token })
      }, 1000 * 60)

      return () => {
        clearInterval(timer)
        fetchDataCancelTokenRef.current.cancel()
      }
    })

    useEffect(
      () => {
        const cancelTokenSource = axios.CancelToken.source()
        ;(async () => {
          const enhancementMap = await fetchNotificationsEnhancements(
            notifications,
            { cancelToken: cancelTokenSource.token, githubToken },
          )

          setEnhancedNotifications(currentEnhancedNotifications =>
            enhanceNotifications(
              notifications,
              enhancementMap,
              currentEnhancedNotifications,
            ),
          )
        })()

        return () => cancelTokenSource.cancel()
      },
      [notifications, githubToken],
    )

    useEffect(
      () => {
        if (!hasFetched) return
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

    useEffect(
      () => {
        const clearedAt = column.filters && column.filters.clearedAt
        const olderDate = getOlderNotificationDate(notifications)

        setCanFetchMore(!clearedAt || !olderDate || clearedAt < olderDate)
      },
      [column.filters && column.filters.clearedAt],
    )

    const fetchData = async ({
      cancelToken,
      page: _page,
      perPage: _perPage,
    }: {
      cancelToken: CancelToken
      page?: number
      perPage?: number
    }) => {
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
          cancelToken,
          githubToken,
          subscriptionId,
        })

        if (!hasFetched) setHasFetched(true)

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
      } catch (error) {
        console.error('Failed to load GitHub notifications', error)
        setLoadState('loaded')
      }
    }

    const fetchNextPage = ({ perPage }: { perPage?: number } = {}) => {
      const nextPage = (pagination.page || 1) + 1

      fetchNextPageCancelTokenRef.current = axios.CancelToken.source()
      fetchData({
        cancelToken: fetchNextPageCancelTokenRef.current.token,
        page: nextPage,
        perPage,
      })
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
