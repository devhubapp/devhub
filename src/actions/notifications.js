// @flow
/* eslint-disable import/prefer-default-export */

import {
  CLEAR_NOTIFICATIONS,
  LOAD_NOTIFICATIONS_REQUEST,
  LOAD_NOTIFICATIONS_SUCCESS,
  LOAD_NOTIFICATIONS_FAILURE,
  MARK_NOTIFICATIONS_AS_READ,
  TOGGLE_NOTIFICATIONS_READ_STATUS,
  UPDATE_NOTIFICATIONS,
} from '../utils/constants/actions';

import { requestTypes } from '../api/github';
import { action, errorAction } from '../utils/helpers/actions';
import type {
  ApiRequestPayload,
  ApiResponsePayload,
  NotificationsOptions,
} from '../utils/types';

export const loadNotificationsRequest = (params: NotificationsOptions, other?: Object) => (
  action(LOAD_NOTIFICATIONS_REQUEST, ({
    params: params || {},
    requestType: requestTypes.NOTIFICATIONS,
  }: ApiRequestPayload), other)
);

export const updateNotifications = (params?: Object, other?: Object) => (
  action(UPDATE_NOTIFICATIONS, { params: params || undefined }, other)
);

export const loadNotificationsSuccess = (
  request: ApiRequestPayload,
  data: Object,
  meta: Object,
  other?: Object,
) => (
  action(LOAD_NOTIFICATIONS_SUCCESS, ({ request, data, meta }: ApiResponsePayload), other)
);

export const loadNotificationsFailure = (
  request: ApiRequestPayload,
  error: any,
  other?: Object,
) => (
  errorAction(LOAD_NOTIFICATIONS_FAILURE, { request }, error, other)
);

type NotificationIdsParams = { notificationIds: Array<string> };
export const clearNotifications = (
  { notificationIds }: NotificationIdsParams,
  other?: Object,
) => (
  action(CLEAR_NOTIFICATIONS, { notificationIds }, other)
);

export const markNotificationsAsRead = (
  { notificationIds }: NotificationIdsParams,
  other?: Object,
) => (
  action(MARK_NOTIFICATIONS_AS_READ, { notificationIds }, other)
);

export const toggleNotificationsReadStatus = (
  { notificationIds }: NotificationIdsParams,
  other?: Object,
) => (
  action(TOGGLE_NOTIFICATIONS_READ_STATUS, { notificationIds }, other)
);
