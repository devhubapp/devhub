import { Platform as _Platform } from 'react-native'

const Platform = {
  ..._Platform,
  isStandalone: true,
  realOS: _Platform.OS,
  selectUsingRealOS: _Platform.select,
}

export default Platform
