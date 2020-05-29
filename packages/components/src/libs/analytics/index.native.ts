import { Analytics } from '.'
import { Platform } from '../platform'

export const analytics: Analytics = Platform.selectUsingRealOS({
  macos: () => require('./unsupported').analytics,
  default: () => require('./native').analytics,
})!()
