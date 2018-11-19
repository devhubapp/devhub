import _ from 'lodash'
import { PureComponent } from 'react'
import { connect } from 'react-redux'

import { ExtractPropsFromConnector } from 'shared-core/dist/types'
import * as selectors from '../redux/selectors'

const connectToStore = connect(() => {
  const columnSelector = selectors.createColumnSelector()
  const columnSubscriptionsSelector = selectors.createColumnSubscriptionsSelector()

  return (state: any, { columnId }: ColumnRPProps) => ({
    column: columnSelector(state, columnId),
    columnIndex: selectors.columnIdsSelector(state).indexOf(columnId),
    subscriptions: columnSubscriptionsSelector(state, columnId),
  })
})

export interface ColumnRPProps {
  children: (
    params: Pick<
      ExtractPropsFromConnector<typeof connectToStore>,
      'column' | 'columnIndex' | 'subscriptions'
    >,
  ) => React.ReactNode
  columnId: string
}

export interface ColumnRPState {}

class ColumnRPComponent extends PureComponent<
  ColumnRPProps & ExtractPropsFromConnector<typeof connectToStore>,
  ColumnRPState
> {
  render() {
    const { children, columnIndex, column, subscriptions } = this.props

    return children({
      column,
      columnIndex,
      subscriptions,
    })
  }
}

export const ColumnRP = connectToStore(ColumnRPComponent)
