// @flow
/* eslint-disable import/prefer-default-export */

import Navigator from '../../navigators/AppNavigator';

type State = ?{ index: number, routes: Array };
const initialState = null;

export default (state: State = initialState, action: any): State => {
  try {
    return Navigator.router.getStateForAction(action, state) || state;
  } catch (e) {
    return state;
  }
};
