import _ from 'lodash'
import { delay } from 'redux-saga'
import {
  all,
  fork,
  put,
  race,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects'

import { fetchInstallations, InstallationsConnection } from '@devhub/core'
import { bugsnag } from '../../libs/bugsnag'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { ExtractActionFromActionCreator } from '../types/base'

// Fetch new installation tokens every X minutes
function* init() {
  let isFirstTime = true

  while (true) {
    const { action } = yield race({
      delay: delay(1000 * 60 * 50),
      action: take(['LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGOUT']),
    })

    if (action && action.type === 'LOGIN_SUCCESS') isFirstTime = true

    const state = yield select()

    const isLogged = selectors.isLoggedSelector(state)
    if (!isLogged) continue

    const appToken = selectors.appTokenSelector(state)
    if (!appToken) continue

    yield put(
      actions.fetchInstallationsRequest({
        appToken,
        includeInstallationRepositories: isFirstTime,
        includeInstallationToken: true,
      }),
    )

    isFirstTime = false
  }
}

function* onFetchRequest(
  action: ExtractActionFromActionCreator<
    typeof actions.fetchInstallationsRequest
  >,
) {
  const {
    appToken,
    includeInstallationRepositories,
    includeInstallationToken,
  } = action.payload

  try {
    const response: InstallationsConnection = yield fetchInstallations({
      appToken,
      includeInstallationRepositories,
      includeInstallationToken,
    })

    yield put(actions.fetchInstallationsSuccess(response))
  } catch (error) {
    console.error('Failed to fetch installations', error)
    bugsnag.notify(error)

    yield put(actions.fetchInstallationsFailure(error))
  }
}

export function* installationSagas() {
  yield all([
    yield fork(init),
    yield takeEvery('FETCH_INSTALLATIONS_REQUEST', onFetchRequest),
  ])
}
