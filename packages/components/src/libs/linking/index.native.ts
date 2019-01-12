import { LinkingCrossPlatform } from './index'

export const Linking: LinkingCrossPlatform = require('./index-native').Linking // tslint:disable-line no-var-requires
