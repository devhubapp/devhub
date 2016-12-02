import { denormalize } from 'denormalizr';
import { memoize } from 'lodash';
import { arrayOf } from 'normalizr';
import { createSelector } from 'reselect';

import { ColumnSchema } from '../utils/normalizr/schemas';

const objectKeysMemoized = memoize(Object.keys);

const columnsIdsSelector = state => objectKeysMemoized(state.entities.columns);
const entitiesSelector = state => state.entities;

export default createSelector(
  columnsIdsSelector,
  entitiesSelector,
  (columnsIds, entities) => (
    denormalize(columnsIds, entities, arrayOf(ColumnSchema))
  ),
);
