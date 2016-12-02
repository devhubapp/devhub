import { createSelector } from 'reselect';

import { loadTheme } from '../utils/helpers';

const themeSelector = state => state.getIn(['config', 'theme']);

export default createSelector(
  themeSelector,
  theme => loadTheme(theme),
);
