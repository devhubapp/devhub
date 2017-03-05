// @flow
/* eslint-disable import/prefer-default-export */

type State = ?{ index: number, routes: Array };
export const createReducer = navigator => (state: State = null, action: any): State => {
  try {
    return navigator.router.getStateForAction(action, state) || state;
  } catch (e) {
    return state;
  }
};
