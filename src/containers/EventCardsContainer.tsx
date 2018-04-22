import _ from 'lodash'
import React, { PureComponent } from 'react'
// import { Alert } from 'react-native'

import EventCards, {
  EventCardsProperties,
} from '../components/cards/EventCards'

export type EventCardsContainerProperties = {
  [key in keyof EventCardsProperties]?: EventCardsProperties[key]
}

export interface EventCardsContainerState {
  events: EventCardsProperties['events']
}

export default class EventCardsContainer extends PureComponent<
  EventCardsContainerProperties,
  EventCardsContainerState
> {
  static getDerivedStateFromProps(
    nextProps: EventCardsContainerProperties,
    prevState: EventCardsContainerState,
  ) {
    if (nextProps.events && nextProps.events !== prevState.events) {
      return {
        events: nextProps.events,
      }
    }

    return null
  }

  state: EventCardsContainerState = {
    events: this.props.events || [],
  }

  componentDidMount() {
    if (!this.state.events.length) this.fetchData()
  }

  fetchData = async () => {
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
      // Alert.alert('Failed to load events', `${error}`)
    }
  }

  render() {
    const { events } = this.state

    return <EventCards {...this.props} events={events} />
  }
}
