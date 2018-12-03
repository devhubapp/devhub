import _ from 'lodash'
import React from 'react'

import { Columns } from '../components/columns/Columns'
import { useReduxState } from '../redux/hooks/use-redux-state'
import * as selectors from '../redux/selectors'

export interface ColumnsContainerProps {}

export function ColumnsContainer() {
  const columnIds = useReduxState(selectors.columnIdsSelector)
  return <Columns key="columns-container" columnIds={columnIds} />
}
