import { Theme, ThemeName } from '@devhub/core'
import { theme as darkBlack } from './themes/dark-black'
import { theme as darkBlue } from './themes/dark-blue'
import { theme as darkGray } from './themes/dark-gray'
import { theme as darkPurple } from './themes/dark-purple'
import { theme as lightBlue } from './themes/light-blue'
import { theme as lightGray } from './themes/light-gray'
import { theme as lightPurple } from './themes/light-purple'
import { theme as lightWhite } from './themes/light-white'

export const themes: Record<ThemeName, Theme | undefined> = {
  auto: undefined,
  custom: undefined,
  'dark-black': darkBlack,
  'dark-blue': darkBlue,
  'dark-gray': darkGray,
  'dark-purple': darkPurple,
  'light-blue': lightBlue,
  'light-gray': lightGray,
  'light-purple': lightPurple,
  'light-white': lightWhite,
}

export const darkThemesArr = [darkBlack, darkGray, darkBlue, darkPurple]
export const lightThemesArr = [lightWhite, lightGray, lightBlue, lightPurple]
