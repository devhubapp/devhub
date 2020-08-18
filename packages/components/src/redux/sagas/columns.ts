import { AppState, InteractionManager } from 'react-native'
import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'

import {
  ActivityColumnSubscriptionCreation,
  Column,
  ColumnsAndSubscriptions,
  ColumnSubscription,
  createSubscriptionObjectWithId,
  getDefaultPaginationPerPage,
  getUniqueIdForSubscription,
  guid,
  isReadFilterChecked,
  IssueOrPullRequestColumn,
  IssueOrPullRequestColumnSubscription,
  IssueOrPullRequestColumnSubscriptionCreation,
  itemPassesFilterRecord,
  NotificationColumn,
  NotificationColumnSubscription,
} from '@devhub/core'
import { emitter } from '../../libs/emitter'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { ExtractActionFromActionCreator } from '../types/base'

export function getDefaultColumns(username: string): ColumnsAndSubscriptions {
  const notificationSubscription = createSubscriptionObjectWithId({
    type: 'notifications',
    subtype: undefined,
    params: {
      all: true,
      participating: false,
    },
  }) as NotificationColumnSubscription

  const userReceivedEventsSubscription = createSubscriptionObjectWithId<
    ActivityColumnSubscriptionCreation
  >({
    type: 'activity',
    subtype: 'USER_RECEIVED_EVENTS',
    params: {
      username,
    },
  })

  const involvedIssuesAndPRsSubscription = createSubscriptionObjectWithId<
    IssueOrPullRequestColumnSubscriptionCreation
  >({
    type: 'issue_or_pr',
    subtype: undefined,
    params: {
      involves: { [username.toLowerCase()]: true },
      subjectType: undefined,
    },
  })

  const myReposIssuesAndPRsSubscription = createSubscriptionObjectWithId<
    IssueOrPullRequestColumnSubscriptionCreation
  >({
    type: 'issue_or_pr',
    subtype: undefined,
    params: {
      owners: { [username.toLowerCase()]: { value: true, repos: {} } },
      subjectType: undefined,
    },
  })

  const userEventsSubscription = createSubscriptionObjectWithId<
    ActivityColumnSubscriptionCreation
  >({
    type: 'activity',
    subtype: 'USER_EVENTS',
    params: {
      username,
    },
  })

  const result: ColumnsAndSubscriptions = {
    columns: [
      {
        id: guid(),
        subscriptionIds: [notificationSubscription.id],
        subscriptionIdsHistory: [notificationSubscription.id],
        type: 'notifications',
        filters: {
          notifications: {
            participating: notificationSubscription.params.participating,
          },
        },
      },
      {
        id: guid(),
        subscriptionIds: [userReceivedEventsSubscription.id],
        subscriptionIdsHistory: [userReceivedEventsSubscription.id],
        type: 'activity',
        filters: {
          subjectTypes: {
            Commit: true,
            Release: true,
            Repository: true,
            Tag: true,
            User: true,
          },
        },
      },
      {
        id: guid(),
        subscriptionIds: [involvedIssuesAndPRsSubscription.id],
        subscriptionIdsHistory: [involvedIssuesAndPRsSubscription.id],
        type: 'issue_or_pr',
        filters: {
          involves: involvedIssuesAndPRsSubscription.params.involves,
          owners: involvedIssuesAndPRsSubscription.params.owners,
          subjectTypes: involvedIssuesAndPRsSubscription.params.subjectType
            ? {
                [involvedIssuesAndPRsSubscription.params.subjectType]: true,
              }
            : undefined,
        },
      },
      {
        id: guid(),
        subscriptionIds: [myReposIssuesAndPRsSubscription.id],
        subscriptionIdsHistory: [myReposIssuesAndPRsSubscription.id],
        type: 'issue_or_pr',
        filters: {
          involves: myReposIssuesAndPRsSubscription.params.involves,
          owners: myReposIssuesAndPRsSubscription.params.owners,
          subjectTypes: myReposIssuesAndPRsSubscription.params.subjectType
            ? {
                [myReposIssuesAndPRsSubscription.params.subjectType]: true,
              }
            : undefined,
        },
      },
      {
        id: guid(),
        subscriptionIds: [userEventsSubscription.id],
        subscriptionIdsHistory: [userEventsSubscription.id],
        type: 'activity',
        filters: undefined,
      },
    ],
    subscriptions: [
      notificationSubscription,
      userReceivedEventsSubscription,
      involvedIssuesAndPRsSubscription,
      myReposIssuesAndPRsSubscription,
      userEventsSubscription,
    ],
  }

  return result
}

function* onAddColumn(
  action: ExtractActionFromActionCreator<
    typeof actions.addColumnAndSubscriptions
  >,
) {
  const columnId = action.payload.column.id

  if (AppState.currentState === 'active')
    yield call(InteractionManager.runAfterInteractions)

  emitter.emit('FOCUS_ON_COLUMN', {
    animated: true,
    columnId,
    highlight: true,
    scrollTo: true,
  })
}

function* onMoveColumn(
  action: ExtractActionFromActionCreator<typeof actions.moveColumn>,
) {
  const ids: string[] = yield select(selectors.columnIdsSelector)
  if (!(ids && ids.length)) return

  const columnIndex = Math.max(
    0,
    Math.min(action.payload.columnIndex, ids.length - 1),
  )
  if (Number.isNaN(columnIndex)) return

  const columnId = action.payload.columnId

  emitter.emit('FOCUS_ON_COLUMN', {
    animated: true,
    highlight: false,
    scrollTo: true,
    ...action.payload,
    columnId,
    focusOnVisibleItem: true,
  })
}

function* onDeleteColumn(
  action: ExtractActionFromActionCreator<typeof actions.deleteColumn>,
) {
  const ids: string[] = yield select(selectors.columnIdsSelector)
  if (!(ids && ids.length)) return

  // Fixes blank screen on Android after removing the last column.
  // If removed the last column,
  // scroll to the new last valid column
  if (action.payload.columnIndex > ids.length - 1) {
    emitter.emit('FOCUS_ON_COLUMN', {
      animated: false,
      columnId: ids[ids.length - 1],
      highlight: false,
      scrollTo: true,
    })
  }
}

function* onClearColumnOrColumns(
  action: ExtractActionFromActionCreator<
    typeof actions.setColumnClearedAtFilter | typeof actions.clearAllColumns
  >,
) {
  if (action.payload.clearedAt === null) return
  yield put(actions.cleanupArchivedItems())
}

function* onColumnSubscriptionFilterChange(
  action:
    | ExtractActionFromActionCreator<typeof actions.clearColumnFilters>
    | ExtractActionFromActionCreator<typeof actions.replaceColumnFilters>
    | ExtractActionFromActionCreator<typeof actions.replaceColumnOwnerFilter>
    | ExtractActionFromActionCreator<typeof actions.replaceColumnWatchingFilter>
    | ExtractActionFromActionCreator<typeof actions.setColummDraftFilter>
    | ExtractActionFromActionCreator<typeof actions.setColumnInvolvesFilter>
    | ExtractActionFromActionCreator<typeof actions.setColumnLabelFilter>
    | ExtractActionFromActionCreator<typeof actions.setColumnOwnerFilter>
    | ExtractActionFromActionCreator<typeof actions.setColumnWatchingFilter>
    | ExtractActionFromActionCreator<
        typeof actions.setColumnParticipatingFilter
      >
    | ExtractActionFromActionCreator<typeof actions.setColumnRepoFilter>
    | ExtractActionFromActionCreator<typeof actions.setColummStateTypeFilter>
    | ExtractActionFromActionCreator<typeof actions.setColummSubjectTypeFilter>
    | ExtractActionFromActionCreator<typeof actions.setColumnUnreadFilter>,
) {
  if (!action.payload.columnId) return

  const column: Column = yield select(
    selectors.columnSelector,
    action.payload.columnId,
  )
  if (!(column && column.id)) return

  const subscriptions: ColumnSubscription[] = yield select(
    selectors.createColumnSubscriptionsSelector(),
    column.id,
  )
  if (!(subscriptions && subscriptions.length)) return

  yield all(
    subscriptions.map(function* (subscription: ColumnSubscription) {
      if (!(subscription && subscription.id)) return

      let newSubscriptionParams
      let newSubscriptionId: string
      let newSubscription

      if (subscription.type === 'notifications') {
        const c = column as NotificationColumn

        newSubscriptionParams = {
          ...subscription.params,
          all: isReadFilterChecked(c.filters) ? true : false,
          participating:
            c.filters &&
            c.filters.notifications &&
            c.filters.notifications.participating
              ? true
              : false,
        } as NotificationColumnSubscription['params']

        newSubscriptionId = getUniqueIdForSubscription({
          ...subscription,
          params: newSubscriptionParams,
        })

        newSubscription = {
          id: newSubscriptionId,
          type: subscription.type,
          subtype: subscription.subtype,
          params: newSubscriptionParams,
          data: {
            itemNodeIdOrIds: subscription.data.itemNodeIdOrIds,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as NotificationColumnSubscription
      } else if (subscription.type === 'issue_or_pr') {
        const c = column as IssueOrPullRequestColumn

        const includesIssues =
          !!c.filters &&
          itemPassesFilterRecord(c.filters.subjectTypes!, 'Issue', true)
        const includesPRs =
          !!c.filters &&
          itemPassesFilterRecord(c.filters.subjectTypes!, 'PullRequest', true)

        newSubscriptionParams = {
          ...subscription.params,
          draft: c.filters ? c.filters.draft : subscription.params.draft,
          state: c.filters ? c.filters.state : subscription.params.state,
          involves: c.filters
            ? c.filters.involves
            : subscription.params.involves,
          owners:
            action.type === 'CLEAR_COLUMN_FILTERS' ||
            action.type === 'REPLACE_COLUMN_FILTERS' ||
            action.type === 'REPLACE_COLUMN_OWNER_FILTER' ||
            action.type === 'REPLACE_COLUMN_WATCHING_FILTER' ||
            action.type === 'SET_COLUMN_OWNER_FILTER' ||
            action.type === 'SET_COLUMN_WATCHING_FILTER' ||
            action.type === 'SET_COLUMN_REPO_FILTER'
              ? c.filters && c.filters.owners
              : subscription.params.owners,
          query:
            action.type === 'CLEAR_COLUMN_FILTERS' ||
            action.type === 'REPLACE_COLUMN_FILTERS' ||
            action.type === 'SET_COLUMN_LABEL_FILTER'
              ? c.filters && c.filters.query
              : subscription.params.query,
          subjectType:
            includesIssues && !includesPRs
              ? 'Issue'
              : !includesIssues && includesPRs
              ? 'PullRequest'
              : undefined,
        } as IssueOrPullRequestColumnSubscription['params']

        newSubscriptionId = getUniqueIdForSubscription({
          ...subscription,
          params: newSubscriptionParams,
        })

        newSubscription = {
          id: newSubscriptionId,
          type: subscription.type,
          subtype:
            includesIssues && !includesPRs
              ? 'ISSUES'
              : !includesIssues && includesPRs
              ? 'PULLS'
              : undefined,
          params: newSubscriptionParams,
          data: {
            itemNodeIdOrIds: subscription.data.itemNodeIdOrIds,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as IssueOrPullRequestColumnSubscription
      } else {
        return
      }

      const result = []

      if (newSubscriptionId === subscription.id) return

      result.push(
        yield put(
          actions.addColumnSubscription({
            columnId: column.id,
            subscription: newSubscription,
          }),
        ),
      )

      result.push(
        yield put(
          actions.removeSubscriptionFromColumn({
            columnId: column.id,
            subscriptionId: subscription.id,
          }),
        ),
      )

      result.push(
        yield put(
          actions.fetchSubscriptionRequest({
            params: {
              ...newSubscription.params,
              page: 1,
              perPage: getDefaultPaginationPerPage(column.type),
            },
            subscriptionId: newSubscription.id,
            subscriptionType: newSubscription.type,
            replaceAllItems: true,
          }),
        ),
      )

      return yield all(result)
    }),
  )
}

export function* columnsSagas() {
  yield all([
    yield takeEvery('ADD_COLUMN_AND_SUBSCRIPTIONS', onAddColumn),
    yield takeEvery('MOVE_COLUMN', onMoveColumn),
    yield takeEvery('DELETE_COLUMN', onDeleteColumn),
    yield takeLatest(
      ['SET_COLUMN_CLEARED_AT_FILTER', 'CLEAR_ALL_COLUMNS'],
      onClearColumnOrColumns,
    ),
    yield takeLatest(
      [
        'CLEAR_COLUMN_FILTERS',
        'REPLACE_COLUMN_FILTERS',
        'REPLACE_COLUMN_OWNER_FILTER',
        'REPLACE_COLUMN_WATCHING_FILTER',
        'SET_COLUMN_DRAFT_FILTER',
        'SET_COLUMN_INVOLVES_FILTER',
        'SET_COLUMN_LABEL_FILTER',
        'SET_COLUMN_OWNER_FILTER',
        'SET_COLUMN_PARTICIPATING_FILTER',
        'SET_COLUMN_REPO_FILTER',
        'SET_COLUMN_STATE_FILTER',
        'SET_COLUMN_SUBJECT_TYPE_FILTER',
        'SET_COLUMN_UNREAD_FILTER',
        'SET_COLUMN_WATCHING_FILTER',
      ],
      onColumnSubscriptionFilterChange,
    ),
  ])
}
