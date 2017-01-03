// @flow

import { Set } from 'immutable';

import { STAR_REPO, UNSTAR_REPO } from '../../utils/constants/actions';
import type { Action } from '../../utils/types';

type State = Array<string>;
const initialState = Set();

export default (state: State = initialState, action: Action<any>): State => {
  const { type, payload } = action || {};

  const { repoId } = payload || {};
  if (!repoId) return state;

  switch (type) {
    case STAR_REPO: return state.add(repoId);
    case UNSTAR_REPO: return state.remove(repoId);
    default: return state;
  }
};
