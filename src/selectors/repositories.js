// @flow
/*  eslint-disable import/prefer-default-export */

import { createImmutableSelector } from './shared';

export const repoIdSelector = (state, { repoId }) => repoId;
export const starredReposSelector = state => state.get('starredRepos');

export const makeIsRepoStarredSelector = () => createImmutableSelector(
  repoIdSelector,
  starredReposSelector,
  (repoId, starredRepos) => starredRepos.includes(repoId),
);
