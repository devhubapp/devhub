import _ from 'lodash'
import React, { PureComponent } from 'react'

import {
  ActivitySubscription,
  Column,
  ColumnSubscription,
  EnhancedGitHubEvent,
  GitHubEvent,
  Omit,
} from 'shared-core/dist/types'
import { getFilteredEvents } from 'shared-core/dist/utils/helpers/shared'
import { EventCards, EventCardsProps } from '../components/cards/EventCards'
import { getActivity } from '../libs/github'

export type EventCardsContainerProps = Omit<EventCardsProps, 'events'> & {
  column: Column
  subscriptions: ColumnSubscription[]
}

export interface EventCardsContainerState {
  enhancedEvents: EnhancedGitHubEvent[]
  events: GitHubEvent[]
}

export class EventCardsContainer extends PureComponent<
  EventCardsContainerProps,
  EventCardsContainerState
> {
  fetchDataInterval?: ReturnType<typeof setInterval>

  state: EventCardsContainerState = {
    enhancedEvents: [],
    events: [],
  }

  componentDidMount() {
    this.startFetchDataInterval()
  }

  componentDidUpdate(
    prevProps: EventCardsContainerProps,
    prevState: EventCardsContainerState,
  ) {
    if (
      this.props.column !== prevProps.column ||
      this.state.events !== prevState.events
    ) {
      this.setState(state => ({
        enhancedEvents: getFilteredEvents(
          state.events,
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
    const {
      id: subscriptionId,
      params,
      subtype: activityType,
    } = subscriptions[0] as ActivitySubscription
    try {
      const response = await getActivity(activityType, params, {
        subscriptionId,
      })
      if (Array.isArray(response.data)) {
        const events = _.concat(response.data, this.state.events)
        this.setState({ events })
      }
    } catch (error) {
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
    const { enhancedEvents } = this.state

    return <EventCards {...this.props} events={enhancedEvents} />
  }
}
