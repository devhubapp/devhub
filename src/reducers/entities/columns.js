// @flow

import { mapValues, omit, union } from 'lodash';

import { guid } from '../../utils/helpers';
import { CREATE_COLUMN, DELETE_COLUMN, LOAD_USER_FEED_SUCCESS } from '../../utils/constants/actions';
import type { ApiResponsePayload, Action, Column, Normalized } from '../../utils/types';

type State = Normalized<Column>;
export default (state: State = {}, { type, payload }: Action<any>): State => {
  switch (type) {
    case CREATE_COLUMN:
      return (({ title, events, subscriptions, ...restOfPayload }: Column) => {
        const id = guid();

        return {
          [id]: {
            id,
            title,
            events: events || [],
            subscriptions: subscriptions || [],
            ...restOfPayload,
          },
          ...omit(state, id),
        };
      })(payload);

    case DELETE_COLUMN:
      return omit(state, payload.id);

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
