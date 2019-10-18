import {
  Column,
  convertDevHubGitHubNotificationToOldEnhancedGitHubNotification,
  EnhancedItem,
} from '@devhub/core'
import { useCallback } from 'react'

import * as selectors from '../redux/selectors'
import { useReduxState } from './use-redux-state'

export function useItem<T extends EnhancedItem>(
  type: Column['type'],
  nodeIdOrId: string,
): T | undefined {
  const item = useReduxState(
    useCallback(
      type === 'notifications'
        ? state => {
            const notification = selectors.notificationSelector(
              state,
              nodeIdOrId,
            )
            if (!notification) return undefined
            return convertDevHubGitHubNotificationToOldEnhancedGitHubNotification(
              notification,
            )
          }
        : state => {
            const dataItem = selectors.dataByNodeIdOrId(state)[nodeIdOrId]
            return dataItem && dataItem.item
          },
      [type, nodeIdOrId],
    ),
  )

  return item as T
}
