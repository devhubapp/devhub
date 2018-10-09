import { ITheme } from '../../types'
import darkTheme from './dark'
import darkBlueTheme from './dark-blue'
import lightTheme from './light'

export const DARK_THEME: ITheme = darkTheme
export const DARK_BLUE_THEME: ITheme = darkBlueTheme
export const LIGHT_THEME: ITheme = lightTheme

export default {
  [DARK_THEME.name]: DARK_THEME,
  [DARK_BLUE_THEME.name]: DARK_BLUE_THEME,
  [LIGHT_THEME.name]: LIGHT_THEME,
}
