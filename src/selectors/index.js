import { Seq } from 'immutable';
import { memoize } from 'lodash';
import { createStructuredSelector } from 'reselect';

import columns from './columns';
import theme from './theme';

export const objectKeysMemoized = memoize(obj => (obj ? obj.keySeq() : Seq()));

export default createStructuredSelector({
  columns,
  theme,
});
