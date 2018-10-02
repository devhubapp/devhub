import { AppRegistry } from 'react-native'
import { URL, URLSearchParams } from 'whatwg-url'

import './web/src/index.css'
import './web/src/reset.css'

import App from './src/components/App.tsx'

// see https://github.com/facebook/react-native/issues/16434
global.URL = URL
global.URLSearchParams = URLSearchParams

AppRegistry.registerComponent('devhub', () => App)
AppRegistry.runApplication('devhub', {
  rootTag: document.getElementById('root'),
})
