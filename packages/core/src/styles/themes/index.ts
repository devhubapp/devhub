import { Theme, ThemeName } from '../../types'
import { theme as darkBlack } from './dark-black'
import { theme as darkBlue } from './dark-blue'
import { theme as darkGray } from './dark-gray'
import { theme as darkPurple } from './dark-purple'
import { theme as lightBlue } from './light-blue'
import { theme as lightGray } from './light-gray'
import { theme as lightPurple } from './light-purple'
import { theme as lightWhite } from './light-white'

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
