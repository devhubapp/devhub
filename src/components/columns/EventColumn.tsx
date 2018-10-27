import React, { PureComponent } from 'react'

import { Spacer } from '../../components/common/Spacer'
import {
  EventCardsContainer,
  EventCardsContainerProps,
} from '../../containers/EventCardsContainer'
import { getColumnHeaderDetails } from '../../utils/helpers/github/events'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'

export interface EventColumnProps extends EventCardsContainerProps {}

export interface EventColumnState {}

export class EventColumn extends PureComponent<
  EventColumnProps,
  EventColumnState
> {
  handlePress = () => {
    alert('Not implemented')
  }

  render() {
    const { column } = this.props

    const requestTypeIconAndData = getColumnHeaderDetails(column)

    return (
      <Column>
        <ColumnHeader>
          <ColumnHeaderItem
            avatarDetails={requestTypeIconAndData.avatarDetails}
            iconName={requestTypeIconAndData.icon}
            subtitle={requestTypeIconAndData.subtitle}
            title={requestTypeIconAndData.title}
          />
          <Spacer flex={1} />
          <ColumnHeaderItem
            iconName="chevron-down"
            onPress={this.handlePress}
          />
        </ColumnHeader>

        <CardItemSeparator />

        <EventCardsContainer
          repoIsKnown={requestTypeIconAndData.repoIsKnown}
          {...this.props}
        />
      </Column>
    )
  }
}
