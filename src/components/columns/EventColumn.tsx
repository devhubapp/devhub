import React, { PureComponent } from 'react'

import FlexSeparator from '../../components/common/FlexSeparator'
import EventCardsContainer, {
  EventCardsContainerProperties,
} from '../../containers/EventCardsContainer'
import theme from '../../styles/themes/dark'
import { getRequestTypeIconAndData } from '../../utils/helpers/github/events'
import CardItemSeparator from '../cards/partials/CardItemSeparator'
import Column from './Column'
import ColumnHeader from './ColumnHeader'
import ColumnHeaderItem from './ColumnHeaderItem'

export interface EventColumnProperties extends EventCardsContainerProperties {}

export interface EventColumnState {}

export default class EventColumn extends PureComponent<
  EventColumnProperties,
  EventColumnState
> {
  handlePress = () => {
    alert('Not implemented')
  }

  render() {
    const { events, subtype, swipeable, type, username } = this.props

    const requestTypeIconAndData = getRequestTypeIconAndData(type, subtype)

    return (
      <Column>
        <ColumnHeader>
          <ColumnHeaderItem
            backgroundColor={theme.base00}
            foregroundColor={theme.base04}
            icon={requestTypeIconAndData.icon}
            title="brunolemos"
            subtitle={requestTypeIconAndData.subtitle}
          />
          <FlexSeparator />
          <ColumnHeaderItem
            backgroundColor={theme.base00}
            foregroundColor={theme.base04}
            icon="chevron-down"
            onPress={this.handlePress}
          />
        </ColumnHeader>

        <CardItemSeparator />

        <EventCardsContainer
          events={events}
          subtype={subtype}
          swipeable={swipeable}
          type={type}
          username={username}
        />
      </Column>
    )
  }
}
