// @flow

import { Map } from 'immutable';
import { REHYDRATE } from 'redux-persist/constants';

import { CLEAR_APP_DATA } from '../../utils/constants/actions';
import type { Action } from '../../utils/types';

const initialState = Map();

type State = {
  rehydrated: boolean,
};

export default (state: State = initialState, { type }: Action<any>): State => {
  switch (type) {
    case CLEAR_APP_DATA:
    case REHYDRATE:
      return state.set('rehydrated', true);

    default:
      return state;
  }
};
