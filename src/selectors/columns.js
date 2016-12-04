import { Seq } from 'immutable';
import { memoize } from 'lodash';
import { denormalize } from 'denormalizr';
import { arrayOf } from 'normalizr';
import { createSelector } from 'reselect';

import { ColumnSchema } from '../utils/normalizr/schemas';

const objectKeysMemoized = memoize(obj => (obj ? obj.keySeq() : Seq()));

const entitiesSelector = state => state.get('entities');
const columnsIdsSelector = state => objectKeysMemoized(state.getIn(['entities', 'columns']));

export default createSelector(
  columnsIdsSelector,
  entitiesSelector,
  (columnsIds, entities) => denormalize(columnsIds, entities, arrayOf(ColumnSchema)),
);
