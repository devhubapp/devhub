// @flow

import type { Action, Repo } from '../../utils/types';

import { STAR_REPO, UNSTAR_REPO } from '../../utils/constants/actions';

type State = Repo;
export default (state: State = {}, action: Action<any>): State => {
  const { type, payload } = action || {};

  switch (type) {
    case STAR_REPO: return { ...state, [payload]: { ...state[payload], isStarred: true } };
    case UNSTAR_REPO: return { ...state, [payload]: { ...state[payload], isStarred: false } };
    default: return state;
  }
};
