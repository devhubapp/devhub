import { all, put, select, takeLatest } from 'redux-saga/effects'

import { delay } from 'redux-saga'
import { emitter } from '../../setup'
import { Column, ExtractActionFromActionCreator } from '../../types'
import { guid } from '../../utils/helpers/shared'
import * as actions from '../actions'
import * as selectors from '../selectors'

function getDefaultColumns(username: string): Column[] {
  return [
    {
      id: guid(),
      type: 'notifications',
      params: {
        all: true,
      },
    },
    {
      id: guid(),
      type: 'activity',
      subtype: 'USER_RECEIVED_EVENTS',
      params: {
        username,
      },
    },
    {
      id: guid(),
      type: 'activity',
      subtype: 'USER_EVENTS',
      params: {
        username,
      },
    },
  ]
}

function* onLoginSuccess(
  action: ExtractActionFromActionCreator<typeof actions.loginSuccess>,
) {
  const username = action.payload.login
  const columns = yield select(selectors.columnsSelector)
  if (!columns) yield put(actions.replaceColumns(getDefaultColumns(username)))
}

function* onAddColumn(
  action: ExtractActionFromActionCreator<typeof actions.addColumn>,
) {
  const columnId = action.payload.id

  const columns: Column[] | undefined = yield select(selectors.columnsSelector)
  const columnIndex = columns && columns.findIndex(c => c.id === columnId)

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
  const columns: Column[] | undefined = yield select(selectors.columnsSelector)
  if (!columns) return

  const columnIndex = Math.max(
    0,
    Math.min(action.payload.index, columns.length - 1),
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
