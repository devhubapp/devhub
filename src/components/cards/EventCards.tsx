import React from 'react'
import { FlatList } from 'react-native'

import theme from '../../styles/themes/dark'
import { contentPadding } from '../../styles/variables'
import { IGitHubEvent } from '../../types'
import TransparentTextOverlay from '../common/TransparentTextOverlay'
import CardItemSeparator from './partials/CardItemSeparator'
import SwipeableEventCard from './SwipeableEventCard'

export interface IProps {
  events: IGitHubEvent[]
}

class EventCards extends React.PureComponent<IProps> {
  keyExtractor(event: IGitHubEvent) {
    return `${event.id}`
  }

  renderItem({ item: event }: { item: IGitHubEvent }) {
    return <SwipeableEventCard key={`event-card-${event.id}`} event={event} />
  }

  render() {
    const { events } = this.props

    return (
      <TransparentTextOverlay
        color={theme.base02}
        size={contentPadding}
        from="vertical"
      >
        <FlatList
          data={events}
          ItemSeparatorComponent={CardItemSeparator}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </TransparentTextOverlay>
    )
  }
}

export default EventCards
