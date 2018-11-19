import _ from 'lodash'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { ExtractPropsFromConnector } from 'shared-core/dist/types'
import { Columns } from '../components/columns/Columns'
import * as selectors from '../redux/selectors'

export interface ColumnsContainerProps {}

export interface ColumnsContainerState {}

const connectToStore = connect((state: any) => ({
  columnIds: selectors.columnIdsSelector(state),
}))

class ColumnsContainerComponent extends PureComponent<
  ColumnsContainerProps & ExtractPropsFromConnector<typeof connectToStore>,
  ColumnsContainerState
> {
  render() {
    const columnIds = this.props.columnIds || []
    return <Columns key="columns-container" columnIds={columnIds} />
  }
}

export const ColumnsContainer = connectToStore(ColumnsContainerComponent)
