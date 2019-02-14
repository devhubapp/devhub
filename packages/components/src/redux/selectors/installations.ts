import { createSelector } from 'reselect'

import { normalizeUsername } from '@devhub/core'
import { RootState } from '../types'

const s = (state: RootState) => state.installations || {}

export const installationIdsSelector = (state: RootState) =>
  s(state).allIds || []

export const installationsLoadStateSelector = (state: RootState) =>
  s(state).loadState

export const installationSelector = createSelector(
  (state: RootState) => s(state).byId,
  (_state: RootState, id: number) => id,
  (byId, id) => byId[id],
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
  repoName: string | undefined,
) => {
  const installation = installationByRepoSelector(state, ownerName, repoName)

  const tokenDetails = installation && installation.tokenDetails
  return (tokenDetails && tokenDetails.token) || undefined
}

export const githubHasPrivateAccessToOwnerSelector = (
  state: RootState,
  ownerName: string | undefined,
) => {
  return !!installationTokenByOwnerSelector(state, ownerName)
}

export const githubHasPrivateAccessToRepoSelector = (
  state: RootState,
  ownerName: string | undefined,
  repoName: string | undefined,
) => {
  return !!installationTokenByRepoSelector(state, ownerName, repoName)
}
