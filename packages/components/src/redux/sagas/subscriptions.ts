import _ from 'lodash'
import {
  actionChannel,
  all,
  call,
  fork,
  put,
  race,
  select,
  take,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'

import {
  Column,
  ColumnSubscription,
  constants,
  createNotificationsCache,
  EnhancedGitHubEvent,
  EnhancementCache,
  enhanceNotifications,
  getGitHubApiHeadersFromHeader,
  getNotificationsEnhancementMap,
  getOlderEventDate,
  getOlderNotificationDate,
  GitHubEvent,
  GitHubNotification,
} from '@devhub/core'
import { REHYDRATE } from 'redux-persist'
import { delay } from 'redux-saga'
import { getActivity, getNotifications } from '../../libs/github'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { ExtractActionFromActionCreator } from '../types/base'

let notificationsCache: EnhancementCache

function* init() {
  yield take('LOGIN_SUCCESS')

  let isFirstTime = true
  while (true) {
    yield race({
      delay: delay(isFirstTime ? 0 : 10 * 1000),
      logout: take([
        'LOGIN_SUCCESS',
        'LOGIN_FAILURE',
        'LOGOUT',
        'REPLACE_COLUMNS_AND_SUBSCRIPTIONS',
      ]),
    })
    const _isFirstTime = isFirstTime
    isFirstTime = false

    const state = yield select()

    if (_isFirstTime) {
      const hasCreatedColumn = yield select(selectors.hasCreatedColumnSelector)
      if (!hasCreatedColumn)
        yield take([
          'ADD_COLUMN_AND_SUBSCRIPTIONS',
          'REPLACE_COLUMNS_AND_SUBSCRIPTIONS',
        ])
    }

    const isLogged = !!selectors.currentUserSelector(state)
    if (!isLogged) continue

    const subscriptions = selectors.subscriptionsArrSelector(state)
    if (!(subscriptions && subscriptions.length)) continue

    const github = selectors.githubApiHeadersSelector(state)

    // TODO: Eventually the number of subscriptions wont be 1x1 with the number of columns
    // Because columns will be able to have multiple subscriptions.
    // When that happens, improve this. Limit based on number of columns or subscriptions?
    const subscriptionsToFetch = _isFirstTime
      ? subscriptions.slice(0, constants.COLUMNS_LIMIT)
      : subscriptions
          .slice(0, constants.COLUMNS_LIMIT)
          .filter(
            s =>
              s &&
              minimumRefetchTimeHasPassed(
                s,
                typeof github.pollInterval === 'number'
                  ? github.pollInterval * 1000
                  : undefined,
              ),
          )
    if (!(subscriptionsToFetch && subscriptionsToFetch.length)) continue

    yield all(
      subscriptionsToFetch.map(function*(subscription) {
        if (!subscription) return

        const fiveMinutes = 1000 * 60 * 5
        const timeDiff = subscription.data.lastFetchedAt
          ? Date.now() - new Date(subscription.data.lastFetchedAt).valueOf()
          : undefined

        if (
          subscription &&
          subscription.data &&
          subscription.data.loadState === 'error' &&
          (!timeDiff || timeDiff < fiveMinutes)
        ) {
          if (__DEV__) {
            // tslint:disable-next-line no-console
            console.debug(
              'Ignoring subscription re-fetch due to recent fetch error.',
            )
          }
          return
        }

        return yield put(
          actions.fetchSubscriptionRequest({
            subscriptionType: subscription.type,
            subscriptionId: subscription.id,
            params: { page: 1 },
          }),
        )
      }),
    )
  }
}

function* onRehydrate() {
  const state = yield select()
  const isLogged = !!selectors.currentUserSelector(state)
  if (!isLogged) return

  const sevenDays = 1000 * 60 * 60 * 24 * 7
  const deleteOlderThan = new Date(Date.now() - sevenDays).toISOString()

  yield put(actions.cleanupSubscriptionsData({ deleteOlderThan }))
}

function* cleanupSubscriptions() {
  const allSubscriptionIds: string[] = yield select(
    selectors.subscriptionIdsSelector,
  )
  if (!(allSubscriptionIds && allSubscriptionIds.length)) return

  const columns: Column[] | null = yield select(selectors.columnsArrSelector)
  if (!(columns && columns.length)) return

  const usedSubscriptionIds = _.uniq(
    columns
      .reduce(
        (result, column) => result.concat(column.subscriptionIds),
        [] as string[],
      )
      .filter(Boolean),
  )

  const unusedSubscriptionIds = _.difference(
    allSubscriptionIds,
    usedSubscriptionIds,
  )
  if (!(unusedSubscriptionIds && unusedSubscriptionIds.length)) return

  yield put(actions.deleteColumnSubscriptions(unusedSubscriptionIds))
}

function* onAddColumn(
  action: ExtractActionFromActionCreator<
    typeof actions.addColumnAndSubscriptions
  >,
) {
  const state = yield select()
  const columnSelector = selectors.createColumnSelector()

  const column = columnSelector(state, action.payload.column.id)
  if (!column) return

  yield put(
    actions.fetchColumnSubscriptionRequest({
      columnId: column.id,
      params: { page: 1 },
    }),
  )
}

function* onFetchColumnSubscriptions(
  action: ExtractActionFromActionCreator<
    typeof actions.fetchColumnSubscriptionRequest
  >,
) {
  const state = yield select()
  const columnSubscriptionsSelector = selectors.createColumnSubscriptionsSelector()

  const columnSubscriptions = columnSubscriptionsSelector(
    state,
    action.payload.columnId,
  )
  if (!(columnSubscriptions && columnSubscriptions.length)) return

  yield all(
    columnSubscriptions.map(function*(subscription) {
      return yield put(
        actions.fetchSubscriptionRequest({
          subscriptionType: subscription.type,
          subscriptionId: subscription.id,
          params: action.payload.params,
        }),
      )
    }),
  )
}

function* watchFetchRequests() {
  const channel = yield actionChannel('FETCH_SUBSCRIPTION_REQUEST')

  while (true) {
    const action = yield take(channel)

    yield fork(onFetchRequest, action)
    yield delay(300)
  }
}

function* onFetchRequest(
  action: ExtractActionFromActionCreator<
    typeof actions.fetchSubscriptionRequest
  >,
) {
  const state = yield select()

  const { subscriptionType, subscriptionId, params: _params } = action.payload

  const subscription = selectors.subscriptionSelector(state, subscriptionId)
  const githubToken = selectors.githubTokenSelector(state)
  const hasPrivateAccess = selectors.githubHasPrivateAccessSelector(state)

  const page = Math.max(1, _params.page || 1)
  const perPage = Math.min(
    _params.perPage || constants.DEFAULT_PAGINATION_PER_PAGE,
    50,
  )

  delete _params.page
  delete _params.perPage
  const params = {
    ...(subscription && subscription.params),
    ..._params,
    page,
    per_page: perPage,
  }

  try {
    if (!githubToken) throw new Error('Not logged')

    let data
    let canFetchMore: boolean
    let headers
    if (subscription && subscription.type === 'notifications') {
      const response = yield call(getNotifications, params, {
        subscriptionId,
      })
      headers = (response && response.headers) || {}

      const prevItems = subscription.data.items || []
      const newItems = response.data as GitHubNotification[]
      const mergedItems = _.uniqBy(_.concat(newItems, prevItems), 'id')

      const olderNotificationDate = getOlderNotificationDate(mergedItems)
      const olderDateFromThisResponse = getOlderNotificationDate(newItems)

      if (!notificationsCache) {
        notificationsCache = createNotificationsCache(prevItems)
      }

      const enhancementMap = yield call(
        getNotificationsEnhancementMap,
        newItems,
        {
          cache: notificationsCache,
          githubToken,
          hasPrivateAccess,
        },
      )

      const enhancedItems = enhanceNotifications(
        newItems,
        enhancementMap,
        prevItems,
      )

      data = enhancedItems

      canFetchMore =
        (!olderNotificationDate ||
          (!!olderDateFromThisResponse &&
            olderDateFromThisResponse <= olderNotificationDate) ||
          page === 1) &&
        newItems.length >= perPage
    } else if (subscription && subscription.type === 'activity') {
      const response = yield call(getActivity, subscription.subtype, params, {
        subscriptionId,
      })
      headers = (response && response.headers) || {}

      const prevItems = subscription.data.items || []
      const newItems = (response.data || []) as GitHubEvent[]
      const mergedItems = _.uniqBy(
        _.concat(newItems, prevItems as any),
        'id',
      ) as EnhancedGitHubEvent[]

      const olderNotificationDate = getOlderEventDate(mergedItems)
      const olderDateFromThisResponse = getOlderEventDate(newItems)

      canFetchMore =
        (!olderNotificationDate ||
          (!!olderDateFromThisResponse &&
            olderDateFromThisResponse <= olderNotificationDate) ||
          page === 1) &&
        newItems.length >= perPage

      data = newItems
    } else {
      throw new Error(
        `Unknown column subscription type: ${subscription &&
          (subscription as any).type}`,
      )
    }

    const github = getGitHubApiHeadersFromHeader(headers)

    yield put(
      actions.fetchSubscriptionSuccess({
        subscriptionType,
        subscriptionId,
        data,
        canFetchMore,
        github,
      }),
    )
  } catch (error) {
    console.error(
      `Failed to load GitHub ${(subscription && subscription.type) || 'data'}`,
      error,
    )
    // bugsnag.notify(error)

    const headers = error && error.response && error.response.headers
    const github = getGitHubApiHeadersFromHeader(headers)

    yield put(
      actions.fetchSubscriptionFailure(
        {
          subscriptionType,
          subscriptionId,
          github,
        },
        error,
      ),
    )
  }
}

function* onFetchFailed(
  action: ExtractActionFromActionCreator<
    typeof actions.fetchSubscriptionFailure
  >,
) {
  if (
    action.error &&
    action.error.status === 401 &&
    action.error.message === 'Bad credentials'
  ) {
    yield put(actions.logout())
  }
}

function onLogout() {
  if (notificationsCache) notificationsCache.clear()
}

export function* subscriptionsSagas() {
  yield all([
    yield fork(init),
    yield fork(watchFetchRequests),
    yield takeLatest(REHYDRATE, onRehydrate),
    yield takeEvery('ADD_COLUMN_AND_SUBSCRIPTIONS', cleanupSubscriptions),
    yield takeEvery('ADD_COLUMN_AND_SUBSCRIPTIONS', onAddColumn),
    yield takeLatest(['LOGOUT', 'LOGIN_FAILURE'], onLogout),
    yield takeEvery('DELETE_COLUMN', cleanupSubscriptions),
    yield takeLatest('REPLACE_COLUMNS_AND_SUBSCRIPTIONS', cleanupSubscriptions),
    yield takeEvery('FETCH_COLUMN_SUBSCRIPTIONS', onFetchColumnSubscriptions),
    yield takeEvery('FETCH_SUBSCRIPTION_FAILURE', onFetchFailed),
  ])
}

const minute = 1 * 60 * 1000
function minimumRefetchTimeHasPassed(
  subscription: ColumnSubscription,
  _interval = minute,
) {
  if (!subscription) return false

  const interval =
    typeof _interval === 'number' && _interval > 0
      ? Math.min(Math.max(minute, _interval), 60 * minute)
      : minute

  return (
    !subscription.data.lastFetchedAt ||
    new Date(subscription.data.lastFetchedAt).valueOf() <= Date.now() - interval
  )
}
