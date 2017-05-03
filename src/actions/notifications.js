// @flow
/* eslint-disable import/prefer-default-export */

import moment from 'moment'

import {
  ARCHIVE_NOTIFICATIONS,
  DELETE_NOTIFICATIONS,
  LOAD_NOTIFICATIONS_REQUEST,
  LOAD_NOTIFICATIONS_SUCCESS,
  LOAD_NOTIFICATIONS_FAILURE,
  MARK_NOTIFICATIONS_AS_READ_REQUEST,
  MARK_NOTIFICATIONS_AS_READ_FAILURE,
  MARK_NOTIFICATIONS_AS_READ_SUCCESS,
  MARK_NOTIFICATIONS_AS_UNREAD,
  UPDATE_NOTIFICATIONS,
} from '../utils/constants/actions'

import { requestTypes } from '../api/github'
import { action, errorAction } from '../utils/helpers/actions'
import type {
  ApiRequestPayload,
  ApiResponsePayload,
  NotificationsOptions,
} from '../utils/types'

export const loadNotificationsRequest = (
  params: NotificationsOptions,
  other?: Object,
) =>
  action(
    LOAD_NOTIFICATIONS_REQUEST,
    ({
      params: params || {},
      requestType: requestTypes.NOTIFICATIONS,
    }: ApiRequestPayload),
    other,
  )

export const updateNotifications = (params?: Object, other?: Object) =>
  action(UPDATE_NOTIFICATIONS, { params: params || undefined }, other)

export const loadNotificationsSuccess = (
  request: ApiRequestPayload,
  data: Object,
  meta: Object,
  other?: Object,
) =>
  action(
    LOAD_NOTIFICATIONS_SUCCESS,
    ({ request, data, meta }: ApiResponsePayload),
    other,
  )

export const loadNotificationsFailure = (
  request: ApiRequestPayload,
  error: any,
  other?: Object,
) => errorAction(LOAD_NOTIFICATIONS_FAILURE, { request }, error, other)

type NotificationIdsParams = { notificationIds: Array<string> }
export const archiveNotifications = (
  { notificationIds }: NotificationIdsParams,
  other?: Object,
) => action(ARCHIVE_NOTIFICATIONS, { notificationIds }, other)

export const deleteNotifications = (
  { notificationIds }: NotificationIdsParams,
  other?: Object,
) => action(DELETE_NOTIFICATIONS, { notificationIds }, other)

export type MarkNotificationsParams = {
  notificationIds: Array<string>,
  all?: boolean,
  repoId?: string,
}

export const markNotificationsAsReadRequest = (
  {
    all,
    lastReadAt = moment().toISOString(),
    notificationIds,
    repoId,
  }: MarkNotificationsParams,
  other?: Object,
) =>
  action(
    MARK_NOTIFICATIONS_AS_READ_REQUEST,
    { all, lastReadAt, notificationIds, repoId },
    other,
  )

export const markNotificationsAsReadFailure = (
  { notificationIds }: MarkNotificationsParams,
  error: any,
  other?: Object,
) =>
  errorAction(
    MARK_NOTIFICATIONS_AS_READ_FAILURE,
    { notificationIds },
    error,
    other,
  )

export const markNotificationsAsReadSuccess = (
  { notificationIds }: MarkNotificationsParams,
  data: Object,
  meta: Object,
  other?: Object,
) =>
  action(
    MARK_NOTIFICATIONS_AS_READ_SUCCESS,
    { data, meta, notificationIds },
    other,
  )

export const markNotificationsAsUnread = (
  {
    all,
    lastUnreadAt = moment().toISOString(),
    notificationIds,
    repoId,
  }: MarkNotificationsParams,
  other?: Object,
) =>
  action(
    MARK_NOTIFICATIONS_AS_UNREAD,
    { all, lastUnreadAt, notificationIds, repoId },
    other,
  )
