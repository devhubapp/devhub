import axios, { AxiosResponse } from 'axios'
import _ from 'lodash'
import { all, fork, put, select, take, takeLatest } from 'redux-saga/effects'

import {
  GRAPHQL_ENDPOINT,
  jsonToGraphQLQuery,
  removeUndefinedFields,
} from '@devhub/core'
import { bugsnagClient } from '../../setup'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { RootState } from '../types'
import { ExtractActionFromActionCreator } from '../types/base'
import { getDefaultColumns } from './columns'

function* init() {
  let _prevColumnsUpdatedAt: string | null = null
  let _prevSubscriptionUpdatedAt: string | null = null

  yield take('LOGIN_SUCCESS')

  while (true) {
    yield take('*')

    const state: RootState = yield select()

    const appToken = selectors.appTokenSelector(state)
    if (!appToken) continue

    const prevColumnsUpdatedAt = _prevColumnsUpdatedAt
    _prevColumnsUpdatedAt = state.columns.updatedAt

    const prevSubscriptionUpdatedAt = _prevSubscriptionUpdatedAt
    _prevSubscriptionUpdatedAt = state.subscriptions.updatedAt

    if (
      !(
        (prevColumnsUpdatedAt &&
          state.columns.updatedAt &&
          state.columns.updatedAt > prevColumnsUpdatedAt) ||
        (prevSubscriptionUpdatedAt &&
          state.subscriptions.updatedAt &&
          state.subscriptions.updatedAt > prevSubscriptionUpdatedAt)
      )
    )
      continue

    debounceSync(state)
  }
}

// Note: Lodash debounce was not working as expected with generators
async function sync(state: RootState) {
  const appToken = selectors.appTokenSelector(state)
  if (!appToken) return

  const columns = selectors.columnsArrSelector(state)
  const subscriptions = selectors.subscriptionsArrSelector(state)

  try {
    // TODO: Auto generate these typings
    const response: AxiosResponse = await axios.post(
      GRAPHQL_ENDPOINT,
      {
        // TODO: do it the right way ffs
        query: jsonToGraphQLQuery({
          mutation: {
            replaceColumnsAndSubscriptions: {
              __args: {
                columns: columns.map(removeUndefinedFields),
                subscriptions: subscriptions.map(s =>
                  _.omit(removeUndefinedFields(s), 'data'),
                ),
                columnsUpdatedAt:
                  state.columns.updatedAt || new Date().toISOString(),
                subscriptionsUpdatedAt:
                  state.subscriptions.updatedAt || new Date().toISOString(),
              },
            },
          },
        }),
      },
      {
        headers: { Authorization: `bearer ${appToken}` },
      },
    )

    const { errors } = response.data

    if (errors && errors.length) {
      throw { response }
    }
  } catch (error) {
    console.error(error.response)
    bugsnagClient.notify(error)
  }
}

const debounceSync = _.debounce(sync, 5000, {
  leading: true,
  maxWait: 30000,
  trailing: true,
})

function* onLoginSuccess(
  action: ExtractActionFromActionCreator<typeof actions.loginSuccess>,
) {
  const { columns, subscriptions } = action.payload.user
  const username = action.payload.user.github.user.login

  if (
    columns &&
    columns.allIds &&
    columns.byId &&
    subscriptions &&
    subscriptions.allIds &&
    subscriptions.byId
  ) {
    const state: RootState = yield select()

    const serverDataIsNewer =
      (columns.updatedAt &&
        state.columns.updatedAt &&
        columns.updatedAt > state.columns.updatedAt) ||
      (subscriptions.updatedAt &&
        state.subscriptions.updatedAt &&
        subscriptions.updatedAt > state.subscriptions.updatedAt)

    if (serverDataIsNewer) {
      yield put(
        actions.replaceColumnsAndSubscriptions({
          columns: columns.allIds.map(id => columns.byId[id]),
          subscriptions: subscriptions.allIds.map(id => ({
            ...subscriptions.byId[id],
            data: {
              ...state.subscriptions.byId[id].data,
              ...((subscriptions.byId[id].data || {}) as any),
            },
          })),
          columnsUpdatedAt: columns.updatedAt,
          subscriptionsUpdatedAt: columns.updatedAt,
        }),
      )
    }
  } else {
    const hasCreatedColumn = yield select(selectors.hasCreatedColumnSelector)
    if (!hasCreatedColumn)
      yield put(
        actions.replaceColumnsAndSubscriptions(getDefaultColumns(username)),
      )
  }
}

export function* apiSagas() {
  yield all([
    yield fork(init),
    yield takeLatest('LOGIN_SUCCESS', onLoginSuccess),
  ])
}
