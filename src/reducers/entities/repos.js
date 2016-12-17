// @flow

import { Map } from 'immutable';
import type { Action, Repo } from '../../utils/types';

type State = Repo;
const initialState = Map();

export default (state: State = initialState, action: Action<any>): State => {
  const { type } = action || {};

  switch (type) {
    default: return state;
  }
};
