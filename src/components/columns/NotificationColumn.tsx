import React, { PureComponent } from 'react'

import FlexSeparator from '../../components/common/FlexSeparator'
import NotificationCardsContainer, {
  NotificationCardsContainerProperties,
} from '../../containers/NotificationCardsContainer'
import theme from '../../styles/themes/dark'
import CardItemSeparator from '../cards/partials/CardItemSeparator'
import Column from './Column'
import ColumnHeader from './ColumnHeader'
import ColumnHeaderItem from './ColumnHeaderItem'

export interface NotificationColumnProperties
  extends NotificationCardsContainerProperties {}

export interface NotificationColumnState {}

export default class NotificationColumn extends PureComponent<
  NotificationColumnProperties,
  NotificationColumnState
> {
  handlePress = () => {
    alert('Not implemented')
  }

  render() {
    return (
      <Column>
        <ColumnHeader>
          <ColumnHeaderItem
            backgroundColor={theme.base00}
            foregroundColor={theme.base04}
            icon="bell"
            title="Notifications"
            subtitle="All"
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

        <NotificationCardsContainer {...this.props} />
      </Column>
    )
  }
}
