import { Linking } from 'react-native'

export const Browser = Object.assign(Linking, {
  dismiss: () => undefined,
})
