import { Response } from '@octokit/rest'
import _ from 'lodash'
import { REHYDRATE } from 'redux-persist'
import { delay } from 'redux-saga'
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
  EnhancementCache,
  enhanceNotifications,
  getGitHubAPIHeadersFromHeader,
  getNotificationsEnhancementMap,
  getOlderEventDate,
  getOlderNotificationDate,
  GitHubEvent,
  GitHubNotification,
} from '@devhub/core'

import { bugsnag } from '../../libs/bugsnag'
import { getActivity, getNotifications, octokit } from '../../libs/github'
import { mergeEventsPreservingEnhancement } from '../../utils/helpers/github/events'
import { mergeNotificationsPreservingEnhancement } from '../../utils/helpers/github/notifications'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { ExtractActionFromActionCreator } from '../types/base'

let notificationsCache: EnhancementCache

function* init() {
  yield take('LOGIN_SUCCESS')

  let isFirstTime = true
  while (true) {
    const { action } = yield race({
      delay: delay(isFirstTime ? 0 : 10 * 1000),
      action: take([
        'LOGIN_SUCCESS',
        'LOGIN_FAILURE',
        'LOGOUT',
        'REPLACE_COLUMNS_AND_SUBSCRIPTIONS',
        'FETCH_INSTALLATIONS_SUCCESS',
      ]),
    })

    const forceFetchAll = !!(
      action &&
      (action.type === 'LOGIN_SUCCESS' ||
        action.type === 'FETCH_INSTALLATIONS_SUCCESS')
    )

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

    const isLogged = selectors.isLoggedSelector(state)
    if (!isLogged) continue

    const subscriptions = selectors.subscriptionsArrSelector(state)
    if (!(subscriptions && subscriptions.length)) continue

    const github = selectors.githubAPIHeadersSelector(state)

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
              (forceFetchAll ||
                minimumRefetchTimeHasPassed(
                  s,
                  typeof github.pollInterval === 'number'
                    ? github.pollInterval * 1000
                    : undefined,
                )),
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
          !forceFetchAll &&
          (subscription &&
            subscription.data &&
            subscription.data.loadState === 'error' &&
            (!timeDiff || timeDiff < fiveMinutes))
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

  const owner =
    (subscription &&
      (('owner' in subscription.params && subscription.params.owner) ||
        ('org' in subscription.params && subscription.params.org))) ||
    undefined

  const installationToken = selectors.installationTokenByOwnerSelector(
    state,
    owner,
  )

  const githubOAuthToken = selectors.githubOAuthTokenSelector(state)!

  const githubToken =
    (subscription && subscription.type === 'activity' && installationToken) ||
    githubOAuthToken ||
    selectors.githubAppTokenSelector(state)

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
      const mergedItems = mergeNotificationsPreservingEnhancement(
        newItems,
        prevItems,
      )

      const olderNotificationDate = getOlderNotificationDate(mergedItems)
      const olderDateFromThisResponse = getOlderNotificationDate(newItems)

      if (!notificationsCache) {
        notificationsCache = createNotificationsCache(prevItems)
      }

      const enhancementMap = yield call(
        getNotificationsEnhancementMap,
        mergedItems,
        {
          cache: notificationsCache,
          getGitHubInstallationTokenForRepo: (
            ownerName: string | undefined,
            repoName: string | undefined,
          ) =>
            selectors.installationTokenByRepoSelector(
              state,
              ownerName,
              repoName,
            ),
          githubOAuthToken,
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
        githubToken,
      })
      headers = (response && response.headers) || {}

      const prevItems = subscription.data.items || []
      const newItems = (response.data || []) as GitHubEvent[]
      const mergedItems = mergeEventsPreservingEnhancement(newItems, prevItems)

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

    const github = getGitHubAPIHeadersFromHeader(headers)

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
    const github = getGitHubAPIHeadersFromHeader(headers)

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

function* onMarkItemsAsReadOrUnread(
  action: ExtractActionFromActionCreator<
    typeof actions.markItemsAsReadOrUnread
  >,
) {
  const { itemIds, localOnly, type, unread } = action.payload

  if (localOnly) return

  // GitHub api does not support marking as unread yet :(
  // @see https://github.com/octokit/rest.js/issues/1232
  if (unread === true) return

  if (type !== 'notifications') return
  if (!(itemIds && itemIds.length)) return

  const results = yield all(
    itemIds.map(function*(itemId, index) {
      const threadId = itemId && parseInt(`${itemId}`, 10)
      if (!threadId) return

      if (index > 0) yield delay(100)

      try {
        return yield octokit.activity.markThreadAsRead({ thread_id: threadId })
      } catch (e) {
        console.error('Failed to mark single notification as read', e)
        bugsnag.notify(e)

        return null
      }
    }),
  )

  const failedIds: string[] = results
    .map((result: Response<any>, index: number) =>
      result && result.status >= 200 && result.status < 400
        ? undefined
        : action.payload.itemIds[index],
    )
    .filter(Boolean)

  if (failedIds.length) {
    yield put(
      actions.markItemsAsReadOrUnread({
        localOnly: true,
        itemIds: failedIds,
        type: action.payload.type,
        unread: !action.payload.unread,
      }),
    )
  }
}

function* onMarkAllNotificationsAsReadOrUnread(
  action: ExtractActionFromActionCreator<
    typeof actions.markAllNotificationsAsReadOrUnread
  >,
) {
  const { localOnly, unread } = action.payload

  if (localOnly) return

  // GitHub api does not support marking as unread yet :(
  // @see https://github.com/octokit/rest.js/issues/1232
  if (unread === true) return

  try {
    yield octokit.activity.markAsRead({})
  } catch (e) {
    console.error('Failed to mark all notifications as read', e)
    bugsnag.notify(e)

    yield put(
      actions.markAllNotificationsAsReadOrUnread({
        localOnly: true,
        unread: !unread,
      }),
    )
  }
}

function* onMarkRepoNotificationsAsReadOrUnread(
  action: ExtractActionFromActionCreator<
    typeof actions.markRepoNotificationsAsReadOrUnread
  >,
) {
  const { owner, repo, localOnly, unread } = action.payload

  if (localOnly) return

  // GitHub api does not support marking as unread yet :(
  // @see https://github.com/octokit/rest.js/issues/1232
  if (unread === true) return

  try {
    if (!(owner && repo))
      throw new Error(
        'Required params to mark repo notifications as read: owner, repo',
      )

    yield octokit.activity.markNotificationsAsReadForRepo({ owner, repo })
  } catch (e) {
    console.error('Failed to mark all notifications as read', e)
    bugsnag.notify(e)

    yield put(
      actions.markRepoNotificationsAsReadOrUnread({
        owner,
        repo,
        localOnly: true,
        unread: !unread,
      }),
    )
  }
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
    yield takeLatest('REMOVE_SUBSCRIPTION_FROM_COLUMN', cleanupSubscriptions),
    yield takeLatest('REPLACE_COLUMNS_AND_SUBSCRIPTIONS', cleanupSubscriptions),
    yield takeEvery('FETCH_COLUMN_SUBSCRIPTIONS', onFetchColumnSubscriptions),
    yield takeEvery('FETCH_SUBSCRIPTION_FAILURE', onFetchFailed),
    yield takeEvery('MARK_ITEMS_AS_READ_OR_UNREAD', onMarkItemsAsReadOrUnread),
    yield takeEvery(
      'MARK_ALL_NOTIFICATIONS_AS_READ_OR_UNREAD',
      onMarkAllNotificationsAsReadOrUnread,
    ),
    yield takeEvery(
      'MARK_REPO_NOTIFICATIONS_AS_READ_OR_UNREAD',
      onMarkRepoNotificationsAsReadOrUnread,
    ),
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
