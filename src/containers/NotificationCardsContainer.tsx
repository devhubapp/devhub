import _ from 'lodash'
import React, { PureComponent } from 'react'

import NotificationCards, {
  NotificationCardsProps,
} from '../components/cards/NotificationCards'
import { IGitHubNotification } from '../types'

export type NotificationCardsContainerProps = Partial<
  NotificationCardsProps
> & {
  accessToken: string
}

export interface NotificationCardsContainerState {
  notifications: NotificationCardsProps['notifications']
}

export default class NotificationCardsContainer extends PureComponent<
  NotificationCardsContainerProps,
  NotificationCardsContainerState
> {
  static getDerivedStateFromProps(
    nextProps: NotificationCardsContainerProps,
    prevState: NotificationCardsContainerState,
  ) {
    if (
      nextProps.notifications &&
      nextProps.notifications !== prevState.notifications
    ) {
      return {
        notifications: nextProps.notifications,
      }
    }

    return null
  }

  fetchDataInterval?: number

  state: NotificationCardsContainerState = {
    notifications: this.props.notifications || [],
  }

  componentDidMount() {
    this.startFetchDataInterval()
  }

  componentWillUnmount() {
    this.clearFetchDataInterval()
  }

  fetchData = async () => {
    const { accessToken } = this.props

    try {
      const response = await fetch(
        `https://api.github.com/notifications?all=1&access_token=${accessToken}&timestamp=${Date.now()}`,
      )
      const notifications: IGitHubNotification[] = await response.json()
      if (Array.isArray(notifications)) {
        this.setState({
          notifications: _(notifications)
            .uniqBy('id')
            .orderBy(['unread', 'updated_at'], ['desc', 'desc'])
            .value(),
        })
      }
    } catch (error) {
      console.error(error)
      // Alert.alert('Failed to load notifications', `${error}`)
    }
  }

  startFetchDataInterval = () => {
    this.clearFetchDataInterval()
    this.fetchDataInterval = setInterval(this.fetchData, 1000 * 60)
    this.fetchData()
  }

  clearFetchDataInterval = () => {
    if (this.fetchDataInterval) clearInterval(this.fetchDataInterval)
  }

  render() {
    const { notifications } = this.state

    return <NotificationCards {...this.props} notifications={notifications} />
  }
}
