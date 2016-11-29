// @flow

import { mapValues, omit, union } from 'lodash';

import { guid } from '../../utils/helpers';
import { CREATE_COLUMN, LOAD_USER_FEED_SUCCESS } from '../../utils/constants/actions';
import type { ApiResponsePayload, Action, Column, Normalized } from '../../utils/types';

type State = Normalized<Column>;
export default (state: State = {}, { type, payload }: Action<any>): State => {
  switch (type) {
    case CREATE_COLUMN:
      return (({ title, events, subscriptions, ...payload }: Column) => {
        const id = guid();

        return {
          [id]: {
            id,
            title,
            events: events || [],
            subscriptions: subscriptions || [],
            ...payload,
          },
          ...omit(state, id),
        };
      })(payload);

    case LOAD_USER_FEED_SUCCESS:
      return (({ request: { path }, data: { result } }: ApiResponsePayload) => {
        return mapValues(state, column => {
          if (column.subscriptions.indexOf(path) < 0) return column;

          return ({
            ...column,
            events: union(result, column.events),
          });
        });
      })(payload);

    default:
      return state;
  }
};
