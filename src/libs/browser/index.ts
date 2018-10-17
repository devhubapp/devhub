import { Linking } from 'react-native'

export const Browser = {
  ...Linking,
  dismiss: () => undefined,
}
