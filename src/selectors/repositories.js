// @flow
/*  eslint-disable import/prefer-default-export */

import {
  createImmutableSelector,
  createImmutableSelectorCreator,
  entitiesSelector,
  isReadFilter,
} from './shared'

export const repoIdSelector = (state, { repoId }) => repoId
export const reposEntitiesSelector = state =>
  entitiesSelector(state).get('repos')

export const starredReposSelector = createImmutableSelector(
  reposEntitiesSelector,
  repos =>
    repos
      .filter(Boolean)
      .filter(isReadFilter)
      .map(repo => repo.get('id'))
      .toList(),
)

export const makeRepoSelector = () =>
  createImmutableSelectorCreator(
    1,
  )(repoIdSelector, reposEntitiesSelector, (repoId, repos) =>
    repos.get(`${repoId}`),
  )

export const makeIsRepoStarredSelector = () =>
  createImmutableSelector(
    repoIdSelector,
    starredReposSelector,
    (repoId, starredRepos) => starredRepos.includes(repoId),
  )
