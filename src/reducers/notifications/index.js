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
      return (({ meta }) => (
        state
          .set('lastModifiedAt', meta['last-modified'])
          .set('updatedAt', new Date())
      ))(payload || {});

    default:
      return state;
  }
};
