// @flow

import { Map } from 'immutable';

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from '../../utils/constants/actions';
import type { Action, LoginRequestPayload, LoginResponsePayload } from '../../utils/types';

const initialState = Map({});

type State = {
  loading: boolean,
  token: string,
  createdAt: Object,
};

type ActionType = Action<LoginRequestPayload | LoginResponsePayload>;
export default (state: State = initialState, { type, payload, meta }: ActionType): State => {
  switch (type) {
    case LOGIN_REQUEST:
      return state.set('loading', true);

    case LOGIN_SUCCESS:
      return state
        .set('loading', false)
        .set('token', payload.data.access_token)
        .set('createdAt', new Date())
      ;

    case LOGIN_FAILURE:
      return state.set('loading', false);

    case LOGOUT:
      return Map();

    default:
      return state;
  }
};
