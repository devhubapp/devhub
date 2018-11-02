import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { Spacer } from '../../components/common/Spacer'
import {
  NotificationCardsContainer,
  NotificationCardsContainerProps,
} from '../../containers/NotificationCardsContainer'
import * as actions from '../../redux/actions'
import { ExtractPropsFromConnector } from '../../types'
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

const connectToStore = connect(
  null,
  {
    deleteColumn: actions.deleteColumn,
  },
)

class NotificationColumnComponent extends PureComponent<
  NotificationColumnProps & ExtractPropsFromConnector<typeof connectToStore>,
  NotificationColumnState
> {
  handleDeleteColumn = (id: string) => {
    this.props.deleteColumn(id)
  }

  render() {
    const { column, pagingEnabled } = this.props

    const requestTypeIconAndData = getColumnHeaderDetails(column)

    return (
      <Column
        key={`notification-column-${this.props.column.id}-inner`}
        pagingEnabled={pagingEnabled}
      >
        <ColumnHeader>
          <ColumnHeaderItem
            iconName={requestTypeIconAndData.icon}
            subtitle={requestTypeIconAndData.subtitle}
            title={requestTypeIconAndData.title}
            style={{ flex: 1 }}
          />

          <ColumnHeaderItem
            iconName="trashcan"
            onPress={() => this.handleDeleteColumn(this.props.column.id)}
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

export const NotificationColumn = connectToStore(NotificationColumnComponent)

hoistNonReactStatics(NotificationColumn, NotificationColumnComponent as any)
