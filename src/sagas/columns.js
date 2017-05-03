// @flow

import { put, takeLatest } from 'redux-saga/effects'

import { DELETE_COLUMN } from '../utils/constants/actions'
import { cleanupApp } from '../actions'
import { sagaActionChunk } from './_shared'

export function* onDeleteColumn() {
  yield put(cleanupApp(sagaActionChunk))
}

export default function*() {
  return yield [yield takeLatest(DELETE_COLUMN, onDeleteColumn)]
}
