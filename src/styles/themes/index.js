import darkTheme from './dark';
import darkBlueTheme from './dark-blue';
import lightTheme from './light';

export const DARK_THEME = darkTheme;
export const DARK_BLUE_THEME = darkBlueTheme;
export const LIGHT_THEME = lightTheme;

export default {
  [DARK_THEME.name]: DARK_THEME,
  [DARK_BLUE_THEME.name]: DARK_BLUE_THEME,
  [LIGHT_THEME.name]: LIGHT_THEME,
};
