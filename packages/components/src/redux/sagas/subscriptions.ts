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
  getNotificationsEnhancementMap,
  getOlderEventDate,
  getOlderNotificationDate,
  GitHubEvent,
  GitHubNotification,
} from '@devhub/core'
import { delay, eventChannel } from 'redux-saga'
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

    const subscriptionsToFetch = _isFirstTime
      ? subscriptions
      : subscriptions.filter(s => s && minimumRefetchTimeHasPassed(s))
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
            subscriptionId: subscription.id,
            params: { page: 1 },
          }),
        )
      }),
    )
  }
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
  const columnSelector = selectors.createColumnSelector()

  const column = columnSelector(state, action.payload.columnId)
  if (!column) return

  yield all(
    column.subscriptionIds.map(function*(subscriptionId) {
      return yield put(
        actions.fetchSubscriptionRequest({
          subscriptionId,
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

  const { subscriptionId, params: _params } = action.payload

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

    if (
      !(
        subscription &&
        (subscription.type === 'activity' ||
          subscription.type === 'notifications')
      )
    ) {
      throw new Error(
        `Unknown column subscription type: ${subscription &&
          (subscription as any).type}`,
      )
    }

    if (subscription.type === 'notifications') {
      const response = yield call(getNotifications, params, {
        subscriptionId,
      })

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

      const canFetchMore =
        (!olderNotificationDate ||
          (!!olderDateFromThisResponse &&
            olderDateFromThisResponse <= olderNotificationDate) ||
          page === 1) &&
        newItems.length >= perPage

      yield put(
        actions.fetchSubscriptionSuccess({
          subscriptionId,
          data: enhancedItems,
          canFetchMore,
        }),
      )
    } else if (subscription.type === 'activity') {
      const response = yield call(getActivity, subscription.subtype, params, {
        subscriptionId,
      })

      const prevItems = subscription.data.items || []
      const newItems = (response.data || []) as GitHubEvent[]
      const mergedItems = _.uniqBy(
        _.concat(newItems, prevItems as any),
        'id',
      ) as EnhancedGitHubEvent[]

      const olderNotificationDate = getOlderEventDate(mergedItems)
      const olderDateFromThisResponse = getOlderEventDate(newItems)

      const canFetchMore =
        (!olderNotificationDate ||
          (!!olderDateFromThisResponse &&
            olderDateFromThisResponse <= olderNotificationDate) ||
          page === 1) &&
        newItems.length >= perPage

      yield put(
        actions.fetchSubscriptionSuccess({
          subscriptionId,
          data: newItems,
          canFetchMore,
        }),
      )
    }
  } catch (error) {
    console.error(
      `Failed to load GitHub ${(subscription && subscription.type) || 'data'}`,
      error,
    )
    // bugsnag.notify(error)
    yield put(actions.fetchSubscriptionFailure({ subscriptionId }, error))
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
    yield takeEvery('ADD_COLUMN_AND_SUBSCRIPTIONS', cleanupSubscriptions),
    yield takeEvery('ADD_COLUMN_AND_SUBSCRIPTIONS', onAddColumn),
    yield takeLatest(['LOGOUT', 'LOGIN_FAILURE'], onLogout),
    yield takeEvery('DELETE_COLUMN', cleanupSubscriptions),
    yield takeLatest('REPLACE_COLUMNS_AND_SUBSCRIPTIONS', cleanupSubscriptions),
    yield takeEvery('FETCH_COLUMN_SUBSCRIPTIONS', onFetchColumnSubscriptions),
    yield takeEvery('FETCH_SUBSCRIPTION_FAILURE', onFetchFailed),
  ])
}

function minimumRefetchTimeHasPassed(
  subscription: ColumnSubscription,
  interval = 60000,
) {
  if (!subscription) return false

  return (
    !subscription.data.lastFetchedAt ||
    new Date(subscription.data.lastFetchedAt).valueOf() <= Date.now() - interval
  )
}
