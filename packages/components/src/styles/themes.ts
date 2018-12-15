import { Theme, ThemeName } from '@devhub/core'
import { theme as darkBlack } from './themes/dark-black'
import { theme as darkBlue } from './themes/dark-blue'
import { theme as darkGray } from './themes/dark-gray'
import { theme as lightBlue } from './themes/light-blue'
import { theme as lightGray } from './themes/light-gray'
import { theme as lightWhite } from './themes/light-white'

export const themes: Record<ThemeName, Theme | undefined> = {
  auto: undefined,
  custom: undefined,
  'dark-black': darkBlack,
  'dark-blue': darkBlue,
  'dark-gray': darkGray,
  'light-blue': lightBlue,
  'light-gray': lightGray,
  'light-white': lightWhite,
}

export const darkThemesArr = [darkBlack, darkBlue, darkGray]
export const lightThemesArr = [lightWhite, lightBlue, lightGray]
