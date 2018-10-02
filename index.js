import { AppRegistry } from 'react-native'
import { URL, URLSearchParams } from 'whatwg-url'
import { useScreens } from 'react-native-screens'

import App from './src/components/App.tsx'

useScreens()

// see https://github.com/facebook/react-native/issues/16434
global.URL = URL
global.URLSearchParams = URLSearchParams

AppRegistry.registerComponent('devhub', () => App)
