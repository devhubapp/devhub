export type ColorSchemeName = 'light' | 'dark' | undefined

export interface AppearancePreferences {
  colorScheme: ColorSchemeName
}

type AppearanceListener = (preferences: AppearancePreferences) => void

export interface Appearence {
  addChangeListener: (listener: AppearanceListener) => { remove: () => void }
  getColorScheme(): ColorSchemeName
}
