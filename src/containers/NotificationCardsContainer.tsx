import _ from 'lodash'
import React, { PureComponent } from 'react'
// import { Alert } from 'react-native'

import NotificationCards, {
  NotificationCardsProperties,
} from '../components/cards/NotificationCards'

export type NotificationCardsContainerProperties = {
  [key in keyof NotificationCardsProperties]?: NotificationCardsProperties[key]
}

export interface NotificationCardsContainerState {
  notifications: NotificationCardsProperties['notifications']
}

export default class NotificationCardsContainer extends PureComponent<
  NotificationCardsContainerProperties,
  NotificationCardsContainerState
> {
  static getDerivedStateFromProps(
    nextProps: NotificationCardsContainerProperties,
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

  state: NotificationCardsContainerState = {
    notifications: this.props.notifications || [],
  }

  componentDidMount() {
    if (!this.state.notifications.length) this.fetchData()
  }

  fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/notifications?all=1&access_token=fae0e8d5d55b71afb4c59d6abb89fce457c48160&timestamp=${Date.now()}`,
      )
      const notifications = await response.json()
      if (Array.isArray(notifications)) {
        this.setState({
          notifications: _.orderBy(
            notifications,
            ['unread', 'updated_at'],
            ['desc', 'desc'],
          ),
        })
      }
    } catch (error) {
      console.error(error)
      // Alert.alert('Failed to load notifications', `${error}`)
    }
  }

  render() {
    const { notifications } = this.state

    return <NotificationCards {...this.props} notifications={notifications} />
  }
}
