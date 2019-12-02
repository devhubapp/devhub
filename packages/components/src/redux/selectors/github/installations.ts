import { Installation } from '@devhub/core'
import _ from 'lodash'
import { createSelector } from 'reselect'

import { EMPTY_ARRAY, EMPTY_OBJ } from '../../../utils/constants'
import { RootState } from '../../types'

const s = (state: RootState) =>
  (state.github && state.github.installations) || EMPTY_OBJ

export const installationIdsSelector = (state: RootState) =>
  s(state).allIds || EMPTY_ARRAY

export const installationOwnerNamesSelector = (state: RootState) =>
  s(state).allOwnerNames || EMPTY_ARRAY

export const installationsLastFetchedRequestAtSelector = (state: RootState) =>
  s(state).lastFetchedAt

export const installationsLastFetchedSuccessfullyAtSelector = (
  state: RootState,
) => s(state).lastFetchedSuccessfullyAt

export const installationsLoadStateSelector = (state: RootState) =>
  s(state).loadState

export const installationSelector = (state: RootState, id: number) =>
  s(state).byId && s(state).byId![id]

export const installationsArrSelector = createSelector(
  (state: RootState) => installationIdsSelector(state),
  (state: RootState) => s(state).byId,
  (ids, byId) =>
    (byId && ids
      ? ids.map(id => byId[id]).filter(Boolean)
      : EMPTY_ARRAY) as Installation[],
)

export const installationByOwnerSelector = createSelector(
  (state: RootState) => s(state).byId,
  (state: RootState) => s(state).byOwnerName,
  (_state: RootState, ownerName: string | undefined) => ownerName,
  (byId, byOwnerName, _ownerName) => {
    const ownerName = `${_ownerName || ''}`.trim().toLowerCase()
    const installationId = ownerName && byOwnerName[ownerName]

    return (installationId && byId[installationId]) || undefined
  },
)

/*
export const installationByRepoSelector = createSelector(
  (state: RootState) => s(state).byId,
  (state: RootState) => s(state).byRepoFullName,
  (
    _state: RootState,
    ownerName: string | undefined,
    _repoName: string | undefined,
  ) => ownerName,
  (
    _state: RootState,
    _ownerName: string | undefined,
    repoName: string | undefined,
  ) => repoName,
  (byId, byRepoFullName, _ownerName, _repoName) => {
    const ownerName = normalizeUsername(_ownerName)
    const repoName = normalizeUsername(_repoName)
    const fullName = ownerName && repoName && `${ownerName}/${repoName}`
    const installationId = fullName && byRepoFullName[fullName]

    return (installationId && byId[installationId]) || undefined
  },
)
*/

export const installationTokenByOwnerSelector = (
  state: RootState,
  ownerName: string | undefined,
) => {
  const installation = installationByOwnerSelector(state, ownerName)

  const tokenDetails = installation && installation.tokenDetails
  return (tokenDetails && tokenDetails.token) || undefined
}

export const installationTokenByRepoSelector = (
  state: RootState,
  ownerName: string | undefined,
  _repoName: string | undefined,
) => {
  return installationTokenByOwnerSelector(state, ownerName)
}
