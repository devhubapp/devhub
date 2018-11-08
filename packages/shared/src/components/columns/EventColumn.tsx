import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import {
  EventCardsContainer,
  EventCardsContainerProps,
} from '../../containers/EventCardsContainer'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { ExtractPropsFromConnector } from '../../types'
import { getColumnHeaderDetails } from '../../utils/helpers/github/events'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'

export interface EventColumnProps extends EventCardsContainerProps {
  columnIndex: number
  pagingEnabled?: boolean
}

export interface EventColumnState {}

const connectToStore = connect(
  (state: any) => ({
    isLoggingIn: selectors.isLoggingInSelector(state),
    user: selectors.currentUserSelector(state),
  }),
  {
    deleteColumn: actions.deleteColumn,
    moveColumn: actions.moveColumn,
  },
)

export class EventColumnComponent extends PureComponent<
  EventColumnProps & ExtractPropsFromConnector<typeof connectToStore>
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
        key={`event-column-${this.props.column.id}-inner`}
        columnId={this.props.column.id}
        pagingEnabled={pagingEnabled}
      >
        <ColumnHeader>
          <ColumnHeaderItem
            avatarProps={requestTypeIconAndData.avatarProps}
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

        <EventCardsContainer
          repoIsKnown={requestTypeIconAndData.repoIsKnown}
          {...this.props}
        />
      </Column>
    )
  }
}

export const EventColumn = connectToStore(EventColumnComponent)

hoistNonReactStatics(EventColumn, EventColumnComponent as any)
