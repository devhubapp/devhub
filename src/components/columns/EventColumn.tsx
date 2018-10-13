import React, { PureComponent } from 'react'

import FlexSeparator from '../../components/common/FlexSeparator'
import EventCardsContainer, {
  EventCardsContainerProps,
} from '../../containers/EventCardsContainer'
import { getRequestTypeIconAndData } from '../../utils/helpers/github/events'
import { getOwnerAndRepo } from '../../utils/helpers/github/shared'
import CardItemSeparator from '../cards/partials/CardItemSeparator'
import Column from './Column'
import ColumnHeader from './ColumnHeader'
import ColumnHeaderItem from './ColumnHeaderItem'

export interface EventColumnProps extends EventCardsContainerProps {}

export interface EventColumnState {}

export default class EventColumn extends PureComponent<
  EventColumnProps,
  EventColumnState
> {
  handlePress = () => {
    alert('Not implemented')
  }

  render() {
    const { showAvatarAsIcon, subtype, type, username } = this.props

    const requestTypeIconAndData = getRequestTypeIconAndData(type, subtype!)

    return (
      <Column>
        <ColumnHeader>
          <ColumnHeaderItem
            iconName={requestTypeIconAndData.icon}
            repo={getOwnerAndRepo(username).repo}
            showAvatarAsIcon={showAvatarAsIcon}
            subtitle={requestTypeIconAndData.subtitle}
            title={username}
            username={getOwnerAndRepo(username).owner}
          />
          <FlexSeparator />
          <ColumnHeaderItem
            iconName="chevron-down"
            onPress={this.handlePress}
            username={username}
          />
        </ColumnHeader>

        <CardItemSeparator />

        <EventCardsContainer {...this.props} />
      </Column>
    )
  }
}
