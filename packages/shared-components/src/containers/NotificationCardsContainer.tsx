import _ from 'lodash'
import React, { PureComponent } from 'react'

import {
  Column,
  ColumnSubscription,
  GitHubNotification,
  NotificationSubscription,
  Omit,
} from 'shared-core/dist/types'
import {
  NotificationCards,
  NotificationCardsProps,
} from '../components/cards/NotificationCards'
import { getNotifications } from '../libs/github'
import { getFilteredNotifications } from '../utils/helpers/filters'

export type NotificationCardsContainerProps = Omit<
  NotificationCardsProps,
  'fetchNextPage' | 'notifications' | 'state'
> & {
  column: Column
  subscriptions: ColumnSubscription[]
}

export interface NotificationCardsContainerState {
  canFetchMore: boolean
  enhancedNotifications: NotificationCardsProps['notifications']
  notifications: NotificationCardsProps['notifications']
  page: number
  perPage: number
  state: 'loading' | 'loading_first' | 'loading_more' | 'loaded'
}

export class NotificationCardsContainer extends PureComponent<
  NotificationCardsContainerProps,
  NotificationCardsContainerState
> {
  fetchDataInterval?: number

  state: NotificationCardsContainerState = {
    canFetchMore: false,
    enhancedNotifications: [],
    notifications: [],
    page: 1,
    perPage: 10,
    state: 'loading_first',
  }

  componentDidMount() {
    this.startFetchDataInterval()
  }

  componentDidUpdate(
    prevProps: NotificationCardsContainerProps,
    prevState: NotificationCardsContainerState,
  ) {
    if (
      this.props.column !== prevProps.column ||
      this.state.notifications !== prevState.notifications
    ) {
      this.setState(state => ({
        canFetchMore:
          (this.props.column.filters && this.props.column.filters.clearedAt) !==
          (prevProps.column.filters && prevProps.column.filters.clearedAt)
            ? this.calculateCanFetchMore(this.props.column, state.notifications)
            : state.canFetchMore,
        enhancedNotifications: getFilteredNotifications(
          state.notifications,
          this.props.column.filters,
        ),
      }))
    }
  }

  componentWillUnmount() {
    this.clearFetchDataInterval()
  }

  calculateCanFetchMore = (
    column: Column,
    notifications: GitHubNotification[],
  ) => {
    const clearedAt = column.filters && column.filters.clearedAt
    const lastItem = notifications.slice(-1)[0]

    return !clearedAt || lastItem.updated_at > clearedAt
  }

  fetchData = async ({
    page: _page,
    perPage: _perPage,
  }: { page?: number; perPage?: number } = {}) => {
    const { column, subscriptions } = this.props
    const subscription = subscriptions[0] as NotificationSubscription

    const page = Math.max(1, _page || 1)
    const perPage = Math.min((_perPage || this.state.perPage || 10) * page, 100)

    const { params: _params } = subscription
    const params = { ..._params, page, per_page: perPage }

    this.setState(state => ({
      state:
        page > 1
          ? 'loading_more'
          : !state.state || state.state === 'loading_first'
          ? 'loading_first'
          : 'loading',
    }))

    try {
      const response = await getNotifications(params, {
        subscriptionId: subscription.id,
      })
      if (Array.isArray(response.data) && response.data.length) {
        const notifications = _.concat(
          response.data as any,
          this.state.notifications,
        )

        this.setState({
          canFetchMore:
            response.data.length >= perPage &&
            this.calculateCanFetchMore(column, response.data),
          notifications,
          page,
          state: 'loaded',
        })
      } else {
        this.setState({ canFetchMore: false, page, state: 'loaded' })
      }
    } catch (error) {
      this.setState({ state: 'loaded' })
      console.error('Failed to load GitHub notifications', error)
    }
  }

  startFetchDataInterval = () => {
    this.clearFetchDataInterval()
    this.fetchDataInterval = setInterval(this.fetchData, 1000 * 60) as any
    this.fetchData({ page: 1 })
  }

  clearFetchDataInterval = () => {
    if (this.fetchDataInterval) {
      clearInterval(this.fetchDataInterval)
      this.fetchDataInterval = undefined
    }
  }

  fetchNextPage = ({ perPage }: { perPage?: number } = {}) => {
    const nextPage = (this.state.page || 1) + 1
    this.fetchData({ page: nextPage, perPage })
  }

  render() {
    const { canFetchMore, enhancedNotifications, state } = this.state

    return (
      <NotificationCards
        {...this.props}
        notifications={enhancedNotifications}
        fetchNextPage={canFetchMore ? this.fetchNextPage : undefined}
        state={state}
      />
    )
  }
}
