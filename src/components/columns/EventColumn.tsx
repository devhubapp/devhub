import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { Spacer } from '../../components/common/Spacer'
import {
  EventCardsContainer,
  EventCardsContainerProps,
} from '../../containers/EventCardsContainer'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { ExtractPropsFromConnector } from '../../types'
import { getColumnHeaderDetails } from '../../utils/helpers/github/events'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'

export interface EventColumnProps extends EventCardsContainerProps {
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
  },
)

export class EventColumnComponent extends PureComponent<
  EventColumnProps & ExtractPropsFromConnector<typeof connectToStore>
> {
  handleDeleteColumn = (id: string) => {
    this.props.deleteColumn(id)
  }

  render() {
    const { column, pagingEnabled } = this.props

    const requestTypeIconAndData = getColumnHeaderDetails(column)

    return (
      <Column
        key={`event-column-${this.props.column.id}-inner`}
        pagingEnabled={pagingEnabled}
      >
        <ColumnHeader>
          <ColumnHeaderItem
            avatarDetails={requestTypeIconAndData.avatarDetails}
            iconName={requestTypeIconAndData.icon}
            subtitle={requestTypeIconAndData.subtitle}
            title={requestTypeIconAndData.title}
          />
          <Spacer flex={1} />
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
