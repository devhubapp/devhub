// @flow

import { fromJS, Map } from 'immutable';

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
export default (state: State = Map({}), { type, payload }: Action<any>): State => {
  switch (type) {
    case CREATE_SUBSCRIPTION:
      return (({ id: subscriptionId, requestType, params, ...restOfPayload }: Subscription) => {
        const id = subscriptionId || generateSubscriptionId(requestType, params);

        return state.set(id, fromJS({
          id,
          requestType,
          params: params || {},
          createdAt: new Date(),
          ...restOfPayload,
        }));
      })(payload);

    case DELETE_SUBSCRIPTION:
      return state.delete(payload.id);

    default:
      return state;
  }
};
