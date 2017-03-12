// @flow

import { fromJS } from 'immutable';

import config from '../config';
import columns from '../entities/columns';
import subscriptions from '../entities/subscriptions';

import { FIREBASE_RECEIVED_EVENT } from '../../utils/constants/actions';
import type { Action } from '../../utils/types';

export const mapStateToFirebase = {
  config: {},
  entities: {
    columns: {},
    subscriptions: {},
  },
  user: {
    isLogging: false,
  },
};

export const mapFirebaseToState = {
  config: {},
  entities: {
    columns: {},
    subscriptions: {},
  },
};

const initialState = fromJS({
  config: config(),
  entities: {
    columns: columns(),
    subscriptions: subscriptions(),
  },
});

type State = {};

export default (state: State = initialState, { type, payload }: ?Action<any> = {}): State => {
  switch (type) {
    case FIREBASE_RECEIVED_EVENT:
      return (({ eventName, statePathArr, value }) => {
        if (!(statePathArr && statePathArr.length)) return state;

        switch (eventName) {
          case 'child_added': return state.mergeDeepIn(statePathArr, fromJS(value));
          case 'child_removed': return state.removeIn(statePathArr);
          default: return state.setIn(statePathArr, fromJS(value));
        }
      })(payload || {});

    default:
      return state;
  }
};
