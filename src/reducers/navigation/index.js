// @flow
/* eslint-disable import/prefer-default-export */

import Navigator from '../../navigators/AppNavigator'

import {
  LOGOUT,
  RESET_ACCOUNT_DATA,
  RESET_APP_DATA,
} from '../../utils/constants/actions'

type State = ?{ index: number, routes: Array }
const initialState = null

export default (state: State = initialState, action: any): State => {
  switch (action.type) {
    case LOGOUT:
    case RESET_ACCOUNT_DATA:
    case RESET_APP_DATA:
      return (
        Navigator.router.getStateForAction(
          Navigator.router.getActionForPathAndParams('login'),
          state,
        ) || state
      )

    default:
      try {
        return Navigator.router.getStateForAction(action, state) || state
      } catch (e) {
        return state
      }
  }
}
