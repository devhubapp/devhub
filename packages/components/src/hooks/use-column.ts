import { useRef } from 'react'

import * as selectors from '../redux/selectors'
import { useReduxState } from './use-redux-state'

export function useColumn(columnId: string) {
  const columnSelector = useRef(selectors.createColumnSelector()).current

  const columnSubscriptionsSelector = useRef(
    selectors.createColumnSubscriptionsSelector(),
  ).current

  const column = useReduxState(state => columnSelector(state, columnId))
  const columnIndex = useReduxState(state =>
    selectors.columnIdsSelector(state).indexOf(columnId),
  )
  const subscriptions = useReduxState(state =>
    columnSubscriptionsSelector(state, columnId),
  )

  return { column, columnIndex, subscriptions }
}
