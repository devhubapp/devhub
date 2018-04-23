import { Platform as _Platform } from 'react-native'

import { PlataformSelectSpecifics, PlatformSelectOptions } from './index.shared'

const Platform = {
  ..._Platform,
  isStandalone: true,
  realOS: _Platform.OS,
  selectUsingRealOS<T>(
    specifics: PlataformSelectSpecifics<T>,
    options?: PlatformSelectOptions,
  ) {
    return _Platform.select(specifics)
  },
}

export default Platform
