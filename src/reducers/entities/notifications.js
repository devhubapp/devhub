// @flow

import { Map } from 'immutable';

import {
  CLEAR_NOTIFICATIONS,
  MARK_NOTIFICATIONS_AS_READ,
  TOGGLE_NOTIFICATIONS_READ_STATUS,
} from '../../utils/constants/actions';

import { arrayOfIdsToMergeableMap } from '../../utils/helpers';
import { isReadFilter } from '../../selectors/shared';
import type { Action, Normalized } from '../../utils/types';

type State = Normalized<Object>;
const initialState = Map();

export default (state: State = initialState, { type, payload }: Action<any>): State => {
  switch (type) {
    case CLEAR_NOTIFICATIONS:
      return (({ notificationIds }) => (
        notificationIds
          ? state.mergeDeep(arrayOfIdsToMergeableMap(
            notificationIds,
            Map({ archived_at: new Date() }),
          ))
          : state
      ))(payload);

    case MARK_NOTIFICATIONS_AS_READ:
      return (({ notificationIds }) => {
        let newState = state;

        notificationIds.forEach((notificationId) => {
          newState = newState.setIn([notificationId, 'last_read_at'], new Date());
        });

        return newState;
      })(payload);

    case TOGGLE_NOTIFICATIONS_READ_STATUS:
      return (({ notificationIds }) => {
        if (!notificationIds) return state;

        const firstNotification = state.get(notificationIds.first());
        if (!firstNotification) return state;

        const newReadState = !isReadFilter(firstNotification);
        const lastReadAt = newReadState ? new Date() : undefined;
        const lastUnreadAt = !newReadState ? new Date() : null;

        let newState = state;
        notificationIds.forEach((notificationId) => {
          if (lastReadAt) newState = newState.setIn([notificationId, 'last_read_at'], lastReadAt);

          // if newReadState is false we will mark the last_unread_at as null on purpose
          // because when the notifications are updated, the last_read_at from github
          // would replace the last_read_at from the app,
          // and would make the notification be always marked as unread
          // because the last_read_at from github is always before last_unread_at from the app
          // (unread = last_unread_at > last_read_at)
          newState = newState.setIn([notificationId, 'last_unread_at'], lastUnreadAt);
        });

        return newState;
      })(payload);

    default:
      return state;
  }
};
