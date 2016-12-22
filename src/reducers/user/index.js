// @flow

import { fromJS, Map } from 'immutable';

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  UPDATE_CURRENT_USER,
} from '../../utils/constants/actions';
import type { Action, LoginRequestPayload, LoginResponsePayload } from '../../utils/types';

const initialState = Map({});

type State = {
  isLogging: boolean,
  accessToken: string,
  loggedAt: Object,
};

type ActionType = Action<LoginRequestPayload | LoginResponsePayload>;
export default (state: State = initialState, { type, payload }: ActionType): State => {
  switch (type) {
    case LOGIN_REQUEST:
      return state.set('isLogging', true);

    case LOGIN_SUCCESS:
      return state
        .set('isLogging', false)
        .set('accessToken', payload.data.accessToken)
        .set('loggedAt', new Date())
      ;

    case LOGIN_FAILURE:
      return Map({ isLogging: false });

    case LOGOUT:
      return Map();

    case UPDATE_CURRENT_USER:
      return state
        .set('uid', payload && payload.uid)
        .set('providerId', payload && payload.providerId)
        .set('displayName', payload && payload.displayName)
        .set('email', payload && payload.email)
        .set('avatarURL', payload && payload.photoURL)
      ;


    default:
      return state;
  }
};
