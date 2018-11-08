import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import {
  NotificationCardsContainer,
  NotificationCardsContainerProps,
} from '../../containers/NotificationCardsContainer'
import * as actions from '../../redux/actions'
import { contentPadding } from '../../styles/variables'
import { ExtractPropsFromConnector } from '../../types'
import { getColumnHeaderDetails } from '../../utils/helpers/github/events'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'

export interface NotificationColumnProps
  extends NotificationCardsContainerProps {
  columnIndex: number
  pagingEnabled?: boolean
}

export interface NotificationColumnState {}

const connectToStore = connect(
  null,
  {
    deleteColumn: actions.deleteColumn,
    moveColumn: actions.moveColumn,
  },
)

class NotificationColumnComponent extends PureComponent<
  NotificationColumnProps & ExtractPropsFromConnector<typeof connectToStore>,
  NotificationColumnState
> {
  handleDeleteColumn = (id: string) => {
    this.props.deleteColumn(id)
  }

  handleMoveColumn = (id: string, newColumnIndex: number) => {
    this.props.moveColumn({ id, index: newColumnIndex })
  }

  render() {
    const { column, columnIndex, pagingEnabled } = this.props

    const requestTypeIconAndData = getColumnHeaderDetails(column)

    return (
      <Column
        key={`notification-column-${this.props.column.id}-inner`}
        columnId={this.props.column.id}
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
            iconName="chevron-left"
            onPress={() =>
              this.handleMoveColumn(this.props.column.id, columnIndex - 1)
            }
            style={{ paddingHorizontal: contentPadding / 2 }}
          />
          <ColumnHeaderItem
            iconName="chevron-right"
            onPress={() =>
              this.handleMoveColumn(this.props.column.id, columnIndex + 1)
            }
            style={{ paddingHorizontal: contentPadding / 2 }}
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
