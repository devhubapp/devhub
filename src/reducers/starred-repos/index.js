// @flow

import { Set } from 'immutable';

import { STAR_REPO, UNSTAR_REPO } from '../../utils/constants/actions';
import type { Action } from '../../utils/types';

type State = Array<string>;
const initialState = Set();

export default (state: State = initialState, action: Action<any>): State => {
  const { type, payload } = action || {};

  switch (type) {
    case STAR_REPO: return state.add(payload);
    case UNSTAR_REPO: return state.remove(payload);
    default: return state;
  }
};
