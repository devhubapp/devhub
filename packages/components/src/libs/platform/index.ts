import { Platform as _Platform } from 'react-native'

import { PlataformSelectSpecifics, PlatformSelectOptions } from './index.shared'

export const Platform = {
  ..._Platform,
  isElectron: false,
  isStandalone: true,
  realOS: _Platform.OS,
  selectUsingRealOS<T>(
    specifics: PlataformSelectSpecifics<T>,
    _options?: PlatformSelectOptions,
  ) {
    return _Platform.select(specifics)
  },
  supportsTouch: true,
}
