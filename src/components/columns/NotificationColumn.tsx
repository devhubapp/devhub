import React, { PureComponent } from 'react'

import { Spacer } from '../../components/common/Spacer'
import {
  NotificationCardsContainer,
  NotificationCardsContainerProps,
} from '../../containers/NotificationCardsContainer'
import { getColumnHeaderDetails } from '../../utils/helpers/github/events'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'

export interface NotificationColumnProps
  extends NotificationCardsContainerProps {
  pagingEnabled?: boolean
}

export interface NotificationColumnState {}

export class NotificationColumn extends PureComponent<
  NotificationColumnProps,
  NotificationColumnState
> {
  handlePress = () => {
    alert('Not implemented')
  }

  render() {
    const { column, pagingEnabled } = this.props

    const requestTypeIconAndData = getColumnHeaderDetails(column)

    return (
      <Column pagingEnabled={pagingEnabled}>
        <ColumnHeader>
          <ColumnHeaderItem
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

        <NotificationCardsContainer
          repoIsKnown={requestTypeIconAndData.repoIsKnown}
          {...this.props}
        />
      </Column>
    )
  }
}
