import { Response } from '@octokit/rest'
import _ from 'lodash'
import { REHYDRATE } from 'redux-persist'
import {
  actionChannel,
  all,
  call,
  delay,
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
  createIssuesOrPullRequestsCache,
  createNotificationsCache,
  enhanceIssueOrPullRequests,
  EnhancementCache,
  enhanceNotifications,
  getGitHubAPIHeadersFromHeader,
  getIssueOrPullRequestsEnhancementMap,
  getNotificationsEnhancementMap,
  getOlderEventDate,
  getOlderIssueOrPullRequestDate,
  getOlderNotificationDate,
  GitHubAppTokenType,
  GitHubEvent,
  GitHubIssueOrPullRequest,
  GitHubNotification,
  IssueOrPullRequestColumnSubscription,
  mergeEventsPreservingEnhancement,
  mergeIssuesOrPullRequestsPreservingEnhancement,
  mergeNotificationsPreservingEnhancement,
} from '@devhub/core'

import { bugsnag } from '../../libs/bugsnag'
import {
  getActivity,
  getIssuesOrPullRequests,
  getNotifications,
  octokit,
} from '../../libs/github'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { ExtractActionFromActionCreator } from '../types/base'

let issuesOrPullRequestsCache: EnhancementCache
let notificationsCache: EnhancementCache

function* init() {
  // yield take('LOGIN_SUCCESS')
  yield take(['REFRESH_INSTALLATIONS_SUCCESS', 'REFRESH_INSTALLATIONS_FAILURE'])

  let isFirstTime = true
  while (true) {
    const { action } = yield race({
      delay: delay(isFirstTime ? 0 : 10 * 1000),
      action: take([
        'LOGIN_SUCCESS',
        'LOGIN_FAILURE',
        'LOGOUT',
        'REPLACE_COLUMNS_AND_SUBSCRIPTIONS',
        'REFRESH_INSTALLATIONS_SUCCESS',
      ]),
    })

    const forceFetchAll = !!(
      action &&
      (action.type === 'LOGIN_SUCCESS' ||
        action.type === 'REFRESH_INSTALLATIONS_SUCCESS')
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
              s.data.loadState !== 'loading' &&
              s.data.loadState !== 'loading_first' &&
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
              subscription.id,
              subscription.type,
              subscription.subtype,
              subscription.data && subscription.data.errorMessage,
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

  const column = selectors.columnSelector(state, action.payload.column.id)
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

  const columnSubscriptions = selectors.columnSubscriptionsSelector(
    state,
    action.payload.columnId,
  )
  if (!(columnSubscriptions && columnSubscriptions.length)) return

  yield all(
    columnSubscriptions.map(function*(subscription) {
      if (!subscription) return

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

  const {
    params: payloadParams,
    subscriptionId,
    subscriptionType,
  } = action.payload

  const subscription = selectors.subscriptionSelector(state, subscriptionId)

  const owner =
    (subscription &&
      subscription.params &&
      (('owner' in subscription.params && subscription.params.owner) ||
        ('org' in subscription.params && subscription.params.org))) ||
    undefined

  const installationToken = selectors.installationTokenByOwnerSelector(
    state,
    owner,
  )
  const githubOAuthToken = selectors.githubOAuthTokenSelector(state)!
  const githubAppToken = selectors.githubAppTokenSelector(state)

  const githubToken =
    (subscription &&
      (subscription.type === 'activity' ||
        subscription.type === 'issue_or_pr') &&
      installationToken) ||
    githubOAuthToken ||
    githubAppToken

  const appTokenType: GitHubAppTokenType =
    (githubToken === installationToken && 'app-installation') ||
    (githubToken === githubAppToken && 'app-user-to-server') ||
    'oauth'

  const page = Math.max(1, payloadParams.page || 1)
  const perPage = Math.min(
    payloadParams.perPage || constants.DEFAULT_PAGINATION_PER_PAGE,
    50,
  )

  delete payloadParams.page
  delete payloadParams.perPage
  const requestParams = {
    ...payloadParams,
    page,
    per_page: perPage,
  }
  const subscriptionParams = subscription && subscription.params

  try {
    if (!githubToken) throw new Error('Not logged')

    let data
    let canFetchMore: boolean | undefined
    let headers
    if (subscription && subscription.type === 'notifications') {
      const response = yield call(
        getNotifications,
        { ...requestParams, ...subscriptionParams },
        { subscriptionId },
      )
      headers = (response && response.headers) || {}

      const prevItems = subscription.data.items || []
      const newItems = response.data as GitHubNotification[]
      const mergedItems = mergeNotificationsPreservingEnhancement(
        newItems,
        prevItems,
      )

      const olderItemDate = getOlderNotificationDate(mergedItems)
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

      const reponseContainOldest =
        !olderItemDate ||
        (!!olderDateFromThisResponse &&
          olderDateFromThisResponse <= olderItemDate)

      canFetchMore =
        newItems.length >= perPage
          ? reponseContainOldest
            ? true
            : undefined
          : reponseContainOldest
          ? false
          : undefined
    } else if (subscription && subscription.type === 'activity') {
      const response = yield call(
        getActivity,
        subscription.subtype,
        { ...requestParams, ...subscriptionParams },
        { subscriptionId, githubToken },
      )
      headers = (response && response.headers) || {}

      const prevItems = subscription.data.items || []
      const newItems = (response.data || []) as GitHubEvent[]
      const mergedItems = mergeEventsPreservingEnhancement(newItems, prevItems)

      const olderItemDate = getOlderEventDate(mergedItems)
      const olderDateFromThisResponse = getOlderEventDate(newItems)

      data = newItems

      const reponseContainOldest =
        !olderItemDate ||
        (!!olderDateFromThisResponse &&
          olderDateFromThisResponse <= olderItemDate)

      canFetchMore =
        newItems.length >= perPage
          ? reponseContainOldest
            ? true
            : undefined
          : reponseContainOldest
          ? false
          : undefined
    } else if (subscription && subscription.type === 'issue_or_pr') {
      const response = yield call(
        getIssuesOrPullRequests,
        subscription.subtype,
        subscriptionParams as IssueOrPullRequestColumnSubscription['params'],
        requestParams,
        { subscriptionId, githubToken },
      )
      headers = (response && response.headers) || {}

      const prevItems = subscription.data.items || []
      const newItems = (response.data || []) as GitHubIssueOrPullRequest[]
      const mergedItems = mergeIssuesOrPullRequestsPreservingEnhancement(
        newItems,
        prevItems,
      )

      const olderItemDate = getOlderIssueOrPullRequestDate(mergedItems)
      const olderDateFromThisResponse = getOlderIssueOrPullRequestDate(newItems)

      if (!issuesOrPullRequestsCache) {
        issuesOrPullRequestsCache = createIssuesOrPullRequestsCache(prevItems)
      }

      const enhancementMap = yield call(
        getIssueOrPullRequestsEnhancementMap,
        mergedItems,
        {
          cache: issuesOrPullRequestsCache,
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

      const enhancedItems = enhanceIssueOrPullRequests(
        newItems,
        enhancementMap,
        prevItems,
      )

      data = enhancedItems

      const reponseContainOldest =
        !olderItemDate ||
        (!!olderDateFromThisResponse &&
          olderDateFromThisResponse <= olderItemDate)

      canFetchMore =
        newItems.length >= perPage
          ? reponseContainOldest
            ? true
            : undefined
          : reponseContainOldest
          ? false
          : undefined
    } else {
      throw new Error(
        `Unknown column subscription type: ${subscription &&
          (subscription as any).type}`,
      )
    }

    const githubAPIHeaders = getGitHubAPIHeadersFromHeader(headers)

    yield put(
      actions.fetchSubscriptionSuccess({
        subscriptionType,
        subscriptionId,
        data,
        canFetchMore,
        github: { appTokenType, headers: githubAPIHeaders },
      }),
    )
  } catch (error) {
    console.error(
      `Failed to load GitHub ${(subscription && subscription.type) || 'data'}`,
      error,
    )
    // bugsnag.notify(error)

    const headers = error && error.response && error.response.headers
    const githubAPIHeaders = getGitHubAPIHeadersFromHeader(headers)

    yield put(
      actions.fetchSubscriptionFailure(
        {
          subscriptionType,
          subscriptionId,
          github: { appTokenType, headers: githubAPIHeaders },
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
    action.error.message === 'Bad credentials' &&
    action.payload &&
    action.payload.github &&
    (action.payload.github.appTokenType === 'app-user-to-server' ||
      action.payload.github.appTokenType === 'oauth')
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
  if (unread) return

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
  if (unread) return

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
  if (unread) return

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
const minPollingInterval = 2 * minute
function minimumRefetchTimeHasPassed(
  subscription: ColumnSubscription,
  _interval = minPollingInterval,
) {
  if (!subscription) return false

  const interval =
    typeof _interval === 'number' && _interval > 0
      ? Math.min(Math.max(minPollingInterval, _interval), 60 * minute)
      : minute

  return (
    !subscription.data.lastFetchedAt ||
    new Date(subscription.data.lastFetchedAt).valueOf() <= Date.now() - interval
  )
}
