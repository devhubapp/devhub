import {
  convertDevHubGitHubNotificationToOldEnhancedGitHubNotification,
  DevHubGitHubNotification,
  EnhancedGitHubNotification,
} from '@devhub/core'
import { createSelector } from 'reselect'

import { EMPTY_ARRAY, EMPTY_OBJ } from '../../utils/constants'
import { RootState } from '../types'

const s = (state: RootState) => state.notifications || EMPTY_OBJ

export const notificationsState = (state: RootState) => s(state)

export const notificationsErrorMessage = (state: RootState) =>
  s(state).errorMessage

export const notificationIdsSelector = (state: RootState) =>
  s(state).allIds || EMPTY_ARRAY

export const notificationSelector = (state: RootState, id: string) =>
  (s(state).byId && s(state).byId[id]) || undefined

export const notificationsArrSelector = createSelector(
  (state: RootState) => notificationIdsSelector(state),
  (state: RootState) => s(state).byId,
  (ids, byId): DevHubGitHubNotification[] =>
    byId && ids
      ? (ids.map(id => byId[id]).filter(Boolean) as DevHubGitHubNotification[])
      : EMPTY_ARRAY,
)

export const notificationsCompactArrSelector = createSelector(
  (state: RootState) => notificationsArrSelector(state),
  (notifications): EnhancedGitHubNotification[] =>
    notifications
      .filter(
        notification => !!(notification && !notification.isProbablyDeleted),
      )
      .map(notification =>
        convertDevHubGitHubNotificationToOldEnhancedGitHubNotification(
          notification,
        ),
      ),
)
