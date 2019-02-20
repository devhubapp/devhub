import { all, put, select, takeLatest } from 'redux-saga/effects'

import {
  ActivityColumn,
  ActivityColumnSubscription,
  Column,
  ColumnsAndSubscriptions,
  ColumnSubscription,
  createSubscriptionObjectWithId,
  getUniqueIdForSubscription,
  guid,
  isReadFilterChecked,
  NotificationColumn,
  NotificationColumnSubscription,
} from '@devhub/core'
import { delay } from 'redux-saga'
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

  return {
    columns: [
      {
        id: guid(),
        subscriptionIds: [notificationSubscription.id],
        type: 'notifications',
        filters: undefined,
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
}

function* onAddColumn(
  action: ExtractActionFromActionCreator<
    typeof actions.addColumnAndSubscriptions
  >,
) {
  const columnId = action.payload.column.id

  yield delay(300)
  const ids: string[] = yield select(selectors.columnIdsSelector)
  const columnIndex = ids.findIndex(id => id === columnId)

  emitter.emit('FOCUS_ON_COLUMN', {
    animated: true,
    columnId,
    columnIndex,
    highlight: true,
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

  emitter.emit('FOCUS_ON_COLUMN', {
    animated: true,
    columnId: action.payload.columnId,
    columnIndex,
    highlight: true,
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
      columnIndex: ids.length - 1,
      highlight: false,
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
    selectors.createColumnSelector(),
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

function* onSetUnreadFilter(
  action: ExtractActionFromActionCreator<typeof actions.setColumnUnreadFilter>,
) {
  if (!action.payload.columnId) return

  const column: ActivityColumn | NotificationColumn = yield select(
    selectors.createColumnSelector(),
    action.payload.columnId,
  )
  if (!(column && column.id && column.type === 'notifications')) return

  const allSubscriptionIds: string[] = yield select(
    selectors.subscriptionIdsSelector,
  )
  if (!(allSubscriptionIds && allSubscriptionIds.length)) return

  const subscriptions: ColumnSubscription[] = yield select(
    selectors.columnSubscriptionsSelector,
    column.id,
  )
  if (!(subscriptions && subscriptions.length)) return

  yield all(
    subscriptions.map(function*(
      subscription: ActivityColumnSubscription | NotificationColumnSubscription,
    ) {
      if (!(subscription && subscription.id)) return
      if (subscription.type !== 'notifications') return

      const newSubscriptionParams = {
        ...subscription.params,
        all: isReadFilterChecked(column.filters) ? true : false,
      }

      const newSubscriptionId = getUniqueIdForSubscription({
        ...subscription,
        params: newSubscriptionParams,
      })

      const newSubscription = {
        ...subscription,
        id: newSubscriptionId,
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
            params: { ...newSubscription.params, page: 1, perPage: 10 },
            subscriptionId: newSubscription.id,
            subscriptionType: newSubscription.type,
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
    yield takeLatest('SET_COLUMN_UNREAD_FILTER', onSetUnreadFilter),
  ])
}
