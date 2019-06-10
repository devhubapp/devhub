import { all, delay, put, select, takeLatest } from 'redux-saga/effects'

import {
  ActivityColumnSubscription,
  AppViewMode,
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
      participating: true,
    },
  }) as NotificationColumnSubscription

  const userReceivedEventsSubscription = createSubscriptionObjectWithId({
    type: 'activity',
    subtype: 'USER_RECEIVED_EVENTS',
    params: {
      username,
    },
  }) as ActivityColumnSubscription

  const userEventsSubscription = createSubscriptionObjectWithId({
    type: 'activity',
    subtype: 'USER_EVENTS',
    params: {
      username,
    },
  }) as ActivityColumnSubscription

  const result: ColumnsAndSubscriptions = {
    columns: [
      {
        id: guid(),
        subscriptionIds: [notificationSubscription.id],
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
        type: 'activity',
        filters: undefined,
      },
      {
        id: guid(),
        subscriptionIds: [userEventsSubscription.id],
        type: 'activity',
        filters: undefined,
      },
    ],
    subscriptions: [
      notificationSubscription,
      userReceivedEventsSubscription,
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

  yield delay(300)

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
  const appViewMode: AppViewMode = yield select(selectors.appViewModeSelector)

  const ids: string[] = yield select(selectors.columnIdsSelector)
  if (!(ids && ids.length)) return

  const columnIndex = Math.max(
    0,
    Math.min(action.payload.columnIndex, ids.length - 1),
  )
  if (Number.isNaN(columnIndex)) return

  const columnId = action.payload.columnId

  emitter.emit('FOCUS_ON_COLUMN', {
    animated: appViewMode === 'multi-column',
    highlight: appViewMode === 'multi-column',
    scrollTo: true,
    ...action.payload,
    columnId,
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

function* onSetClearedAt(
  action: ExtractActionFromActionCreator<
    typeof actions.setColumnClearedAtFilter
  >,
) {
  if (!(action.payload.clearedAt && action.payload.columnId)) return

  const column: Column = yield select(
    selectors.columnSelector,
    action.payload.columnId,
  )

  if (!(column && column.subscriptionIds && column.subscriptionIds.length))
    return

  const columns: Column[] = yield select(selectors.columnsArrSelector)
  if (!(columns && columns.length)) return

  yield all(
    column.subscriptionIds.map(function*(subscriptionId) {
      if (!subscriptionId) return

      // deleteOlderThan will consider the clearedAt of the other columns
      // that are also using this subscription
      // because we cant remove their items, their columns were not cleared
      let deleteOlderThan = action.payload.clearedAt || undefined

      let hasColumnWithoutClearedAt = false
      columns.forEach(c => {
        if (!c.subscriptionIds.includes(subscriptionId)) return

        if (!(c.filters && c.filters.clearedAt))
          hasColumnWithoutClearedAt = true
        if (hasColumnWithoutClearedAt) return

        if (
          c.filters &&
          c.filters.clearedAt &&
          (!deleteOlderThan || c.filters.clearedAt < deleteOlderThan)
        ) {
          deleteOlderThan = c.filters.clearedAt
        }
      })

      if (hasColumnWithoutClearedAt) return

      return yield put(
        actions.cleanupSubscriptionsData({
          deleteOlderThan,
          subscriptionIds: [subscriptionId],
        }),
      )
    }),
  )
}

function* onColumnSubscriptionFilterChange(
  action:
    | ExtractActionFromActionCreator<typeof actions.setColumnUnreadFilter>
    | ExtractActionFromActionCreator<
        typeof actions.setColumnParticipatingFilter
      >
    | ExtractActionFromActionCreator<typeof actions.setColummSubjectTypeFilter>
    | ExtractActionFromActionCreator<typeof actions.setColummStateTypeFilter>
    | ExtractActionFromActionCreator<typeof actions.setColummDraftFilter>,
) {
  if (!action.payload.columnId) return

  const column: Column = yield select(
    selectors.columnSelector,
    action.payload.columnId,
  )
  if (!(column && column.id)) return

  const subscriptions: ColumnSubscription[] = yield select(
    selectors.columnSubscriptionsSelector,
    column.id,
  )
  if (!(subscriptions && subscriptions.length)) return

  yield all(
    subscriptions.map(function*(subscription: ColumnSubscription) {
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
            items: subscription.data.items,
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
            items: subscription.data.items,
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
    yield takeLatest('ADD_COLUMN_AND_SUBSCRIPTIONS', onAddColumn),
    yield takeLatest('MOVE_COLUMN', onMoveColumn),
    yield takeLatest('DELETE_COLUMN', onDeleteColumn),
    yield takeLatest('SET_COLUMN_CLEARED_AT_FILTER', onSetClearedAt),
    yield takeLatest(
      [
        'CLEAR_COLUMN_FILTERS',
        'SET_COLUMN_DRAFT_FILTER',
        'SET_COLUMN_PARTICIPATING_FILTER',
        'SET_COLUMN_STATE_FILTER',
        'SET_COLUMN_SUBJECT_TYPE_FILTER',
        'SET_COLUMN_UNREAD_FILTER',
      ],
      onColumnSubscriptionFilterChange,
    ),
  ])
}
