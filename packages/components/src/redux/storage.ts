import { Platform } from '../libs/platform'

export default Platform.select({
  web: () => require('localforage'),
  default: () => require('react-native').AsyncStorage,
})()
