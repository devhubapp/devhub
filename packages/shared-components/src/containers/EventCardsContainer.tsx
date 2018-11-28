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

export type EventCardsContainerProps = Omit<
  EventCardsProps,
  'events' | 'fetchNextPage' | 'state'
> & {
  column: Column
  subscriptions: ColumnSubscription[]
}

export interface EventCardsContainerState {
  canFetchMore: boolean
  enhancedEvents: EnhancedGitHubEvent[]
  events: GitHubEvent[]
  page: number
  perPage: number
  state: 'loading' | 'loading_first' | 'loading_more' | 'loaded'
}

export class EventCardsContainer extends PureComponent<
  EventCardsContainerProps,
  EventCardsContainerState
> {
  fetchDataInterval?: number

  state: EventCardsContainerState = {
    canFetchMore: false,
    enhancedEvents: [],
    events: [],
    page: 1,
    perPage: 10,
    state: 'loading_first',
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
        canFetchMore:
          (this.props.column.filters && this.props.column.filters.clearedAt) !==
          (prevProps.column.filters && prevProps.column.filters.clearedAt)
            ? this.calculateCanFetchMore(this.props.column, state.events)
            : state.canFetchMore,
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

  calculateCanFetchMore = (column: Column, events: GitHubEvent[]) => {
    const clearedAt = column.filters && column.filters.clearedAt
    const lastItem = events.slice(-1)[0]

    return !clearedAt || lastItem.created_at > clearedAt
  }

  fetchData = async ({
    page: _page,
    perPage: _perPage,
  }: { page?: number; perPage?: number } = {}) => {
    const { column, subscriptions } = this.props
    const {
      id: subscriptionId,
      params: _params,
      subtype: activityType,
    } = subscriptions[0] as ActivitySubscription

    const page = Math.max(1, _page || 1)
    const perPage = Math.min((_perPage || this.state.perPage || 10) * page, 100)

    try {
      this.setState(state => ({
        state:
          page > 1
            ? 'loading_more'
            : !state.state || state.state === 'loading_first'
            ? 'loading_first'
            : 'loading',
      }))

      const params = { ..._params, page, per_page: perPage }
      const response = await getActivity(activityType, params, {
        subscriptionId,
      })

      if (Array.isArray(response.data) && response.data.length) {
        const events = _.concat(response.data, this.state.events)

        this.setState({
          canFetchMore:
            response.data.length >= perPage &&
            this.calculateCanFetchMore(column, response.data),
          events,
          page,
          state: 'loaded',
        })
      } else {
        this.setState({ canFetchMore: false, page, state: 'loaded' })
      }
    } catch (error) {
      this.setState({ state: 'loaded' })
      console.error('Failed to load GitHub activity', error)
    }
  }

  startFetchDataInterval = () => {
    this.clearFetchDataInterval()
    this.fetchDataInterval = setInterval(this.fetchData, 1000 * 60) as any
    this.fetchData({ page: 1 })
  }

  clearFetchDataInterval = () => {
    if (this.fetchDataInterval) {
      clearInterval(this.fetchDataInterval)
      this.fetchDataInterval = undefined
    }
  }

  fetchNextPage = ({ perPage }: { perPage?: number } = {}) => {
    const nextPage = (this.state.page || 1) + 1
    this.fetchData({ page: nextPage, perPage })
  }

  render() {
    const { canFetchMore, enhancedEvents, state } = this.state

    return (
      <EventCards
        {...this.props}
        events={enhancedEvents}
        fetchNextPage={canFetchMore ? this.fetchNextPage : undefined}
        state={state}
      />
    )
  }
}
