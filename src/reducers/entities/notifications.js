// @flow

import { Map } from 'immutable';

import {
  CLEAR_NOTIFICATIONS,
  MARK_NOTIFICATIONS_AS_READ,
  TOGGLE_NOTIFICATIONS_READ_STATUS,
} from '../../utils/constants/actions';

import { arrayOfIdsToMergeableMap } from '../../utils/helpers';
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
            Map({ archived: true, archived_at: new Date() }),
          ))
          : state
      ))(payload);

    case MARK_NOTIFICATIONS_AS_READ:
      return (({ notificationIds }) => {
        let newState = state;

        notificationIds.forEach((notificationId) => {
          newState = newState
            .setIn([notificationId, 'unread'], false)
            .setIn([notificationId, 'last_read_at'], new Date());
        });

        return newState;
      })(payload);

    case TOGGLE_NOTIFICATIONS_READ_STATUS:
      return (({ notificationIds }) => {
        if (!notificationIds) return state;

        const firstNotification = state.get(notificationIds.first());
        if (!firstNotification) return state;

        const newUnreadValue = !firstNotification.get('unread');
        const lastReadAt = newUnreadValue === false ? new Date() : null;
        let newState = state;

        notificationIds.forEach((notificationId) => {
          newState = newState.setIn([notificationId, 'unread'], newUnreadValue);
          if (lastReadAt) newState = newState.setIn([notificationId, 'last_read_at'], lastReadAt);
        });

        return newState;
      })(payload);

    default:
      return state;
  }
};
