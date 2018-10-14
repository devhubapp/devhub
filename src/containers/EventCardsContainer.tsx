import _ from 'lodash'
import React, { PureComponent } from 'react'
// import { Alert } from 'react-native'

import EventCards, { EventCardsProps } from '../components/cards/EventCards'
import {
  IGitHubEvent,
  IGitHubRequestSubType,
  IGitHubRequestType,
} from '../types'
import { mergeSimilarEvent } from '../utils/helpers/github/events'

export type EventCardsContainerProps = Partial<EventCardsProps> & {
  accessToken: string
  subtype?: IGitHubRequestSubType
  type: IGitHubRequestType
  username: string
}

export interface EventCardsContainerState {
  events: EventCardsProps['events']
}

export default class EventCardsContainer extends PureComponent<
  EventCardsContainerProps,
  EventCardsContainerState
> {
  static getDerivedStateFromProps(
    nextProps: EventCardsContainerProps,
    prevState: EventCardsContainerState,
  ) {
    if (nextProps.events && nextProps.events !== prevState.events) {
      return {
        events: nextProps.events,
      }
    }

    return null
  }

  fetchDataInterval?: number

  state: EventCardsContainerState = {
    events: this.props.events || [],
  }

  componentDidMount() {
    this.startFetchDataInterval()
  }

  componentWillUnmount() {
    this.clearFetchDataInterval()
  }

  fetchData = async () => {
    const { accessToken, subtype, type, username } = this.props

    try {
      const response = await fetch(
        `https://api.github.com/${type}/${username}/${subtype}?access_token=${accessToken}&timestamp=${Date.now()}`,
      )
      const events: IGitHubEvent[] = await response.json()
      if (Array.isArray(events)) {
        const orderedEvents = _(events)
          .uniqBy('id')
          .orderBy(['updated_at'], ['desc'])
          .value()
        const mergedEvents = mergeSimilarEvent(orderedEvents)
        this.setState({ events: mergedEvents })
      }
    } catch (error) {
      console.error(error)
      // Alert.alert('Failed to load events', `${error}`)
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
    const { events } = this.state
    const { repoIsKnown } = this.props

    return <EventCards events={events} repoIsKnown={repoIsKnown} />
  }
}
