import _ from 'lodash'
import React, { PureComponent } from 'react'

import {
  NotificationCards,
  NotificationCardsProps,
} from '../components/cards/NotificationCards'
import { getNotifications } from '../libs/github'
import { NotificationColumn, Omit } from '../types'

export type NotificationCardsContainerProps = Omit<
  NotificationCardsProps,
  'notifications'
> & {
  column: NotificationColumn
}

export interface NotificationCardsContainerState {
  notifications: NotificationCardsProps['notifications']
}

export class NotificationCardsContainer extends PureComponent<
  NotificationCardsContainerProps,
  NotificationCardsContainerState
> {
  fetchDataInterval?: ReturnType<typeof setInterval>

  state: NotificationCardsContainerState = {
    notifications: [],
  }

  componentDidMount() {
    this.startFetchDataInterval()
  }

  componentWillUnmount() {
    this.clearFetchDataInterval()
  }

  fetchData = async () => {
    const { column } = this.props

    try {
      const response = await getNotifications({ all: column.params.all })

      const notifications = response.data
      if (Array.isArray(notifications)) {
        this.setState({
          notifications: _(notifications)
            .concat(this.state.notifications)
            .uniqBy('id')
            .orderBy(
              ['unread', 'updated_at', 'created_at'],
              ['desc', 'desc', 'desc'],
            )
            .value(),
        })
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
    const { notifications } = this.state

    return <NotificationCards {...this.props} notifications={notifications} />
  }
}
