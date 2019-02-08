import { Platform } from '../platform'
import { LinkingCrossPlatform } from './index'

export const Linking: LinkingCrossPlatform = Platform.isElectron
  ? require('./index-electron').Linking // tslint:disable-line no-var-requires
  : require('./index-native').Linking // tslint:disable-line no-var-requires
