// @flow
/* eslint-disable import/prefer-default-export */

import { requestTypes } from '../api/github';
import { loadSubscriptionDataRequest } from './subscriptions';

export const loadUserReceivedEvents = (username: string, other?: Object) => (
  loadSubscriptionDataRequest(requestTypes.USER_RECEIVED_EVENTS, { username }, other)
);

export const loadUserEvents = (username: string, other?: Object) => (
  loadSubscriptionDataRequest(requestTypes.USER_EVENTS, { username }, other)
);

export const loadUserOrgEvents = (username: string, org: string, other?: Object) => (
  loadSubscriptionDataRequest(requestTypes.USER_ORG_EVENTS, { username, org }, other)
);

export const loadRepoEvents = (owner: string, repo: string, other?: Object) => (
  loadSubscriptionDataRequest(requestTypes.REPO_EVENTS, { owner, repo }, other)
);

export const loadOrgEvents = (org: string, other?: Object) => (
  loadSubscriptionDataRequest(requestTypes.ORG_PUBLIC_EVENTS, { org }, other)
);
