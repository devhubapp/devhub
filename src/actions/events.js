// @flow
/* eslint-disable import/prefer-default-export */

import { Set } from 'immutable';

import { requestTypes } from '../api/github';
import { loadSubscriptionDataRequest } from './subscriptions';

import {
  CLEAR_EVENTS,
  MARK_EVENTS_AS_SEEN,
  MARK_EVENTS_AS_NOT_SEEN,
  TOGGLE_EVENTS_SEEN_STATUS,
} from '../utils/constants/actions';

import { action } from '../utils/helpers/actions';

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

export const toggleEventsSeenStatus = (
  { eventIds }: { eventIds: Array<string> },
  other?: Object,
) => (
  action(TOGGLE_EVENTS_SEEN_STATUS, { eventIds: Set(eventIds) }, other)
);

export type SeenEvents = { columnId: string, eventIds: Array<string> };
export const clearEvents = ({ columnId, eventIds }: SeenEvents, other?: Object) => (
  action(CLEAR_EVENTS, { columnId, eventIds: Set(eventIds) }, other)
);

export const markEventsAsSeen = ({ columnId, eventIds }: SeenEvents, other?: Object) => (
  action(MARK_EVENTS_AS_SEEN, { columnId, eventIds: Set(eventIds) }, other)
);

export const markEventsAsUnseen = ({ columnId, eventIds }: SeenEvents, other?: Object) => (
  action(MARK_EVENTS_AS_NOT_SEEN, { columnId, eventIds: Set(eventIds) }, other)
);
