import _ from 'lodash'
import React, { PureComponent } from 'react'

import {
  Column,
  ColumnSubscription,
  NotificationSubscription,
  Omit,
} from 'shared-core/dist/types'
import { getFilteredNotifications } from 'shared-core/dist/utils/helpers/shared'
import {
  NotificationCards,
  NotificationCardsProps,
} from '../components/cards/NotificationCards'
import { getNotifications } from '../libs/github'

export type NotificationCardsContainerProps = Omit<
  NotificationCardsProps,
  'fetchNextPage' | 'notifications'
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
    perPage: 20,
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

  fetchData = async ({
    page = 1,
    perPage = 20,
  }: { page?: number; perPage?: number } = {}) => {
    const { subscriptions } = this.props
    const subscription = subscriptions[0] as NotificationSubscription

    const { params: _params } = subscription
    const params = { ..._params, page, per_page: perPage }

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
          canFetchMore: response.data.length >= perPage,
          notifications,
          page,
        })
      } else {
        this.setState({ canFetchMore: false, page })
      }
    } catch (error) {
      console.error('Failed to load GitHub notifications', error)
    }
  }

  startFetchDataInterval = () => {
    this.clearFetchDataInterval()
    this.fetchDataInterval = setInterval(this.fetchData, 1000 * 60) as any
    this.fetchData()
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
    const { canFetchMore, enhancedNotifications } = this.state

    return (
      <NotificationCards
        {...this.props}
        notifications={enhancedNotifications}
        fetchNextPage={canFetchMore ? this.fetchNextPage : undefined}
      />
    )
  }
}
