import _ from 'lodash'
import React, { PureComponent } from 'react'
import { Alert } from 'react-native'

import EventCards from '../components/cards/EventCards'
import { IGitHubEvent } from '../types'

export interface IProps {}

export interface IState {
  events: IGitHubEvent[]
}

export default class EventCardsContainer extends PureComponent<IProps, IState> {
  state: IState = {
    events: [],
  }

  async componentDidMount() {
    try {
      const response = await fetch(
        `https://api.github.com/users/brunolemos/received_events?access_token=fae0e8d5d55b71afb4c59d6abb89fce457c48160&timestamp=${Date.now()}`,
      )
      const events = await response.json()
      if (Array.isArray(events)) {
        this.setState({ events: _.orderBy(events, ['updated_at'], ['desc']) })
      }
    } catch (error) {
      console.error(error)
      Alert.alert('Failed to load events', `${error}`)
    }
  }

  render() {
    const { events } = this.state

    return <EventCards events={events} />
  }
}
