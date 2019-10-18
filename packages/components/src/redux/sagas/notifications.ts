import {
  fetchNotifications,
  fetchNotificationsEnhancements,
  getDefaultPaginationPerPage,
  GitHubNotification,
} from '@devhub/core'
import _ from 'lodash'
import {
  actionChannel,
  all,
  delay,
  fork,
  put,
  race,
  SagaReturnType,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects'

import { bugsnag } from '../../libs/bugsnag'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { RootState } from '../types'
import { ExtractActionFromActionCreator } from '../types/base'

function* init() {
  yield take('LOGIN_SUCCESS')

  let _isFirstTime = true
  while (true) {
    yield race({
      delay: delay(_isFirstTime ? 0 : 60 * 1000),
      logged: take('LOGIN_SUCCESS'),
    })

    const state: RootState = yield select()
    const notificationsState = state.notifications

    const accessToken = selectors.githubOAuthTokenSelector(state)
    const isLogged = selectors.isLoggedSelector(state)

    if (!(isLogged && accessToken)) {
      _isFirstTime = true
      continue
    }

    _isFirstTime = false

    // wait a little bit if has already fetched in the last minute
    if (
      notificationsState.lastFetchedRequestAt &&
      Date.now() - new Date(notificationsState.lastFetchedRequestAt).valueOf() <
        60 * 1000
    ) {
      yield delay(
        Date.now() -
          new Date(notificationsState.lastFetchedRequestAt).valueOf() +
          1,
      )
      continue
    }

    yield put(
      actions.fetchNotificationsRequest({
        since: notificationsState.newestItemDate || undefined,
        fetchAllPages: true,
        page: 1,
      }),
    )
  }
}

function* initCheckNotEnhanced() {
  yield take('LOGIN_SUCCESS')

  let _isFirstTime = true
  while (true) {
    yield race({
      delay: delay(_isFirstTime ? 0 : 10 * 60 * 1000),
      action: take([
        'LOGIN_SUCCESS',
        'REFRESH_INSTALLATIONS_SUCCESS',
        'REPLACE_COLUMNS_AND_SUBSCRIPTIONS',
      ]),
    })

    const state: RootState = yield select()

    const accessToken = selectors.githubOAuthTokenSelector(state)
    const isLogged = selectors.isLoggedSelector(state)

    if (!(isLogged && accessToken)) {
      _isFirstTime = true
      continue
    }
    _isFirstTime = false

    const allNotifications = selectors.notificationsCompactArrSelector(state)
    const notEnhancedNotifications = _.shuffle(
      allNotifications.filter(notification => !notification.enhanced),
    )
    if (!notEnhancedNotifications.length) continue

    const grouped: Array<typeof notEnhancedNotifications> = []
    const groupLength =
      notEnhancedNotifications.length > 100
        ? 20
        : notEnhancedNotifications.length > 25
        ? 5
        : 1
    let index = 0
    notEnhancedNotifications.forEach((notification, i) => {
      if (i && i % groupLength === 0) index = index + 1
      grouped[index] = grouped[index] || []
      grouped[index].push(notification)
    })

    yield all(
      grouped.map(function*(notifications) {
        yield put(
          actions.preFetchNotificationsEnhancementsRequest({
            notifications,
            requestParams: {},
            willFetchMore: false,
          }),
        )
      }),
    )
  }
}

let _retryNotificationsFetchIfFail = true
function* handleFetchNotificationsRequest(
  action: ExtractActionFromActionCreator<
    typeof actions.fetchNotificationsRequest
  >,
) {
  const state: RootState = yield select()

  const accessToken = selectors.githubOAuthTokenSelector(state)

  if (!accessToken) {
    yield put(actions.fetchNotificationsFailure(new Error('No access token.')))
    return
  }

  let notifications: SagaReturnType<typeof fetchNotifications>
  let fetchMore: boolean
  let fetchedCount: number
  try {
    const raceResult = yield race({
      notifications: fetchNotifications({
        ...action.payload,
        accessToken,
      }),
      abort: take([
        'FETCH_NOTIFICATIONS_ABORT',
        // 'FETCH_NOTIFICATIONS_ENHANCEMENTS_FAILURE',
      ]),
      timeout: delay(30 * 1000),
    })

    if (raceResult.abort) {
      _retryNotificationsFetchIfFail = false
      // throw new Error('Aborted')
      return
    }

    if (raceResult.timeout) {
      _retryNotificationsFetchIfFail = false
      throw new Error('Timeout')
    }

    notifications = raceResult.notifications

    const canFetchMore = !!(
      notifications.length &&
      notifications.length >=
        (action.payload.perPage || getDefaultPaginationPerPage('notifications'))
    )

    fetchedCount = (action.payload.fetchedCount || 0) + notifications.length
    fetchMore = !!(
      canFetchMore &&
      action.payload.fetchAllPages &&
      (!action.payload.maxFetchLimit ||
        fetchedCount < action.payload.maxFetchLimit) &&
      (!action.payload.perPage ||
        notifications.length >= action.payload.perPage)
    )

    yield put(
      actions.fetchNotificationsSuccess({
        notifications,
        requestParams: {
          ...action.payload,
          accessToken,
        },
        willFetchMore: fetchMore,
      }),
    )

    _retryNotificationsFetchIfFail = true
  } catch (error) {
    bugsnag.notify(error)
    console.error(error)

    if (
      _retryNotificationsFetchIfFail &&
      !(error && error.message === 'Aborted')
    ) {
      _retryNotificationsFetchIfFail = false
      yield delay(5000)
      yield put(actions.fetchNotificationsRequest(action.payload))
    } else {
      yield put(actions.fetchNotificationsFailure(error))
    }

    return
  }

  if (!fetchMore) return

  yield put(
    actions.fetchNotificationsRequest({
      ...action.payload,
      before: notifications.slice(-1)[0].updated_at,
      fetchedCount,
    }),
  )
}

function* handlePreFetchNotificationsEnhancementsRequest(
  action: ExtractActionFromActionCreator<
    | typeof actions.fetchNotificationsSuccess
    | typeof actions.preFetchNotificationsEnhancementsRequest
  >,
) {
  if (!(action.payload.notifications && action.payload.notifications.length))
    return

  const state: RootState = yield select()
  const oauthAccessToken = selectors.githubOAuthTokenSelector(state)

  const notificationsByToken: Record<string, GitHubNotification[]> = {}
  action.payload.notifications.forEach(notification => {
    const ownerName =
      (notification.repository.owner && notification.repository.owner.login) ||
      (notification.repository.full_name &&
        notification.repository.full_name.split('/')[0])
    const installationToken = selectors.installationTokenByOwnerSelector(
      state,
      ownerName,
    )

    const accessToken = notification.repository.private
      ? installationToken || oauthAccessToken
      : oauthAccessToken || installationToken
    if (!accessToken) return

    notificationsByToken[accessToken] = notificationsByToken[accessToken] || []
    notificationsByToken[accessToken].push(notification)
  })

  yield all(
    Object.entries(notificationsByToken).map(function*([
      accessToken,
      notifications,
    ]) {
      yield put(
        actions.fetchNotificationsEnhancementsRequest({
          notifications,
          params: {
            ...action.payload.requestParams,
            accessToken,
          },
          willFetchMore: action.payload.willFetchMore,
        }),
      )
    }),
  )
}

let _retryNotificationsEnhancementsFetchIfFail = true
function* handleFetchNotificationsEnhancementsRequest(
  action: ExtractActionFromActionCreator<
    typeof actions.fetchNotificationsEnhancementsRequest
  >,
) {
  const state: RootState = yield select()
  const notificationsState = state.notifications

  try {
    const raceResult = yield race({
      enhancedNotifications: fetchNotificationsEnhancements(
        action.payload.notifications,
        {
          ...action.payload.params,
          existingNotificationsById: notificationsState.byId,
        },
      ),
      abort: take('FETCH_NOTIFICATIONS_ABORT'),
      timeout: delay(30 * 1000),
    })

    if (raceResult.abort) {
      _retryNotificationsEnhancementsFetchIfFail = false
      throw new Error('Aborted')
    }

    if (raceResult.timeout) {
      _retryNotificationsEnhancementsFetchIfFail = false
      throw new Error('Timeout')
    }

    yield put(
      actions.fetchNotificationsEnhancementsSuccess({
        enhancedNotifications: raceResult.enhancedNotifications,
        requestParams: action.payload.params,
        willFetchMore: action.payload.willFetchMore,
      }),
    )

    _retryNotificationsEnhancementsFetchIfFail = true
  } catch (error) {
    bugsnag.notify(error)
    console.error(error)

    yield put(
      actions.fetchNotificationsEnhancementsFailure(action.payload, error),
    )

    if (
      _retryNotificationsEnhancementsFetchIfFail &&
      !(error && error.message === 'Aborted')
    ) {
      _retryNotificationsEnhancementsFetchIfFail = false
      yield delay(5000)
      yield put(actions.fetchNotificationsEnhancementsRequest(action.payload))
    }
  }
}

function* watchFetchNotificationsEnhancementsRequest() {
  const channel = yield actionChannel(
    'FETCH_NOTIFICATIONS_ENHANCEMENTS_REQUEST',
  )

  while (true) {
    const action = yield take(channel)

    yield fork(handleFetchNotificationsEnhancementsRequest, action)

    // only make one graphql request per time
    // to avoid triggering the github abuse detection mechanism
    yield take([
      'FETCH_NOTIFICATIONS_ENHANCEMENTS_SUCCESS',
      'FETCH_NOTIFICATIONS_ENHANCEMENTS_FAILURE',
    ])
  }
}

export function* notificationsSagas() {
  yield all([
    yield fork(init),
    yield fork(initCheckNotEnhanced),
    yield fork(watchFetchNotificationsEnhancementsRequest),
    yield takeEvery(
      'FETCH_NOTIFICATIONS_REQUEST',
      handleFetchNotificationsRequest,
    ),
    yield takeEvery(
      [
        'FETCH_NOTIFICATIONS_SUCCESS',
        'PRE_FETCH_NOTIFICATIONS_ENHANCEMENTS_REQUEST',
      ],
      handlePreFetchNotificationsEnhancementsRequest,
    ),
  ])
}
