// @flow

import omit from 'lodash/omit';

import { ApiRequestType, getUniquePath } from '../../api/github';
import { CREATE_SUBSCRIPTION, DELETE_SUBSCRIPTION } from '../../utils/constants/actions';

import type {
  Action,
  Normalized,
  Subscription,
} from '../../utils/types';

export function generateSubscriptionId(requestType: ApiRequestType, params: Object) {
  return getUniquePath(requestType, params);
}

type State = Normalized<Subscription>;
export default (state: State = {}, { type, payload }: Action<any>): State => {
  switch (type) {
    case CREATE_SUBSCRIPTION:
      return (({ id: subscriptionId, requestType, params, ...restOfPayload }: Subscription) => {
        const id = subscriptionId || generateSubscriptionId(requestType, params);

        return {
          [id]: {
            id,
            requestType,
            params: params || {},
            createdAt: new Date(),
            ...restOfPayload,
          },
          ...omit(state, id),
        };
      })(payload);

    case DELETE_SUBSCRIPTION:
      return omit(state, payload.id);

    default:
      return state;
  }
};
