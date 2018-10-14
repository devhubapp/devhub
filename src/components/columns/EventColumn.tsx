import React, { PureComponent } from 'react'

import FlexSeparator from '../../components/common/FlexSeparator'
import EventCardsContainer, {
  EventCardsContainerProps,
} from '../../containers/EventCardsContainer'
import { getColumnHeaderDetails } from '../../utils/helpers/github/events'
import { getOwnerAndRepo } from '../../utils/helpers/github/shared'
import CardItemSeparator from '../cards/partials/CardItemSeparator'
import Column from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'

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
    const { subtype, type, username } = this.props

    const requestTypeIconAndData = getColumnHeaderDetails({
      subtype,
      type,
      username,
    })

    return (
      <Column>
        <ColumnHeader>
          <ColumnHeaderItem
            iconName={requestTypeIconAndData.icon}
            repo={getOwnerAndRepo(username).repo}
            showAvatarAsIcon={requestTypeIconAndData.showAvatarAsIcon}
            subtitle={requestTypeIconAndData.subtitle}
            title={requestTypeIconAndData.title}
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
