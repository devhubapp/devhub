// @flow
/* eslint-disable import/prefer-default-export */

import { Set } from 'immutable';

import { requestTypes } from '../api/github';
import { loadSubscriptionDataRequest } from './subscriptions';

import {
  ARCHIVE_EVENTS,
  DELETE_EVENTS,
  MARK_EVENTS_AS_READ,
  MARK_EVENTS_AS_UNREAD,
} from '../utils/constants/actions';

import { action } from '../utils/helpers/actions';

export const loadUserReceivedEvents = (username: string, other?: Object) =>
  loadSubscriptionDataRequest(
    requestTypes.USER_RECEIVED_EVENTS,
    { username },
    other,
  );

export const loadUserEvents = (username: string, other?: Object) =>
  loadSubscriptionDataRequest(requestTypes.USER_EVENTS, { username }, other);

export const loadUserOrgEvents = (
  username: string,
  org: string,
  other?: Object,
) =>
  loadSubscriptionDataRequest(
    requestTypes.USER_ORG_EVENTS,
    { username, org },
    other,
  );

export const loadRepoEvents = (owner: string, repo: string, other?: Object) =>
  loadSubscriptionDataRequest(requestTypes.REPO_EVENTS, { owner, repo }, other);

export const loadOrgEvents = (org: string, other?: Object) =>
  loadSubscriptionDataRequest(requestTypes.ORG_PUBLIC_EVENTS, { org }, other);

export type ReadEvents = { columnId: string, eventIds: Array<string> };
export const archiveEvents = (
  { columnId, eventIds }: ReadEvents,
  other?: Object,
) => action(ARCHIVE_EVENTS, { columnId, eventIds: Set(eventIds) }, other);

export const deleteEvents = (
  { columnId, eventIds }: ReadEvents,
  other?: Object,
) => action(DELETE_EVENTS, { columnId, eventIds: Set(eventIds) }, other);

export const markEventsAsRead = (
  { columnId, eventIds }: ReadEvents,
  other?: Object,
) => action(MARK_EVENTS_AS_READ, { columnId, eventIds: Set(eventIds) }, other);

export const markEventsAsUnread = (
  { columnId, eventIds }: ReadEvents,
  other?: Object,
) =>
  action(MARK_EVENTS_AS_UNREAD, { columnId, eventIds: Set(eventIds) }, other);
