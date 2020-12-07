import {
  Column,
  ColumnSubscription,
  constants,
  createIssuesOrPullRequestsCache,
  createNotificationsCache,
  EnhancedGitHubEvent,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedGitHubNotification,
  EnhancedItem,
  enhanceIssueOrPullRequests,
  EnhancementCache,
  enhanceNotifications,
  getDefaultPaginationPerPage,
  getGitHubAPIHeadersFromHeader,
  getIssueOrPullRequestsEnhancementMap,
  getItemDate,
  getNotificationsEnhancementMap,
  getOlderOrNewerItemDate,
  getSubscriptionOwnerOrOrg,
  GitHubAppTokenType,
  GitHubEvent,
  GitHubIssueOrPullRequest,
  GitHubNotification,
  IssueOrPullRequestColumnSubscription,
  mergeEventsPreservingEnhancement,
  mergeIssuesOrPullRequestsPreservingEnhancement,
  mergeNotificationsPreservingEnhancement,
} from '@devhub/core'
import { Octokit } from '@octokit/rest'
import _ from 'lodash'
import { Alert, AppState, InteractionManager } from 'react-native'
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

import { Browser } from '../../libs/browser'
import { bugsnag } from '../../libs/bugsnag'
import { confirm } from '../../libs/confirm'
import { emitter } from '../../libs/emitter'
import * as github from '../../libs/github'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { ExtractActionFromActionCreator } from '../types/base'

let issuesOrPullRequestsCache: EnhancementCache
let notificationsCache: EnhancementCache

function* init() {
  const initialAction = yield take([
    'REFRESH_INSTALLATIONS_SUCCESS',
    'REFRESH_INSTALLATIONS_FAILURE',
    'REFRESH_INSTALLATIONS_NOOP',
  ])

  let _isFirstTime = true
  while (true) {
    const { action } = yield race({
      delay: delay(_isFirstTime ? 0 : 10 * 1000),
      action: take([
        'LOGIN_FAILURE',
        'LOGIN_SUCCESS',
        'LOGOUT',
        'REFRESH_INSTALLATIONS_SUCCESS',
        'REPLACE_COLUMNS_AND_SUBSCRIPTIONS',
        'REPLACE_PERSONAL_TOKEN_DETAILS',
      ]),
    })

    const forceFetchAll = !!(
      (_isFirstTime &&
        initialAction.type === 'REFRESH_INSTALLATIONS_SUCCESS') ||
      action?.type === 'LOGIN_SUCCESS' ||
      action?.type === 'REFRESH_INSTALLATIONS_SUCCESS' ||
      action?.type === 'REPLACE_PERSONAL_TOKEN_DETAILS'
    )

    const isFirstTime = _isFirstTime
    _isFirstTime = false

    const state = yield select()

    if (isFirstTime) {
      const hasCreatedColumn = yield select(selectors.hasCreatedColumnSelector)
      if (!hasCreatedColumn)
        yield take([
          'ADD_COLUMN_AND_SUBSCRIPTIONS',
          'REPLACE_COLUMNS_AND_SUBSCRIPTIONS',
        ])
    }

    const isLogged = selectors.isLoggedSelector(state)
    if (!isLogged) continue

    const subscriptions = selectors.allSubscriptionsArrSelector(state)
    if (!(subscriptions && subscriptions.length)) continue

    const githubHeaders = selectors.githubAPIHeadersSelector(state)

    // TODO: Eventually the number of subscriptions wont be 1x1 with the number of columns
    // Because columns will be able to have multiple subscriptions.
    // When that happens, improve this COLUMNS_LIMIT.
    // Limit based on number of columns or subscriptions?
    const subscriptionsToFetch = subscriptions
      .slice(0, constants.COLUMNS_LIMIT)
      .filter(
        (s) =>
          s &&
          !(
            (s.data.loadState === 'loading' ||
              s.data.loadState === 'loading_first') &&
            !minimumRefetchTimeHasPassed(s, 1 * 60 * 1000)
          ) &&
          (forceFetchAll ||
            minimumRefetchTimeHasPassed(
              s,
              typeof githubHeaders.pollInterval === 'number'
                ? githubHeaders.pollInterval * 1000
                : undefined,
            )),
      )
    if (!(subscriptionsToFetch && subscriptionsToFetch.length)) continue

    yield all(
      subscriptionsToFetch.map(function* (subscription) {
        if (!subscription) return

        const lastFetchedAt = selectors.subscriptionLastFetchedAtSelector(
          state,
          subscription.id,
        )

        const fiveMinutes = 1000 * 60 * 5
        const timeDiff = lastFetchedAt
          ? Date.now() - new Date(lastFetchedAt).valueOf()
          : undefined

        if (
          !forceFetchAll &&
          subscription &&
          subscription.data &&
          subscription.data.loadState === 'error' &&
          (!timeDiff || timeDiff < fiveMinutes)
        ) {
          if (__DEV__) {
            // eslint-disable-next-line no-console
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

        const replaceAllItems = isFirstTime

        return yield put(
          actions.fetchSubscriptionRequest({
            subscriptionType: subscription.type,
            subscriptionId: subscription.id,
            params: {
              page: 1,
              since:
                replaceAllItems || subscription.type === 'notifications'
                  ? undefined
                  : subscription.data.newestItemDate,
            },
            replaceAllItems,
          }),
        )
      }),
    )
  }
}

function* cleanupSubscriptions() {
  if (AppState.currentState === 'active')
    yield call(InteractionManager.runAfterInteractions)

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

function* handleOpenItem(
  action: ExtractActionFromActionCreator<typeof actions.openItem>,
) {
  if (action.payload.link) Browser.openURLOnNewTab(action.payload.link)

  if (AppState.currentState === 'active')
    yield call(InteractionManager.runAfterInteractions)

  if (action.payload.itemNodeIdOrId) {
    yield put(
      actions.markItemsAsReadOrUnread({
        type: action.payload.columnType,
        itemNodeIdOrIds: [action.payload.itemNodeIdOrId],
        localOnly: true,
        unread: false,
      }),
    )
  }

  if (action.payload.columnId) {
    emitter.emit('FOCUS_ON_COLUMN', {
      columnId: action.payload.columnId,
      scrollTo: true,
    })

    emitter.emit('FOCUS_ON_COLUMN_ITEM', {
      columnId: action.payload.columnId,
      itemNodeIdOrId: action.payload.itemNodeIdOrId,
      scrollTo: true,
    })
  }
}

function* onAddColumn(
  action: ExtractActionFromActionCreator<
    typeof actions.addColumnAndSubscriptions
  >,
) {
  if (AppState.currentState === 'active')
    yield call(InteractionManager.runAfterInteractions)

  const state = yield select()

  const column = selectors.columnSelector(state, action.payload.column.id)
  if (!column) return

  yield put(
    actions.fetchColumnSubscriptionRequest({
      columnId: column.id,
      params: { page: 1 },
      replaceAllItems: false,
    }),
  )
}

function* onFetchColumnSubscriptions(
  action: ExtractActionFromActionCreator<
    typeof actions.fetchColumnSubscriptionRequest
  >,
) {
  const state = yield select()

  const columnSubscriptions = selectors.createColumnSubscriptionsSelector()(
    state,
    action.payload.columnId,
  )
  if (!(columnSubscriptions && columnSubscriptions.length)) return

  yield all(
    columnSubscriptions.map(function* (subscription) {
      if (!subscription) return

      return yield put(
        actions.fetchSubscriptionRequest({
          subscriptionType: subscription.type,
          subscriptionId: subscription.id,
          params: action.payload.params,
          replaceAllItems: action.payload.replaceAllItems,
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
    replaceAllItems,
    subscriptionId,
    subscriptionType,
  } = action.payload

  const subscriptionsDataSelector = selectors.createSubscriptionsDataSelector()

  const subscription = selectors.subscriptionSelector(state, subscriptionId)

  const owner = getSubscriptionOwnerOrOrg(subscription)

  const privateToken = selectors.getPrivateTokenByOwnerSelector(state, owner)
  const installationToken = selectors.installationTokenByOwnerSelector(
    state,
    owner,
  )
  const githubOAuthOrPersonalToken = selectors.githubTokenSelector(state)!
  const githubAppTokenDetails = selectors.githubAppTokenDetailsSelector(state)
  const loggedUsername = selectors.currentGitHubUsernameSelector(state)!

  const githubToken =
    (subscription &&
      (subscription.type === 'activity' ||
        subscription.type === 'issue_or_pr') &&
      privateToken) ||
    githubOAuthOrPersonalToken ||
    (githubAppTokenDetails && githubAppTokenDetails.token)

  const appTokenType: GitHubAppTokenType =
    (githubToken === installationToken && 'app-installation') ||
    (githubToken === (githubAppTokenDetails && githubAppTokenDetails.token) &&
      'app-user-to-server') ||
    'oauth'

  const page = Math.max(1, payloadParams.page || 1)
  const perPage =
    payloadParams.perPage ||
    (subscription && subscription.type
      ? getDefaultPaginationPerPage(subscription.type)
      : _.min([
          getDefaultPaginationPerPage('activity'),
          getDefaultPaginationPerPage('issue_or_pr'),
          getDefaultPaginationPerPage('notifications'),
        ]))!

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
        github.getNotifications,
        { ...requestParams, ...subscriptionParams },
        { githubToken, subscriptionId },
      )
      headers = (response && response.headers) || {}

      const prevItems = subscriptionsDataSelector(state, [
        subscription.id,
      ]) as EnhancedGitHubNotification[]
      const newItems = response.data as GitHubNotification[]
      const mergedItems = mergeNotificationsPreservingEnhancement(
        newItems,
        prevItems,
        { dropPrevItems: replaceAllItems },
      )

      const olderDateFromThisResponse = getOlderOrNewerItemDate(
        'notifications',
        'older',
        newItems,
      )
      const olderItemDate = getOlderOrNewerItemDate(
        'notifications',
        'older',
        mergedItems,
      )

      if (!notificationsCache) {
        notificationsCache = createNotificationsCache(prevItems)
      }

      const enhancementMap = yield call(
        getNotificationsEnhancementMap,
        mergedItems,
        {
          cache: notificationsCache,
          getGitHubPrivateTokenForRepo: (
            ownerName: string | undefined,
            repoName: string | undefined,
          ) =>
            selectors.getPrivateTokenByRepoSelector(state, ownerName, repoName),
          githubLogin: loggedUsername,
          githubToken,
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
        github.getActivity,
        subscription.subtype,
        { ...requestParams, ...subscriptionParams },
        { githubToken, subscriptionId },
      )
      headers = (response && response.headers) || {}

      const prevItems = subscriptionsDataSelector(state, [
        subscription.id,
      ]) as EnhancedGitHubEvent[]
      const newItems = (response.data || []) as GitHubEvent[]
      const mergedItems = mergeEventsPreservingEnhancement(
        newItems,
        prevItems,
        { dropPrevItems: replaceAllItems },
      )

      const olderDateFromThisResponse = getOlderOrNewerItemDate(
        'activity',
        'older',
        newItems,
      )
      const olderItemDate = getOlderOrNewerItemDate(
        'activity',
        'older',
        mergedItems,
      )

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
        github.getIssuesOrPullRequests,
        subscription.subtype,
        subscriptionParams as IssueOrPullRequestColumnSubscription['params'],
        requestParams,
        { githubToken, subscriptionId },
      )
      headers = (response && response.headers) || {}

      const prevItems = subscriptionsDataSelector(state, [
        subscription.id,
      ]) as EnhancedGitHubIssueOrPullRequest[]
      const newItems = (response.data || []) as GitHubIssueOrPullRequest[]
      const mergedItems = mergeIssuesOrPullRequestsPreservingEnhancement(
        newItems,
        prevItems,
        { dropPrevItems: replaceAllItems },
      )

      const olderDateFromThisResponse = getOlderOrNewerItemDate(
        'issue_or_pr',
        'older',
        newItems,
      )
      const olderItemDate = getOlderOrNewerItemDate(
        'issue_or_pr',
        'older',
        mergedItems,
      )

      if (!issuesOrPullRequestsCache) {
        issuesOrPullRequestsCache = createIssuesOrPullRequestsCache(prevItems)
      }

      const enhancementMap = yield call(
        getIssueOrPullRequestsEnhancementMap,
        mergedItems,
        {
          cache: issuesOrPullRequestsCache,
          getGitHubPrivateTokenForRepo: (
            ownerName: string | undefined,
            repoName: string | undefined,
          ) =>
            selectors.getPrivateTokenByRepoSelector(state, ownerName, repoName),
          githubToken,
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
        `Unknown column subscription type: ${
          subscription && (subscription as any).type
        }`,
      )
    }

    if (data && requestParams.since) {
      data = (data as EnhancedItem[]).filter(
        (item) =>
          !!(
            item &&
            requestParams.since &&
            getItemDate(item) &&
            getItemDate(item)! > requestParams.since
          ),
      )
    }

    const githubAPIHeaders = getGitHubAPIHeadersFromHeader(headers)

    if (AppState.currentState === 'active')
      yield call(InteractionManager.runAfterInteractions)

    yield put(
      actions.fetchSubscriptionSuccess({
        subscriptionType,
        subscriptionId,
        data,
        canFetchMore,
        replaceAllItems,
        github: { appTokenType, loggedUsername, headers: githubAPIHeaders },
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
          replaceAllItems,
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
  const { itemNodeIdOrIds, localOnly, type, unread } = action.payload

  if (localOnly) return

  // GitHub api does not support marking as unread yet :(
  // @see https://github.com/octokit/rest.js/issues/1232
  if (unread) return

  if (type !== 'notifications') return
  if (!(itemNodeIdOrIds && itemNodeIdOrIds.length)) return

  const state = yield select()
  const githubToken = selectors.githubTokenSelector(state)
  if (!githubToken) return

  const octokit = github.getOctokitForToken(githubToken)

  const results = yield all(
    itemNodeIdOrIds.map(function* (itemNodeIdOrId, index) {
      const threadId = itemNodeIdOrId && parseInt(`${itemNodeIdOrId}`, 10)
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
    .map((result: Octokit.AnyResponse, index: number) =>
      result &&
      ((result.status >= 200 && result.status < 400) || result.status === 404)
        ? undefined
        : action.payload.itemNodeIdOrIds[index],
    )
    .filter(Boolean)

  if (failedIds.length) {
    yield put(
      actions.markItemsAsReadOrUnread({
        localOnly: true,
        itemNodeIdOrIds: failedIds,
        type: action.payload.type,
        unread: !action.payload.unread,
      }),
    )
  }
}

function* _markAllGitHubNotificationsAsReadOrUnread({
  unread,
}: { unread?: boolean } = {}) {
  // GitHub api does not support marking as unread yet :(
  // @see https://github.com/octokit/rest.js/issues/1232
  if (unread) return

  const state = yield select()
  const githubToken = selectors.githubTokenSelector(state)
  if (!githubToken) return

  const octokit = github.getOctokitForToken(githubToken)

  try {
    yield octokit.activity.markAsRead({})
  } catch (error) {
    Alert.alert(
      `Failed to mark all notifications as ${
        unread ? 'unread' : 'read'
      }. ${error}`,
    )
    bugsnag.notify(error)

    // yield put(
    //   actions.markAllNotificationsAsReadOrUnread({
    //     localOnly: true,
    //     unread: !unread,
    //   }),
    // )
  }
}

function* onMarkAllNotificationsAsReadOrUnread(
  action: ExtractActionFromActionCreator<
    typeof actions.markAllNotificationsAsReadOrUnread
  >,
) {
  const { localOnly, unread } = action.payload

  if (localOnly) return

  yield _markAllGitHubNotificationsAsReadOrUnread({ unread })
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

  const state = yield select()
  const githubToken = selectors.githubTokenSelector(state)
  if (!githubToken) return

  const octokit = github.getOctokitForToken(githubToken)

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

function* onMarkEverythingAsReadWithConfirmation(
  _action: ExtractActionFromActionCreator<
    typeof actions.markEverythingAsReadWithConfirmation
  >,
) {
  const confirmed = yield new Promise((resolve) => {
    confirm(
      'Mark all as read?',
      'All your GitHub notifications and all columns will be marked as read. ' +
        'This cannot be undone.',
      {
        confirmCallback() {
          resolve(true)
        },
        cancelCallback() {
          resolve(false)
        },
      },
    )
  })

  if (!confirmed) return

  yield put(actions.markEverythingAsRead())
  yield _markAllGitHubNotificationsAsReadOrUnread({ unread: false })
}

function* onClearAllColumnsWithConfirmation(
  _action: ExtractActionFromActionCreator<
    typeof actions.clearAllColumnsWithConfirmation
  >,
) {
  const confirmed = yield new Promise((resolve) => {
    confirm(
      'Clear all columns?',
      'All columns will become empty. ' +
        'Your GitHub notifications will be marked as read. ' +
        'This cannot be undone.',
      {
        confirmCallback() {
          resolve(true)
        },
        cancelCallback() {
          resolve(false)
        },
      },
    )
  })

  if (!confirmed) return

  yield put(actions.clearAllColumns())
}

export function* subscriptionsSagas() {
  yield all([
    yield fork(init),
    yield fork(watchFetchRequests),
    yield takeEvery('ADD_COLUMN_AND_SUBSCRIPTIONS', cleanupSubscriptions),
    yield takeEvery('ADD_COLUMN_AND_SUBSCRIPTIONS', onAddColumn),
    yield takeLatest(['LOGOUT', 'LOGIN_FAILURE'], onLogout),
    yield takeEvery('DELETE_COLUMN', cleanupSubscriptions),
    yield takeEvery('OPEN_ITEM', handleOpenItem),
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
    yield takeLatest(
      'MARK_EVERYTHING_AS_READ_WITH_CONFIRMATION',
      onMarkEverythingAsReadWithConfirmation,
    ),
    yield takeLatest(
      'CLEAR_ALL_COLUMNS_WITH_CONFIRMATION',
      onClearAllColumnsWithConfirmation,
    ),
  ])
}

const minute = 1000 * 60 * 1
function minimumRefetchTimeHasPassed(
  subscription: ColumnSubscription,
  interval = 0,
) {
  if (!subscription) return false

  const minPollingInterval =
    subscription.type === 'issue_or_pr'
      ? AppState.currentState === 'active'
        ? 2 * minute
        : 5 * minute
      : minute

  const fixedInterval =
    typeof interval === 'number' && interval >= 0
      ? Math.min(Math.max(minPollingInterval, interval), 60 * minute)
      : minPollingInterval

  const lastFetchedAt = _.max([
    subscription.data.lastFetchRequestAt,
    subscription.data.lastFetchFailureAt,
    subscription.data.lastFetchSuccessAt,
  ])

  return (
    !lastFetchedAt ||
    new Date(lastFetchedAt).valueOf() <= Date.now() - fixedInterval
  )
}
