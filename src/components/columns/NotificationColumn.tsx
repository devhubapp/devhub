import React, { PureComponent } from 'react'

import FlexSeparator from '../../components/common/FlexSeparator'
import NotificationCardsContainer, {
  NotificationCardsContainerProps,
} from '../../containers/NotificationCardsContainer'
import theme from '../../styles/themes/dark'
import CardItemSeparator from '../cards/partials/CardItemSeparator'
import Column from './Column'
import ColumnHeader from './ColumnHeader'
import ColumnHeaderItem from './ColumnHeaderItem'

export interface NotificationColumnProps
  extends NotificationCardsContainerProps {}

export interface NotificationColumnState {}

export default class NotificationColumn extends PureComponent<
  NotificationColumnProps,
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
            iconName="bell"
            title="Notifications"
            subtitle="All"
          />
          <FlexSeparator />
          <ColumnHeaderItem
            backgroundColor={theme.base00}
            foregroundColor={theme.base04}
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
