import immer from 'immer'
import _ from 'lodash'

import {
  ActivityColumn,
  ActivityColumnFilters,
  Column,
  filterRecordHasAnyForcedValue,
  IssueOrPullRequestColumnFilters,
  normalizeColumns,
  normalizeSubscriptions,
  NotificationColumn,
  NotificationColumnFilters,
} from '@devhub/core'
import { Reducer } from '../types'

export interface State {
  allIds: string[]
  byId: Record<string, Column | undefined> | null
  updatedAt: string | null
}

const initialState: State = {
  allIds: [],
  byId: null,
  updatedAt: null,
}

export const columnsReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'ADD_COLUMN_AND_SUBSCRIPTIONS':
      return immer(state, draft => {
        draft.allIds = draft.allIds || []
        draft.byId = draft.byId || {}

        const subscriptionIds = normalizeSubscriptions(
          action.payload.subscriptions,
        ).allIds

        const normalized = normalizeColumns([
          {
            ...action.payload.column,
            subscriptionIds: _.uniq(
              (action.payload.column.subscriptionIds || []).concat(
                subscriptionIds,
              ),
            ),
          },
        ])

        if (!(normalized.allIds.length === 1)) return

        draft.allIds.push(normalized.allIds[0])

        _.merge(draft.byId, normalized.byId)

        draft.updatedAt = normalized.updatedAt
      })

    case 'ADD_COLUMN_SUBSCRIPTION':
      return immer(state, draft => {
        draft.allIds = draft.allIds || []
        draft.byId = draft.byId || {}

        if (!action.payload.columnId) return
        if (!(action.payload.subscription && action.payload.subscription.id))
          return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.subscriptionIds = _.uniq(
          column.subscriptionIds.concat(action.payload.subscription.id),
        )

        draft.updatedAt = new Date().toISOString()
      })

    case 'REMOVE_SUBSCRIPTION_FROM_COLUMN':
      return immer(state, draft => {
        draft.allIds = draft.allIds || []
        draft.byId = draft.byId || {}

        if (!action.payload.columnId) return
        if (!action.payload.subscriptionId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.subscriptionIds = column.subscriptionIds.filter(
          id => id !== action.payload.subscriptionId,
        )

        draft.updatedAt = new Date().toISOString()
      })

    case 'DELETE_COLUMN':
      return immer(state, draft => {
        if (draft.allIds)
          draft.allIds = draft.allIds.filter(
            id => id !== action.payload.columnId,
          )

        if (draft.byId) delete draft.byId[action.payload.columnId]

        draft.updatedAt = new Date().toISOString()
      })

    case 'DELETE_COLUMN_SUBSCRIPTIONS':
      return immer(state, draft => {
        if (!(draft.allIds && draft.byId)) return

        draft.allIds.forEach(columnId => {
          const column = draft.byId && draft.byId[columnId]
          if (!column) return

          column.subscriptionIds = column.subscriptionIds.filter(
            id => !action.payload.includes(id),
          )

          draft.updatedAt = new Date().toISOString()
        })
      })

    case 'MOVE_COLUMN':
      return immer(state, draft => {
        if (!draft.allIds) return

        const currentIndex = draft.allIds.findIndex(
          id => id === action.payload.columnId,
        )
        if (!(currentIndex >= 0 && currentIndex < draft.allIds.length)) return

        const newIndex = Math.max(
          0,
          Math.min(action.payload.columnIndex, draft.allIds.length - 1),
        )
        if (Number.isNaN(newIndex)) return

        // move column inside array
        const columnId = draft.allIds[currentIndex]
        draft.allIds = draft.allIds.filter(id => id !== columnId)
        draft.allIds.splice(newIndex, 0, columnId)

        draft.updatedAt = new Date().toISOString()
      })

    case 'REPLACE_COLUMNS_AND_SUBSCRIPTIONS':
      return immer(state, draft => {
        const normalized = normalizeColumns(
          action.payload.columns,
          action.payload.columnsUpdatedAt,
        )

        draft.allIds = normalized.allIds
        draft.byId = normalized.byId

        draft.updatedAt = normalized.updatedAt
      })

    case 'SET_COLUMN_OPTION': {
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        if (!action.payload.option) return

        column.options = column.options || {}
        if (typeof action.payload.value === 'boolean') {
          column.options[action.payload.option] = action.payload.value
        } else {
          delete column.options[action.payload.option]
        }

        draft.updatedAt = new Date().toISOString()
      })
    }

    case 'CLEAR_COLUMN_FILTERS':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        const previousFilters = column.filters || {}
        column.filters = {}

        // don't reset inbox filter
        if (column.type === 'notifications') {
          const _column = column as NotificationColumn
          const _previousFilters = previousFilters as NotificationColumnFilters

          if (
            _previousFilters.notifications &&
            _previousFilters.notifications.participating
          ) {
            _column.filters!.notifications =
              _column.filters!.notifications || {}
            _column.filters!.notifications.participating =
              _previousFilters.notifications.participating
          }
        }

        // // cannot delete some filters to avoid invalid search query
        // if (column.type === 'issue_or_pr') {
        //   const _column = column as IssueOrPullRequestColumn
        //   const _previousFilters = previousFilters as IssueOrPullRequestColumnFilters

        //   _column.filters!.involves = _previousFilters.involves

        //   if (
        //     !filterRecordWithThisValueCount(_column.filters!.involves, true)
        //   ) {
        //     _column.filters!.owners = _previousFilters.owners
        //   }
        // }

        draft.updatedAt = new Date().toISOString()
      })

    case 'REPLACE_COLUMN_FILTERS':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.filters = action.payload.filters || {}

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_SAVED_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.filters = column.filters || {}

        if (typeof action.payload.saved !== 'undefined') {
          column.filters.saved =
            typeof action.payload.saved === 'boolean'
              ? action.payload.saved
              : undefined
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_PARTICIPATING_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId] as NotificationColumn
        if (!column) return

        column.filters = column.filters || {}
        column.filters.notifications = column.filters.notifications || {}
        column.filters.notifications.participating =
          action.payload.participating

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_ACTIVITY_ACTION_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId] as ActivityColumn
        if (!column) return

        column.filters = column.filters || {}
        column.filters.activity = column.filters.activity || {}
        column.filters.activity.actions = column.filters.activity.actions || {}

        if (typeof action.payload.value === 'boolean') {
          column.filters.activity.actions[action.payload.type] =
            action.payload.value
        } else {
          delete column.filters.activity.actions[action.payload.type]
        }

        if (!filterRecordHasAnyForcedValue(column.filters.activity.actions)) {
          column.filters.activity.actions = {}
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_REASON_FILTER':
      return immer(state, draft => {
        const {
          columnId,
          reason,
          removeIfAlreadySet,
          removeOthers,
          value,
        } = action.payload

        if (!draft.byId) return

        const column = draft.byId[columnId] as NotificationColumn
        if (!column) return

        column.filters = column.filters || {}
        column.filters.notifications = column.filters.notifications || {}

        column.filters.notifications.reasons =
          column.filters.notifications.reasons || {}

        const currentValue = column.filters.notifications.reasons[reason]

        if (removeOthers) column.filters.notifications.reasons = {}

        if (
          typeof value !== 'boolean' ||
          (removeIfAlreadySet && currentValue === value)
        ) {
          delete column.filters.notifications.reasons[reason]
        } else {
          column.filters.notifications.reasons[reason] = value
        }

        if (
          !filterRecordHasAnyForcedValue(column.filters.notifications.reasons)
        ) {
          column.filters.notifications.reasons = {}
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_STATE_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.state = column.filters.state || {}

        if (action.payload.supportsOnlyOne) {
          column.filters.state = {}

          if (action.payload.value === true) {
            column.filters.state[action.payload.state] = action.payload.value
          }
        } else if (typeof action.payload.value === 'boolean') {
          column.filters.state[action.payload.state] = action.payload.value
        } else {
          delete column.filters.state[action.payload.state]
        }

        if (!filterRecordHasAnyForcedValue(column.filters.state)) {
          column.filters.state = {}
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_BOT_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.bot = action.payload.bot

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_DRAFT_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.draft = action.payload.draft

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_SUBJECT_TYPE_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.subjectTypes = column.filters.subjectTypes || {}

        if (typeof action.payload.value === 'boolean') {
          ;(column.filters.subjectTypes as any)[action.payload.subjectType] =
            action.payload.value
        } else {
          delete (column.filters.subjectTypes as any)[
            action.payload.subjectType
          ]
        }

        if (!filterRecordHasAnyForcedValue(column.filters.subjectTypes)) {
          column.filters.subjectTypes = {}
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_INVOLVES_FILTER':
      return immer(state, draft => {
        const { columnId, value } = action.payload

        const user = `${action.payload.user || ''}`.toLowerCase()

        if (!draft.byId) return

        const column = draft.byId[columnId]
        if (!column) return

        column.filters = column.filters || {}
        const filters = column.filters as IssueOrPullRequestColumnFilters

        filters.involves = filters.involves || {}
        filters.involves[user] = filters.involves[user] || undefined

        if (typeof value === 'boolean') {
          filters.involves[user] = value
        } else {
          filters.involves[user] = undefined
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'REPLACE_COLUMN_WATCHING_FILTER':
      return immer(state, draft => {
        const { columnId, owner: _owner } = action.payload

        const owner = `${_owner || ''}`.toLowerCase()

        if (!draft.byId) return

        const column = draft.byId[columnId]
        if (!(column && column.type === 'activity')) return

        column.filters = column.filters || {}
        const filters = column.filters as ActivityColumnFilters
        filters.watching = {}

        if (owner) filters.watching[owner] = true

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_WATCHING_FILTER':
      return immer(state, draft => {
        const { columnId, owner: _owner, value } = action.payload

        const owner = `${_owner || ''}`.toLowerCase()

        if (!draft.byId) return

        const column = draft.byId[columnId]
        if (!column) return

        column.filters = column.filters || {}
        const filters = column.filters as ActivityColumnFilters
        filters.watching = filters.watching || {}

        if (typeof value === 'boolean') {
          filters.watching[owner] = value
        } else {
          delete filters.watching[owner]
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'REPLACE_COLUMN_OWNER_FILTER':
      return immer(state, draft => {
        const { columnId, owner: _owner } = action.payload

        const owner = `${_owner || ''}`.toLowerCase()

        if (!draft.byId) return

        const column = draft.byId[columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.owners = {}

        if (owner) {
          column.filters.owners[owner] = {
            value: true,
            repos: {},
          }
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_OWNER_FILTER':
      return immer(state, draft => {
        const { columnId, owner: _owner, value } = action.payload

        const owner = `${_owner || ''}`.toLowerCase()

        if (!draft.byId) return

        const column = draft.byId[columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.owners = column.filters.owners || {}

        column.filters.owners[owner] = column.filters.owners[owner] || {
          value: undefined,
          repos: {},
        }

        if (typeof value === 'boolean') {
          column.filters.owners[owner]!.value = value
        } else {
          column.filters.owners[owner]!.value = undefined

          if (
            !filterRecordHasAnyForcedValue(column.filters.owners[owner]!.repos)
          ) {
            delete column.filters.owners[owner]
          }
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_REPO_FILTER':
      return immer(state, draft => {
        const { columnId, value } = action.payload

        const owner = `${action.payload.owner || ''}`.toLowerCase()
        const repo = `${action.payload.repo || ''}`.toLowerCase()

        if (!draft.byId) return

        const column = draft.byId[columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.owners = column.filters.owners || {}

        column.filters.owners[owner] = column.filters.owners[owner] || {
          value: undefined,
          repos: {},
        }
        column.filters.owners[owner]!.repos =
          column.filters.owners[owner]!.repos || {}

        if (typeof value === 'boolean') {
          column.filters.owners[owner]!.repos![repo] = value
        } else {
          delete column.filters.owners[owner]!.repos![repo]
        }

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_UNREAD_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId] as NotificationColumn
        if (!column) return

        column.filters = column.filters || {}
        column.filters.unread = action.payload.unread

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_PRIVACY_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.private = action.payload.private

        draft.updatedAt = new Date().toISOString()
      })

    case 'SET_COLUMN_CLEARED_AT_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const column = draft.byId[action.payload.columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.clearedAt =
          action.payload.clearedAt === null
            ? undefined
            : action.payload.clearedAt || new Date().toISOString()

        draft.updatedAt = new Date().toISOString()
      })

    case 'CHANGE_ISSUE_NUMBER_FILTER':
      return immer(state, draft => {
        if (!draft.byId) return

        const {
          columnId,
          issueNumber,
          removeIfAlreadySet,
          removeOthers,
          value,
        } = action.payload

        if (!(columnId && issueNumber)) return

        const column = draft.byId[columnId]
        if (!column) return

        column.filters = column.filters || {}
        column.filters.query = column.filters.query || ''

        draft.updatedAt = new Date().toISOString()

        if (
          column.filters.query.match(new RegExp(`-#(${issueNumber})(\s|$)`))
        ) {
          column.filters.query = column.filters.query.replace(
            new RegExp(`-#(${issueNumber})(\s|$)`),
            '',
          )
        } else if (
          column.filters.query.match(new RegExp(`#(${issueNumber})(\s|$)`))
        ) {
          column.filters.query = column.filters.query.replace(
            new RegExp(`#(${issueNumber})(\s|$)`),
            '',
          )
          if (removeIfAlreadySet) return
        }

        if (removeOthers) {
          column.filters.query = column.filters.query.replace(
            /[-]?#([0-9]+)(\s|$)/gi,
            '',
          )
        }

        if (typeof value !== 'boolean') return

        column.filters.query = `${column.filters.query.trim()} ${
          value === false ? '-' : ''
        }#${issueNumber}`.trim()
      })

    default:
      return state
  }
}
