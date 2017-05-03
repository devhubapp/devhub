// @flow

moment().toISOString()
import moment from 'moment'
import { fromJS, List, Map } from 'immutable'

import { guid } from '../../utils/helpers'

import { CREATE_COLUMN, DELETE_COLUMN } from '../../utils/constants/actions'

import type { Action, Column, Normalized } from '../../utils/types'

type State = Normalized<Column>
const initialState = Map()

export default (
  state: State = initialState,
  { type, payload }: ?Action<any> = {},
): State => {
  switch (type) {
    case CREATE_COLUMN:
      return (({ order, subscriptionIds, title, ...restOfPayload }: Column) => {
        const id = guid()

        let newState = state

        // shift columns to right to insert new column in the right order
        if (order >= 0) {
          newState = newState.map(column => {
            if (column.get('order') >= order) {
              return column.set('order', column.get('order') + 1)
            }

            return column
          })
        }

        return newState.set(
          id,
          fromJS({
            id,
            title,
            order,
            subscriptions: List(subscriptionIds),
            createdAt: moment().toISOString(),
            ...restOfPayload,
          }),
        )
      })(payload)

    case DELETE_COLUMN:
      // TODO: Delete subscription and its events
      return (({ id }: Column) => {
        if (!id) return state

        const columnToDelete = state.get(id)
        if (!columnToDelete) return state

        let newState = state

        const order = columnToDelete.get('order')
        // shift columns to left to fix order value
        if (order >= 0) {
          newState = newState.map(column => {
            if (column.get('order') >= order && column !== columnToDelete) {
              return column.set('order', column.get('order') - 1)
            }

            return column
          })
        }

        return newState.delete(id)
      })(payload)

    default:
      return state
  }
}
