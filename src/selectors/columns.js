import moment from 'moment';
import { List, Seq } from 'immutable';
import { memoize } from 'lodash';
import { createSelector } from 'reselect';

import { columnEventsSelector } from './events';

const objectKeysMemoized = memoize(obj => (obj ? obj.keySeq() : Seq()));

const stateSelector = state => state;
const entitiesSelector = state => state.get('entities');
const columnsSelector = state => entitiesSelector(state).get('columns');
const columnsIdsSelector = state => objectKeysMemoized(columnsSelector(state));
const columnSelector = (state, { id }) => columnsSelector(state).get(id);

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
      });
    }).filter(Boolean)
  ).sort(sortColumnsByDate),
);
