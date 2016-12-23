// @flow

import { fromJS, Map } from 'immutable';

import {
  TOGGLE_SEEN_NOTIFICATION,
} from '../../utils/constants/actions';

import type { Action, Normalized } from '../../utils/types';

type State = Normalized<Object>;
const initialState = Map();

export default (state: State = initialState, { type, payload }: Action<any>): State => {
  switch (type) {
    case TOGGLE_SEEN_NOTIFICATION:
      return (({ notificationIds }) => {
        if (!notificationIds) return state;

        const firstNotification = state.get(notificationIds.first());
        if (!firstNotification) return state;

        const newUnreadValue = !firstNotification.get('unread');

        let newState = state;
        
        notificationIds.forEach((notificationId) => {
          newState = newState.setIn([notificationId, 'unread'], newUnreadValue);
        });

        return newState;
      })(payload);

    default:
      return state;
  }
};
