// @flow
/*  eslint-disable import/prefer-default-export */

import { createImmutableSelector, entitiesSelector } from './shared';

export const repoIdSelector = (state, { repoId }) => repoId;
export const reposEntitiesSelector = state => entitiesSelector(state).get('repos');
export const starredReposSelector = state => state.get('starredRepos');

export const repoSelector = createImmutableSelector(
  repoIdSelector,
  reposEntitiesSelector,
  (repoId, repos) => repos.get(`${repoId}`),
);

export const makeIsRepoStarredSelector = () => createImmutableSelector(
  repoIdSelector,
  starredReposSelector,
  (repoId, starredRepos) => starredRepos.includes(repoId),
);
