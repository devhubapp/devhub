import { EnhancedItem } from '@devhub/core'
import { useCallback } from 'react'

import * as selectors from '../redux/selectors'
import { useReduxState } from './use-redux-state'

export function useItem<T extends EnhancedItem>(
  nodeIdOrId: string,
): T | undefined {
  const dataItem = useReduxState(
    useCallback(state => selectors.dataByNodeIdOrId(state)[nodeIdOrId], [
      nodeIdOrId,
    ]),
  )
  if (!(dataItem && dataItem.item)) return undefined

  return dataItem.item as T
}
