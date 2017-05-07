// @flow

import React from 'react'
import { Dimensions } from 'react-native'
import { List, Set } from 'immutable'

import { makeColumnReadIdsSelector } from '../../selectors/columns'

import ColumnWithList, {
  headerHeight,
  HeaderButtonsContainer,
  HeaderButtonIcon,
  HeaderButton,
} from './_ColumnWithList'

import ActionSheet from '../ActionSheet'
import CreateColumnUtils from '../utils/CreateColumnUtils'
import EventCardContainer from '../../containers/EventCardContainer'
import Platform from '../../libs/platform'
import { FullView } from '../cards/__CardComponents'
import { getRequestTypeIcon, requestTypes } from '../../api/github'

import { getDateWithHourAndMinuteText } from '../../utils/helpers'
import {
  getEventIdsFromEventsIncludingMerged,
} from '../../utils/helpers/github/events'

import type {
  ActionCreators,
  ColumnWithList as ColumnType,
  Subscription,
} from '../../utils/types'

const isWebWithBigHeight =
  Platform.realOS === 'web' && Dimensions.get('screen').height > 500

export default class EventColumn extends React.PureComponent {
  static contextTypes = {
    store: React.PropTypes.object.isRequired,
  }

  onRefresh = () => {
    const { column, actions: { updateColumnSubscriptions } } = this.props
    updateColumnSubscriptions(column.get('id'))
  }

  getEventIds = () => {
    const { items = List() } = this.props
    return typeof items.first() === 'string'
      ? items
      : getEventIdsFromEventsIncludingMerged(items)
  }

  getReadEventIds = () => {
    const { column } = this.props

    const store = this.context.store
    const state = store.getState()
    const columnId = column.get('id')

    this.columnReadIdsSelector =
      this.columnReadIdsSelector || makeColumnReadIdsSelector()

    const eventIds = this.getEventIds()
    const readEventsIds = this.columnReadIdsSelector(state, { columnId })
    return Set(readEventsIds).intersect(eventIds)
  }

  getUnreadEventIds = () => {
    const eventIds = this.getEventIds()
    const readIds = this.getReadEventIds()
    return Set(eventIds).subtract(readIds)
  }

  hasOnlyOneRepository = () => {
    const { subscriptions } = this.props

    return (
      subscriptions.size === 1 &&
      subscriptions.first().get('requestType') === requestTypes.REPO_EVENTS
    )
  }

  showActionSheet = () => {
    const { actions, column } = this.props

    const columnId = column.get('id')
    const title = (column.get('title') || '').toLowerCase()

    this.ActionSheet.show('', !isWebWithBigHeight && title, [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Create a column here',
        onPress: () => {
          CreateColumnUtils.showColumnTypeSelectAlert(
            actions,
            {
              createColumnOrder: column.get('order'),
            },
            this.ActionSheet.show,
          )
        },
      },
      {
        text: 'Mark all as read / unread',
        onPress: () => {
          const eventIds = this.getEventIds()
          const readIds = this.getReadEventIds()
          const unreadIds = this.getUnreadEventIds()

          if (readIds && readIds.size >= eventIds.size) {
            actions.markEventsAsUnread({
              all: true,
              columnId,
              eventIds: readIds,
            })
          } else {
            actions.markEventsAsRead({
              all: true,
              columnId,
              eventIds: unreadIds,
            })
          }
        },
      },
      {
        text: 'Clear read',
        onPress: () => {
          const eventIds = this.getEventIds()
          const readIds = this.getReadEventIds()
          const all = readIds.size === eventIds.size

          actions.deleteEvents({ all, columnId, eventIds: readIds })
        },
      },
      {
        text: 'Delete column',
        onPress: () => {
          actions.deleteColumn(columnId)
        },
        style: 'destructive',
      },
    ])
  }

  props: {
    actions: ActionCreators,
    column: ColumnType,
    errors?: ?Array<string>,
    items: Array<Object>,
    loading?: boolean,
    radius?: number,
    style?: ?Object,
    readIds: Array<string>,
    subscriptions: Array<Subscription>,
  }

  // to remember: eventOrEventId cant be an id for merged events
  // (because merged events are totally different than the on in the state)
  // so do the check: if(event.get('merged)) ? event : event.get('id')
  renderItem = ({ item: event }) =>
    event &&
    <EventCardContainer
      key={`event-card-container-${event.get('id')}`}
      actions={this.props.actions}
      eventOrEventId={event}
      onlyOneRepository={this.hasOnlyOneRepository()}
    />

  render() {
    const {
      column,
      errors,
      items,
      loading,
      subscriptions,
      style,
      ...props
    } = this.props

    if (!column) return null

    const title = (column.get('title') || '').toLowerCase()

    const updatedAt = subscriptions && subscriptions.size > 0
      ? subscriptions.first().get('updatedAt')
      : null

    const icon =
      (subscriptions && subscriptions.size > 0
        ? getRequestTypeIcon(subscriptions.first().get('requestType'))
        : '') || 'mark-github'

    const dateFromNowText = getDateWithHourAndMinuteText(updatedAt)
    const updatedText = dateFromNowText ? `Updated ${dateFromNowText}` : ''

    return (
      <FullView style={style}>
        <ColumnWithList
          {...props}
          key="event-column-_ColumnWithList"
          errors={errors}
          rightHeader={
            <HeaderButtonsContainer>
              <HeaderButton onPress={this.showActionSheet}>
                <HeaderButtonIcon name="chevron-down" />
              </HeaderButton>
            </HeaderButtonsContainer>
          }
          icon={icon}
          items={items}
          loading={loading}
          title={title}
          renderItem={this.renderItem}
          onRefresh={this.onRefresh}
          refreshText={updatedText}
        />

        <ActionSheet
          containerStyle={
            isWebWithBigHeight && {
              position: 'absolute',
              top: headerHeight,
              left: 0,
              right: 0,
            }
          }
          innerRef={ref => {
            this.ActionSheet = ref
          }}
        />
      </FullView>
    )
  }
}
