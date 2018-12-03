import { all, put, select, takeLatest } from 'redux-saga/effects'

import { ColumnAndSubscriptions } from '@devhub/core/src/types'
import { createSubscriptionObjectWithId } from '@devhub/core/src/utils/helpers/github/shared'
import { guid } from '@devhub/core/src/utils/helpers/shared'
import { delay } from 'redux-saga'
import { emitter } from '../../setup'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { ExtractActionFromActionCreator } from '../types/base'

function getDefaultColumns(username: string): ColumnAndSubscriptions[] {
  const notificationSubscription = createSubscriptionObjectWithId({
    type: 'notifications',
    subtype: undefined,
    params: {
      all: true,
    },
  })

  const userReceivedEventsSubscription = createSubscriptionObjectWithId({
    type: 'activity',
    subtype: 'USER_RECEIVED_EVENTS',
    params: {
      username,
    },
  })

  const userEventsSubscription = createSubscriptionObjectWithId({
    type: 'activity',
    subtype: 'USER_EVENTS',
    params: {
      username,
    },
  })

  return [
    {
      column: {
        id: guid(),
        subscriptionIds: [notificationSubscription.id],
        type: 'notifications',
        filters: undefined,
      },
      subscriptions: [notificationSubscription],
    },
    {
      column: {
        id: guid(),
        subscriptionIds: [userReceivedEventsSubscription.id],
        type: 'activity',
        filters: undefined,
      },
      subscriptions: [userReceivedEventsSubscription],
    },
    {
      column: {
        id: guid(),
        subscriptionIds: [userEventsSubscription.id],
        type: 'activity',
        filters: undefined,
      },
      subscriptions: [userEventsSubscription],
    },
  ]
}

function* onLoginSuccess(
  action: ExtractActionFromActionCreator<typeof actions.loginSuccess>,
) {
  const username = action.payload.user.github.user.login
  const hasCreatedColumn = yield select(selectors.hasCreatedColumnSelector)
  if (!hasCreatedColumn)
    yield put(actions.replaceColumns(getDefaultColumns(username)))
}

function* onAddColumn(
  action: ExtractActionFromActionCreator<typeof actions.addColumn>,
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

export function* columnsSagas() {
  yield all([
    yield takeLatest('LOGIN_SUCCESS', onLoginSuccess),
    yield takeLatest('ADD_COLUMN', onAddColumn),
    yield takeLatest('MOVE_COLUMN', onMoveColumn),
  ])
}
