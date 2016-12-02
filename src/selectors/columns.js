import { denormalize } from 'denormalizr';
import { memoize } from 'lodash';
import { arrayOf } from 'normalizr';
import { createSelector } from 'reselect';

import { ColumnSchema } from '../utils/normalizr/schemas';

const objectKeysMemoized = memoize(obj => obj.keySeq());

const columnsIdsSelector = state => objectKeysMemoized(state.getIn(['entities', 'columns']));
const entitiesSelector = state => state.get('entities');

export default createSelector(
  columnsIdsSelector,
  entitiesSelector,
  (columnsIds, entities) => (
    denormalize(columnsIds, entities, arrayOf(ColumnSchema))
  ),
);
