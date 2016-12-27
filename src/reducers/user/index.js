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
export default (state: State = initialState, { type, payload, error }: ActionType): State => {
  switch (type) {
    case LOGIN_REQUEST:
      return state.set('isLogging', true);

    case LOGIN_SUCCESS:
      return state.mergeDeep({
        isLogging: false,
        accessToken: payload.data.accessToken,
        loggedAt: new Date(),
        lastAccessedAt: new Date(),
      });

    case UPDATE_CURRENT_USER:
      return state.mergeDeep({
        uid: payload && payload.uid,
        providerId: payload && payload.providerId,
        displayName: payload && payload.displayName,
        email: payload && payload.email,
        avatarURL: payload && payload.photoURL,
        lastAccessedAt: new Date(),
      });

    case LOGIN_FAILURE:
      return Map({
        isLogging: false,
        loggedOutAt: new Date(),
        error,
      });

    case LOGOUT:
      return Map({
        loggedOutAt: new Date(),
      });

    default:
      return state;
  }
};
