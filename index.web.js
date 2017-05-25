/* eslint-env browser */

import 'babel-polyfill'
import { AppRegistry } from 'react-native'

import './web/src/index.css'
import './web/src/reset.css'

import App from './src/'
import registerServiceWorker from './web/src/registerServiceWorker'
import { name as appName } from './package.json'

AppRegistry.registerComponent(appName, () => App)
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
})

registerServiceWorker()
