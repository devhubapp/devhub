import _ from 'lodash'
import {
  all,
  delay,
  fork,
  put,
  race,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects'

import { Installation, refreshUserInstallations } from '@devhub/core'
import { bugsnag } from '../../libs/bugsnag'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { ExtractActionFromActionCreator } from '../types/base'

// Fetch new installation tokens every X minutes
function* init() {
  let _isFirstTime = true

  while (true) {
    const { action } = yield race({
      delay: delay(1000 * 60 * 5), // 5 minutes
      action: take(['LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGOUT']),
    })

    if (action) _isFirstTime = true

    const isFirstTime = _isFirstTime
    _isFirstTime = false

    const state = yield select()

    const isLogged = selectors.isLoggedSelector(state)
    if (!isLogged) continue

    const appToken = selectors.appTokenSelector(state)
    if (!appToken) continue

    if (isFirstTime) {
      yield put(
        actions.refreshInstallationsRequest({
          appToken,
          // includeInstallationRepositories: isFirstTime,
          includeInstallationToken: true,
        }),
      )

      continue
    }

    const lastFetchedAt = selectors.installationsLastFetchedAtSelector(state)
    const fetchedNMinutesAgo = lastFetchedAt
      ? (new Date().valueOf() - new Date(lastFetchedAt).valueOf()) / 1000 / 60
      : undefined

    // if fetched in the last 5 minutes, dont retry yet
    if (fetchedNMinutesAgo && fetchedNMinutesAgo < 5) continue

    const installations = selectors.installationsArrSelector(state)
    const hasExpiredInstallationToken = installations.some(
      installation =>
        installation &&
        installation.tokenDetails &&
        installation.tokenDetails.expiresAt &&
        new Date(installation.tokenDetails.expiresAt).valueOf() <
          new Date().valueOf(),
    )

    // only fetch installations tokens if there are expired ones or havent fetched for 50+ minutes
    if (
      !(
        hasExpiredInstallationToken ||
        (fetchedNMinutesAgo && fetchedNMinutesAgo > 50)
      )
    )
      continue

    yield put(
      actions.refreshInstallationsRequest({
        appToken,
        // includeInstallationRepositories: isFirstTime,
        includeInstallationToken: true,
      }),
    )
  }
}

function* onRefreshInstallationsRequest(
  action: ExtractActionFromActionCreator<
    typeof actions.refreshInstallationsRequest
  >,
) {
  const noGitHubAppTokenMessage = 'No GitHub App token.'

  try {
    const state = yield select()

    const githubAppToken = selectors.githubAppTokenSelector(state)
    if (!githubAppToken) throw new Error(noGitHubAppTokenMessage)

    const {
      appToken,
      // includeInstallationRepositories,
      includeInstallationToken,
    } = action.payload

    const response: Installation[] = yield refreshUserInstallations({
      appToken,
      // includeInstallationRepositories,
      includeInstallationToken,
    })

    yield put(actions.refreshInstallationsSuccess(response))
  } catch (error) {
    console.error('Failed to fetch installations', error)
    if (!(error && error.message === noGitHubAppTokenMessage)) {
      bugsnag.notify(error)
    }

    yield put(actions.refreshInstallationsFailure(error))
  }
}

export function* installationSagas() {
  yield all([
    yield fork(init),
    yield takeEvery(
      'REFRESH_INSTALLATIONS_REQUEST',
      onRefreshInstallationsRequest,
    ),
  ])
}
