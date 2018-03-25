import _ from 'lodash'
import React, { PureComponent } from 'react'
import { Alert } from 'react-native'

import NotificationCards from '../components/cards/NotificationCards'
import { IGitHubNotification } from '../types'

export interface IProps {}

export interface IState {
  notifications: IGitHubNotification[]
}

export default class NotificationCardsContainer extends PureComponent<
  IProps,
  IState
> {
  state: IState = {
    notifications: [],
  }

  async componentDidMount() {
    try {
      const response = await fetch(
        `https://api.github.com/notifications?all=1&access_token=fae0e8d5d55b71afb4c59d6abb89fce457c48160&timestamp=${Date.now()}`,
      )
      const notifications = await response.json()
      if (Array.isArray(notifications)) {
        this.setState({
          notifications: _.orderBy(notifications, ['updated_at'], ['desc']),
        })
      }
    } catch (error) {
      console.error(error)
      Alert.alert('Failed to load notifications', `${error}`)
    }
  }

  render() {
    const { notifications } = this.state

    return <NotificationCards notifications={notifications} />
  }
}
