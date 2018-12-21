import { all, select, takeLatest } from 'redux-saga/effects'

import {
  ActivityColumnSubscription,
  ColumnsAndSubscriptions,
  createSubscriptionObjectWithId,
  guid,
  NotificationColumnSubscription,
} from '@devhub/core'
import { delay } from 'redux-saga'
import { emitter } from '../../setup'
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

export function* columnsSagas() {
  yield all([
    yield takeLatest('ADD_COLUMN_AND_SUBSCRIPTIONS', onAddColumn),
    yield takeLatest('MOVE_COLUMN', onMoveColumn),
    yield takeLatest('DELETE_COLUMN', onDeleteColumn),
  ])
}
