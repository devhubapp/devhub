import { Platform } from '../platform'
import { LinkingCrossPlatform } from './index'

export const Linking: LinkingCrossPlatform = Platform.isElectron
  ? require('./index-electron').Linking // eslint-disable-line
  : require('./index-native').Linking // eslint-disable-line
