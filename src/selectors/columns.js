// @flow

import moment from 'moment';
import { List, Map, Seq } from 'immutable';
import { memoize } from 'lodash';
import { createSelector } from 'reselect';

import { columnEventsSelector } from './events';
import { columnSubscriptionsSelector } from './subscriptions';

export const objectKeysMemoized = memoize(obj => (obj ? obj.keySeq() : Seq()));

export const stateSelector = state => state || Map();
export const entitiesSelector = state => state.get('entities') || Map();
export const columnsSelector = state => entitiesSelector(state).get('columns') || Map();
export const columnsIdsSelector = state => objectKeysMemoized(columnsSelector(state)) || List();
export const columnSelector = (state, { id }) => columnsSelector(state).get(id) || Map();

const sortColumnsByDate = (b, a) => (
  moment(a.get('createdAt')).isAfter(moment(b.get('createdAt'))) ? 1 : -1
);

export default createSelector(
  stateSelector,
  columnsIdsSelector,
  (state, columnsIds) => (
    columnsIds.map(id => {
      const column = columnSelector(state, { id });
      if (!column) return null;

      return column.merge({
        events: columnEventsSelector(state, { column }),
        subscriptions: columnSubscriptionsSelector(state, { column }),
      });
    }).filter(Boolean)
  ).sort(sortColumnsByDate),
);
