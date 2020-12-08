import immer from 'immer'
import { REHYDRATE } from 'redux-persist'

import { Installation, LoadState, normalizeInstallations } from '@devhub/core'
import { Reducer } from '../../types'

export interface State {
  allIds: number[]
  allOwnerNames: string[]
  // allRepoFullNames: string[]
  byId: Record<number, Installation | undefined>
  byOwnerName: Record<string, number>
  // byRepoFullName: Record<string, number>

  error?: string | null
  lastFetchFailureAt: string | null
  lastFetchRequestAt: string | null
  lastFetchSuccessAt: string | null
  loadState: LoadState
  updatedAt: string | null
}

const initialState: State = {
  allIds: [],
  allOwnerNames: [],
  // allRepoFullNames: [],
  byId: {},
  byOwnerName: {},
  // byRepoFullName: {},

  error: null,
  lastFetchFailureAt: null,
  lastFetchRequestAt: null,
  lastFetchSuccessAt: null,
  loadState: 'not_loaded',
  updatedAt: null,
}

export const githubInstallationsReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case REHYDRATE as any: {
      return {
        ...initialState,
        ...(action as any).payload?.github?.installations,
      }
    }

    case 'REFRESH_INSTALLATIONS_REQUEST':
      return immer(state, (draft) => {
        draft.lastFetchRequestAt = new Date().toISOString()
        draft.loadState = 'loading'
      })

    case 'REFRESH_INSTALLATIONS_SUCCESS':
      return immer(state, (draft) => {
        draft.error = null
        draft.lastFetchSuccessAt = new Date().toISOString()
        draft.loadState = 'loaded'
        draft.updatedAt = new Date().toISOString()

        const installations = action.payload
        if (!installations) return

        const {
          allIds,
          allOwnerNames,
          // allRepoFullNames,
          byId,
          byOwnerName,
          // byRepoFullName,
        } = normalizeInstallations(installations)

        draft.allIds = allIds
        draft.allOwnerNames = allOwnerNames
        // draft.allRepoFullNames = allRepoFullNames
        draft.byId = byId
        draft.byOwnerName = byOwnerName

        // if (allRepoFullNames.length || !allIds.length) {
        //   draft.allRepoFullNames = allRepoFullNames
        //   draft.byRepoFullName = byRepoFullName
        // }
      })

    case 'REFRESH_INSTALLATIONS_NOOP':
      return immer(state, (draft) => {
        if (draft.loadState === 'loading') draft.loadState = 'loaded'
      })

    case 'REFRESH_INSTALLATIONS_FAILURE':
      return immer(state, (draft) => {
        draft.lastFetchFailureAt = new Date().toISOString()
        draft.error = `${
          (action.error && action.error.message) || action.error
        }`
        draft.loadState = 'error'
      })

    default:
      return state
  }
}
