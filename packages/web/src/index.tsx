import '@babel/polyfill'
import 'react-app-polyfill/ie9'
import 'resize-observer-polyfill/dist/ResizeObserver.global'

import { AppRegistry } from 'react-native-web'

import './index.css'
import './reset.css'

import { App } from '@devhub/components/src/components/App'

AppRegistry.registerComponent('devhub', () => App)
AppRegistry.runApplication('devhub', {
  rootTag: document.getElementById('root'),
})
