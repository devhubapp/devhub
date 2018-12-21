import axios, { AxiosResponse } from 'axios'
import _ from 'lodash'
import { all, fork, put, select, take, takeLatest } from 'redux-saga/effects'

import {
  constants,
  jsonToGraphQLQuery,
  removeUndefinedFields,
  User,
} from '@devhub/core'
import { bugsnag } from '../../libs/bugsnag'
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

    yield put(actions.syncUp())
  }
}

// Note: Lodash debounce was not working as expected with generators
// so we now use normal async/await in the sync functions
function* onSyncUp() {
  const state: RootState = yield select()
  debounceSyncUp(state)
}

function* onSyncDown() {
  const state: RootState = yield select()

  const appToken = selectors.appTokenSelector(state)
  if (!appToken) return

  try {
    const response: AxiosResponse<{
      data: {
        me?: {
          columns?: User['columns']
          subscriptions: User['subscriptions']
        }
      }
      errors?: any[]
    }> = yield axios.post(
      constants.GRAPHQL_ENDPOINT,
      {
        query: jsonToGraphQLQuery({
          query: {
            me: {
              columns: true,
              subscriptions: true,
            },
          },
        }),
      },
      {
        headers: { Authorization: `bearer ${appToken}` },
      },
    )

    const { data, errors } = response.data

    if (errors && errors.length) {
      throw Object.assign(new Error('GraphQL Error'), { response })
    }

    if (!(data && data.me && data.me.columns && data.me.subscriptions)) {
      throw Object.assign(new Error('GraphQL Error'), { response })
    }

    const { columns, subscriptions } = data.me

    const serverDataIsNewer =
      (columns.updatedAt &&
        (!state.columns.updatedAt ||
          columns.updatedAt > state.columns.updatedAt)) ||
      (subscriptions.updatedAt &&
        (!state.subscriptions.updatedAt ||
          subscriptions.updatedAt > state.subscriptions.updatedAt))

    if (serverDataIsNewer) {
      yield put(
        actions.replaceColumnsAndSubscriptions({
          columns: columns.allIds.map(id => columns.byId[id]!).filter(Boolean),
          subscriptions: subscriptions.allIds
            .map(id => ({
              ...subscriptions.byId[id]!,
              data: {
                ...(state.subscriptions.byId[id] &&
                  state.subscriptions.byId[id]!.data),
                ...(((subscriptions.byId[id] && subscriptions.byId[id]!.data) ||
                  {}) as any),
              },
            }))
            .filter(Boolean),
          columnsUpdatedAt: columns.updatedAt,
          subscriptionsUpdatedAt: columns.updatedAt,
        }),
      )
    }
  } catch (error) {
    const description = 'Sync down failed'
    bugsnag.notify(error, { description })
    console.error(description, error)
  }
}

// Note: Lodash debounce was not working as expected with generators
async function syncUp(state: RootState) {
  const appToken = selectors.appTokenSelector(state)
  if (!appToken) return

  const columns = selectors.columnsArrSelector(state)
  const subscriptions = selectors.subscriptionsArrSelector(state)

  try {
    // TODO: Auto generate these typings
    const response: AxiosResponse<{
      replaceColumnsAndSubscriptions: boolean
      errors?: any[]
    }> = await axios.post(
      constants.GRAPHQL_ENDPOINT,
      {
        // TODO: do it the right way ffs
        query: jsonToGraphQLQuery({
          mutation: {
            replaceColumnsAndSubscriptions: {
              __args: {
                columns: columns
                  .filter(Boolean)
                  .map(c => removeUndefinedFields(c!)),
                subscriptions: subscriptions
                  .filter(Boolean)
                  .map(s => _.omit(removeUndefinedFields(s!), 'data')),
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
      throw Object.assign(new Error('GraphQL Error'), { response })
    }
  } catch (error) {
    console.error('Sync up failed', error)
  }
}

const debounceSyncUp = _.debounce(syncUp, 5000, {
  leading: true,
  maxWait: 30000,
  trailing: true,
})

function* onLoginSuccess(
  action: ExtractActionFromActionCreator<typeof actions.loginSuccess>,
) {
  const state: RootState = yield select()

  const { columns, subscriptions } = action.payload.user
  const username = action.payload.user.github.user.login

  const clientDataIsNewer =
    !columns ||
    !columns.updatedAt ||
    !state.columns.updatedAt ||
    state.columns.updatedAt > columns.updatedAt ||
    !subscriptions ||
    !subscriptions.updatedAt ||
    !state.subscriptions.updatedAt ||
    state.subscriptions.updatedAt > subscriptions.updatedAt

  if (
    columns &&
    columns.allIds &&
    columns.byId &&
    subscriptions &&
    subscriptions.allIds &&
    subscriptions.byId
  ) {
    const serverDataIsNewer =
      (columns.updatedAt &&
        (!state.columns.updatedAt ||
          columns.updatedAt > state.columns.updatedAt)) ||
      (subscriptions.updatedAt &&
        (!state.subscriptions.updatedAt ||
          subscriptions.updatedAt > state.subscriptions.updatedAt))

    if (serverDataIsNewer) {
      yield put(
        actions.replaceColumnsAndSubscriptions({
          columns: columns.allIds.map(id => columns.byId[id]!).filter(Boolean),
          subscriptions: subscriptions.allIds
            .map(id => ({
              ...subscriptions.byId[id]!,
              data: {
                ...(state.subscriptions.byId[id] &&
                  state.subscriptions.byId[id]!.data),
                ...(((subscriptions.byId[id] && subscriptions.byId[id]!.data) ||
                  {}) as any),
              },
            }))
            .filter(Boolean),
          columnsUpdatedAt: columns.updatedAt,
          subscriptionsUpdatedAt: columns.updatedAt,
        }),
      )
    } else if (clientDataIsNewer) {
      yield put(actions.syncUp())
    }
  } else {
    const hasCreatedColumn = yield select(selectors.hasCreatedColumnSelector)
    if (!hasCreatedColumn) {
      yield put(
        actions.replaceColumnsAndSubscriptions(getDefaultColumns(username)),
      )
    } else if (clientDataIsNewer) {
      yield put(actions.syncUp())
    }
  }
}

export function* apiSagas() {
  yield all([
    yield fork(init),
    yield takeLatest('LOGIN_SUCCESS', onLoginSuccess),
    yield takeLatest('SYNC_DOWN', onSyncDown),
    yield takeLatest('SYNC_UP', onSyncUp),
  ])
}
