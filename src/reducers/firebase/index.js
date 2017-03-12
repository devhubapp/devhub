// @flow

import app from '../app';
import config from '../config';
import entities from '../entities';
import user from '../user';

import { getObjectFilteredByMap } from '../../store/middlewares/firebase/helpers';
import { FIREBASE_RECEIVED_EVENT } from '../../utils/constants/actions';
import { fromJS } from '../../utils/immutable';
import type { Action } from '../../utils/types';

export const mapFirebaseToState = {
  config: {},
  entities: {
    columns: {},
    subscriptions: {},
  },
};

export const mapStateToFirebase = {
  app: {
    ready: false,
    rehydrated: false,
  },
  config: {},
  entities: {
    columns: {},
    subscriptions: {},
  },
  user: {
    isLogging: false,
  },
};

const initialState = fromJS(getObjectFilteredByMap({
  app: app(),
  config: config(),
  entities: entities(),
  user: user(),
}, mapStateToFirebase));

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
