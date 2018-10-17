import React, { PureComponent } from 'react'

import FlexSeparator from '../../components/common/FlexSeparator'
import NotificationCardsContainer, {
  NotificationCardsContainerProps,
} from '../../containers/NotificationCardsContainer'
import { getColumnHeaderDetails } from '../../utils/helpers/github/events'
import CardItemSeparator from '../cards/partials/CardItemSeparator'
import Column from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'

export interface NotificationColumnProps
  extends NotificationCardsContainerProps {}

export interface NotificationColumnState {}

export class NotificationColumn extends PureComponent<
  NotificationColumnProps,
  NotificationColumnState
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
            iconName={requestTypeIconAndData.icon}
            subtitle={requestTypeIconAndData.subtitle}
            title={requestTypeIconAndData.title}
          />
          <FlexSeparator />
          <ColumnHeaderItem
            iconName="chevron-down"
            onPress={this.handlePress}
          />
        </ColumnHeader>

        <CardItemSeparator />

        <NotificationCardsContainer {...this.props} />
      </Column>
    )
  }
}
