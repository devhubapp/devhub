// @flow

import { Map } from 'immutable';
import { REHYDRATE } from 'redux-persist/constants';

import type { Action } from '../../utils/types';

const initialState = Map({
  rehydrated: false,
});

type State = {
  rehydrated: boolean,
};

export default (state: State = initialState, { type }: Action<any>): State => {
  switch (type) {
    case REHYDRATE:
      return state.set('rehydrated', true);

    default:
      return state;
  }
};
