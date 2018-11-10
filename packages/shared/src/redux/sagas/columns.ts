import { all, put, select, takeLatest } from 'redux-saga/effects'

import { delay } from 'redux-saga'
import { emitter } from '../../setup'
import {
  ColumnAndSubscriptions,
  ExtractActionFromActionCreator,
} from '../../types'
import { guid } from '../../utils/helpers/shared'
import * as actions from '../actions'
import * as selectors from '../selectors'

function getDefaultColumns(username: string): ColumnAndSubscriptions[] {
  const id1 = guid()
  const id2 = guid()
  const id3 = guid()

  return [
    {
      column: {
        id: guid(),
        subscriptionIds: [id1],
        type: 'notifications',
      },
      subscriptions: [
        {
          id: id1,
          type: 'notifications',
          subtype: undefined,
          params: {
            all: true,
          },
        },
      ],
    },
    {
      column: {
        id: guid(),
        subscriptionIds: [id2],
        type: 'activity',
      },
      subscriptions: [
        {
          id: id2,
          type: 'activity',
          subtype: 'USER_RECEIVED_EVENTS',
          params: {
            username,
          },
        },
      ],
    },
    {
      column: {
        id: guid(),
        subscriptionIds: [id3],
        type: 'activity',
      },
      subscriptions: [
        {
          id: id3,
          type: 'activity',
          subtype: 'USER_EVENTS',
          params: {
            username,
          },
        },
      ],
    },
  ]
}

function* onLoginSuccess(
  action: ExtractActionFromActionCreator<typeof actions.loginSuccess>,
) {
  const username = action.payload.login
  const hasCreatedColumn = yield select(selectors.hasCreatedColumnSelector)
  if (!hasCreatedColumn)
    yield put(actions.replaceColumns(getDefaultColumns(username)))
}

function* onAddColumn(
  action: ExtractActionFromActionCreator<typeof actions.addColumn>,
) {
  const columnId = action.payload.column.id

  const ids: string[] = yield select(selectors.columnIdsSelector)
  const columnIndex = ids.findIndex(id => id === columnId)

  yield delay(300)
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
    Math.min(action.payload.index, ids.length - 1),
  )
  if (Number.isNaN(columnIndex)) return

  emitter.emit('FOCUS_ON_COLUMN', {
    animated: true,
    columnId: action.payload.id,
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
