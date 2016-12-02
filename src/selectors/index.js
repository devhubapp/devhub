import { createStructuredSelector } from 'reselect';

import columns from './columns';
import theme from './theme';

export default createStructuredSelector({
  columns,
  theme,
});
