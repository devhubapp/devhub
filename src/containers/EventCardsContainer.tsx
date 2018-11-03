import _ from 'lodash'
import React, { PureComponent } from 'react'

import { EventCards, EventCardsProps } from '../components/cards/EventCards'
import { getActivity } from '../libs/github'
import { ActivityColumn, Omit } from '../types'
import { mergeSimilarEvent } from '../utils/helpers/github/events'

export type EventCardsContainerProps = Omit<EventCardsProps, 'events'> & {
  column: ActivityColumn
}

export interface EventCardsContainerState {
  events: EventCardsProps['events']
}

export class EventCardsContainer extends PureComponent<
  EventCardsContainerProps,
  EventCardsContainerState
> {
  fetchDataInterval?: number

  state: EventCardsContainerState = {
    events: [],
  }

  componentDidMount() {
    this.startFetchDataInterval()
  }

  componentWillUnmount() {
    this.clearFetchDataInterval()
  }

  fetchData = async () => {
    const { id: columnId, params, subtype: activityType } = this.props.column

    try {
      const response = await getActivity(activityType, params, { columnId })
      const events = response.data

      if (Array.isArray(events)) {
        const orderedEvents = _(events)
          .concat(this.state.events)
          .uniqBy('id')
          .orderBy(['updated_at', 'created_at'], ['desc', 'desc'])
          .value()
        const mergedEvents = mergeSimilarEvent(orderedEvents)
        this.setState({ events: mergedEvents })
      }
    } catch (error) {
      if (error && error.code === 304) return
      console.error('Failed to load GitHub activity', error)
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
    const { events } = this.state

    return <EventCards {...this.props} events={events} />
  }
}
