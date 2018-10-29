import { all, put, select, takeLatest } from 'redux-saga/effects'

import { Column, ExtractActionFromActionCreator } from '../../types'
import { guid } from '../../utils/helpers/shared'
import * as actions from '../actions'
import * as selectors from '../selectors'

function getDefaultColumns(username: string): Column[] {
  return [
    {
      id: guid(),
      type: 'notifications',
      params: {
        all: true,
      },
    },
    {
      id: guid(),
      type: 'activity',
      subtype: 'USER_RECEIVED_EVENTS',
      params: {
        username,
      },
    },
    {
      id: guid(),
      type: 'activity',
      subtype: 'USER_EVENTS',
      params: {
        username,
      },
    },
    {
      id: guid(),
      type: 'activity',
      subtype: 'ORG_PUBLIC_EVENTS',
      params: {
        org: 'facebook',
      },
    },
    {
      id: guid(),
      type: 'activity',
      subtype: 'REPO_EVENTS',
      params: {
        owner: 'facebook',
        repo: 'react',
      },
    },
  ]
}

function* onLoginSuccess(
  action: ExtractActionFromActionCreator<typeof actions.loginSuccess>,
) {
  const username = action.payload.login
  const columns = yield select(selectors.columnsSelector)
  if (!columns) yield put(actions.replaceColumns(getDefaultColumns(username)))
}

export function* columnsSagas() {
  yield all([yield takeLatest('LOGIN_SUCCESS', onLoginSuccess)])
}
