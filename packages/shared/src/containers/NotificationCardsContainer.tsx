import _ from 'lodash'
import React, { PureComponent } from 'react'

import {
  NotificationCards,
  NotificationCardsProps,
} from '../components/cards/NotificationCards'
import { getNotifications } from '../libs/github'
import {
  Column,
  ColumnSubscription,
  NotificationSubscription,
  Omit,
} from '../types'
import { getFilteredNotifications } from '../utils/helpers/shared'

export type NotificationCardsContainerProps = Omit<
  NotificationCardsProps,
  'notifications'
> & {
  column: Column
  subscriptions: ColumnSubscription[]
}

export interface NotificationCardsContainerState {
  enhancedNotifications: NotificationCardsProps['notifications']
  notifications: NotificationCardsProps['notifications']
}

export class NotificationCardsContainer extends PureComponent<
  NotificationCardsContainerProps,
  NotificationCardsContainerState
> {
  fetchDataInterval?: ReturnType<typeof setInterval>

  state: NotificationCardsContainerState = {
    enhancedNotifications: [],
    notifications: [],
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

  fetchData = async () => {
    const { subscriptions } = this.props
    const subscription = subscriptions[0] as NotificationSubscription

    try {
      const response = await getNotifications({
        all: subscription.params.all,
      })
      if (Array.isArray(response.data)) {
        const notifications = _.concat(
          response.data as any,
          this.state.notifications,
        )

        this.setState({ notifications })
      }
    } catch (error) {
      if (error && error.code === 304) return
      console.error('Failed to load GitHub notifications', error)
    }
  }

  startFetchDataInterval = () => {
    this.clearFetchDataInterval()
    this.fetchDataInterval = setInterval(this.fetchData, 1000 * 60)
    this.fetchData()
  }

  clearFetchDataInterval = () => {
    if (this.fetchDataInterval) {
      clearInterval(this.fetchDataInterval)
      this.fetchDataInterval = undefined
    }
  }

  render() {
    const { enhancedNotifications } = this.state

    return (
      <NotificationCards
        {...this.props}
        notifications={enhancedNotifications}
      />
    )
  }
}
