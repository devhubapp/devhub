import immer from 'immer'
import _ from 'lodash'

import {
  Installation,
  LoadState,
  normalizeInstallationConnections,
} from '@devhub/core'
import { Reducer } from '../../types'

export interface State {
  allIds: number[]
  byId: Record<number, Installation>

  allOwnerNames: string[]
  byOwnerName: Record<string, number>

  allRepoFullNames: string[]
  byRepoFullName: Record<string, number>

  error?: string | null
  lastFetchedAt: string | null
  loadState: LoadState
  totalInstallationCount: number
}

const initialState: State = {
  allIds: [],
  byId: {},

  allOwnerNames: [],
  byOwnerName: {},

  allRepoFullNames: [],
  byRepoFullName: {},

  error: null,
  lastFetchedAt: null,
  loadState: 'not_loaded',
  totalInstallationCount: 0,
}

export const githubInstallationsReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'FETCH_INSTALLATIONS_REQUEST':
      return immer(state, draft => {
        draft.lastFetchedAt = new Date().toISOString()
        draft.loadState = 'loading'
      })

    case 'FETCH_INSTALLATIONS_SUCCESS':
      return immer(state, draft => {
        draft.error = null
        draft.loadState = 'loaded'

        const { nodes, totalCount } = action.payload

        if (nodes) {
          const {
            allIds,
            allOwnerNames,
            allRepoFullNames,
            byId,
            byOwnerName,
            byRepoFullName,
          } = normalizeInstallationConnections(nodes)

          draft.totalInstallationCount = totalCount || 0

          draft.allIds = allIds
          draft.allOwnerNames = allOwnerNames
          draft.allRepoFullNames = allRepoFullNames
          draft.byId = byId
          draft.byOwnerName = byOwnerName

          if (allRepoFullNames.length || !allIds.length) {
            draft.allRepoFullNames = allRepoFullNames
            draft.byRepoFullName = byRepoFullName
          }
        }
      })

    case 'FETCH_INSTALLATIONS_FAILURE':
      return immer(state, draft => {
        draft.error = `${(action.error && action.error.message) ||
          action.error}`
        draft.loadState = 'error'
      })

    default:
      return state
  }
}
