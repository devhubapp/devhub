// @flow

import { Map } from 'immutable';
import type { Action, Repo } from '../../utils/types';

import { STAR_REPO, UNSTAR_REPO } from '../../utils/constants/actions';

type State = Repo;
export default (state: State = Map(), action: Action<any>): State => {
  const { type, payload } = action || {};

  switch (type) {
    case STAR_REPO: return state.setIn([payload, 'starred'], true);
    case UNSTAR_REPO: return state.setIn([payload, 'starred'], false);
    default: return state;
  }
};
