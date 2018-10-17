import { AppRegistry } from 'react-native'

import './web/src/index.css'
import './web/src/reset.css'

import { App } from './src/components/App.tsx'

AppRegistry.registerComponent('devhub', () => App)
AppRegistry.runApplication('devhub', {
  rootTag: document.getElementById('root'),
})
