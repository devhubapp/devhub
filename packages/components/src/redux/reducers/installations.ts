import immer from 'immer'
import _ from 'lodash'

import { Installation, LoadState } from '@devhub/core'
import { normalizeUsername } from '../../utils/helpers/github/shared'
import { Reducer } from '../types'

export interface State {
  allIds: number[]
  byId: Record<number, Installation>

  allOwnerNames: string[]
  byOwnerName: Record<string, number>

  allRepoFulNames: string[]
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

  allRepoFulNames: [],
  byRepoFullName: {},

  error: null,
  lastFetchedAt: null,
  loadState: 'not_loaded',
  totalInstallationCount: 0,
}

export const installationsReducer: Reducer<State> = (
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
          draft.allIds = []
          draft.byId = {}

          draft.allOwnerNames = []
          draft.byOwnerName = {}

          const allRepoFulNames: State['allRepoFulNames'] = []
          const byRepoFullName: State['byRepoFullName'] = {}

          draft.totalInstallationCount = totalCount || 0

          nodes.forEach(installation => {
            if (!(installation && installation.id)) return

            draft.allIds.push(installation.id)
            draft.byId[installation.id] = installation

            const ownerName = normalizeUsername(
              (installation.account && installation.account.login) || undefined,
            )
            if (ownerName) {
              draft.allOwnerNames.push(ownerName)
              draft.byOwnerName[ownerName] = installation.id
            }

            const repos =
              installation.repositoriesConnection &&
              installation.repositoriesConnection.nodes

            if (repos) {
              repos.forEach(repo => {
                if (!(repo && repo.repoName)) return

                const _ownerName = normalizeUsername(
                  repo.ownerName || undefined,
                )
                if (_ownerName) {
                  draft.allOwnerNames.push(_ownerName)
                  draft.byOwnerName[_ownerName] = installation.id!
                }

                const repoName = `${repo.repoName}`.trim().toLowerCase()
                if (repoName) {
                  const repoFullName = `${_ownerName}/${repoName}`
                  allRepoFulNames.push(repoFullName)
                  byRepoFullName[repoFullName] = installation.id!
                }
              })
            }
          })

          if (allRepoFulNames.length) {
            draft.allRepoFulNames = allRepoFulNames
            draft.byRepoFullName = byRepoFullName
          }

          draft.allIds = _.uniq(draft.allIds)
          draft.allOwnerNames = _.uniq(draft.allOwnerNames)
          draft.allRepoFulNames = _.uniq(draft.allRepoFulNames)
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
