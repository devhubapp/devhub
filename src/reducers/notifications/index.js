// @flow

import { Map } from 'immutable';

import { LOAD_NOTIFICATIONS_SUCCESS } from '../../utils/constants/actions';
import type { Action } from '../../utils/types';

type State = {
  lastModifiedAt: string,
  updatedAt: Date,
};

const initialState: State = Map({
  lastModifiedAt: undefined,
});

export default (state: State = initialState, { type, payload }: Action<any>): State => {
  switch (type) {
    case LOAD_NOTIFICATIONS_SUCCESS:
      return (({ data, meta }) => {
        let newState = state;

        if (data) {
          if (meta['last-modified']) {
            newState = newState.set('lastModifiedAt', meta['last-modified']);
          }
        }

        return newState.set('updatedAt', new Date());
      })(payload || {});

    default:
      return state;
  }
};
