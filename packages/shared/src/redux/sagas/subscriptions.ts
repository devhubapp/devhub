import _ from 'lodash'
import { all, put, select, takeLatest } from 'redux-saga/effects'

import { Column } from '../../types'
import * as actions from '../actions'
import * as selectors from '../selectors'

function* cleanupSubscriptions() {
  const allSubscriptionIds: string[] = yield select(
    selectors.subscriptionIdsSelector,
  )
  if (!(allSubscriptionIds && allSubscriptionIds.length)) return

  const columns: Column[] | null = yield select(selectors.columnsArrSelector)
  if (!(columns && columns.length)) return

  const usedSubscriptionIds = _.uniq(
    columns
      .reduce(
        (result, column) => result.concat(column.subscriptionIds),
        [] as string[],
      )
      .filter(Boolean),
  )

  const unusedSubscriptionIds = _.difference(
    allSubscriptionIds,
    usedSubscriptionIds,
  )

  yield all(
    unusedSubscriptionIds.map(subscriptionId =>
      put(actions.deleteColumnSubscription(subscriptionId)),
    ),
  )
}

export function* subscriptionsSagas() {
  yield all([
    yield takeLatest('ADD_COLUMN', cleanupSubscriptions),
    yield takeLatest('DELETE_COLUMN', cleanupSubscriptions),
    yield takeLatest('REPLACE_COLUMNS', cleanupSubscriptions),
  ])
}
