// Security precaution
;(window as any).eval = global.eval = (payload: string) => {
  const error = new Error(`This app does not allow window.eval().`)
  Object.assign(error, { payload })

  throw error
}

import 'react-app-polyfill/stable'
import 'resize-observer-polyfill/dist/ResizeObserver.global'
import smoothscroll from 'smoothscroll-polyfill'

smoothscroll.polyfill()

import localforage from 'localforage'
import { ComponentType } from 'react'
import { AppRegistry } from 'react-native-web'

import './index.css'

import { App } from '@devhub/components/src/components/App'

localforage.config({
  name: 'devhub',
  size: 100 * 1024 * 1024,
})

const render = (AppComponent: ComponentType) => {
  AppRegistry.registerComponent('devhub', () => AppComponent)
  AppRegistry.runApplication('devhub', {
    rootTag: document.getElementById('root'),
  })
}

render(App)

/*
if (typeof module !== 'undefined' && (module as any).hot) {
  ;(module as any).hot.accept('@devhub/components/src/components/App', () => {
    const NewApp = require('@devhub/components/src/components/App').App
    render(NewApp)
  })
}
*/
