import { Fragment } from 'react'
import {
  Appearance as AppearanceOriginal,
  ColorSchemeName as ColorSchemeNameOriginal,
} from 'react-native'

import { Appearence, ColorSchemeName } from './index.shared'

export { ColorSchemeName }

export const AppearanceProvider = Fragment

export const Appearance: Appearence = {
  addChangeListener(listener) {
    return AppearanceOriginal.addChangeListener(preferences => {
      const _colorScheme = preferences && preferences.colorScheme
      listener({ colorScheme: normalizeColorScheme(_colorScheme) })
    })
  },
  getColorScheme() {
    return normalizeColorScheme(AppearanceOriginal.getColorScheme())
  },
}

function normalizeColorScheme(
  colorSchemeOriginal: ColorSchemeNameOriginal,
): ColorSchemeName {
  if (colorSchemeOriginal === 'light' || colorSchemeOriginal === 'dark')
    return colorSchemeOriginal

  return undefined
}
