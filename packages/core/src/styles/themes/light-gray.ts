import { createThemeFromColor } from './custom'

export const theme = createThemeFromColor(
  '#F5F5F5',
  'light-gray',
  'Light Gray',
  {
    tintColor: '#29333D',
    override: {
      primaryBackgroundColor: '#000000',
    },
  },
)
