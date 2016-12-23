// @flow
/* eslint-disable import/prefer-default-export */

import {
  LOAD_NOTIFICATIONS_REQUEST,
  LOAD_NOTIFICATIONS_SUCCESS,
  LOAD_NOTIFICATIONS_FAILURE,
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
    params,
    requestType: requestTypes.NOTIFICATIONS,
  }: ApiRequestPayload), other)
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
