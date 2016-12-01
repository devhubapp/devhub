// @flow

import { REHYDRATE } from 'redux-persist/constants';
import type { Action } from '../../utils/types';

const initialState = {
  rehydrated: false,
};

type State = {
  version: string,
  rehydrated: boolean,
};

export default (state: State = initialState, { type }: Action<any>): State => {
  switch (type) {
    case REHYDRATE:
      return {
        ...state,
        rehydrated: true,
      };

    default:
      return state;
  }
};
