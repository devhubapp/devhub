import { Platform } from 'react-native'

Platform.isStandalone = true
Platform.realOS = Platform.OS
Platform.selectUsingRealOS = Platform.select

export default Platform
