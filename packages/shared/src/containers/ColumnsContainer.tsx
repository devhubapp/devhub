import _ from 'lodash'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { Columns } from '../components/columns/Columns'
import * as selectors from '../redux/selectors'
import { ExtractPropsFromConnector } from '../types'

export interface ColumnsContainerProps {}

export interface ColumnsContainerState {}

const connectToStore = connect((state: any) => ({
  columns: selectors.columnsSelector(state),
}))

class ColumnsContainerComponent extends PureComponent<
  ColumnsContainerProps & ExtractPropsFromConnector<typeof connectToStore>,
  ColumnsContainerState
> {
  render() {
    const columns = this.props.columns || []
    return <Columns key="columns-container" data={columns} />
  }
}

export const ColumnsContainer = connectToStore(ColumnsContainerComponent)
