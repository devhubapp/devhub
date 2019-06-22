import { app, shell } from 'electron'
import path from 'path'
import url from 'url'

import * as config from './config'
import * as constants from './constants'
import * as helpers from './helpers'
import * as ipc from './ipc'
import { __DEV__ } from './libs/electron-is-dev'
import * as menu from './menu'
import * as tray from './tray'
import * as updater from './updater'
import * as window from './window'

function setupBrowserExtensions() {
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
  } = require('electron-devtools-installer') // tslint:disable-line no-var-requires

  installExtension(REACT_DEVELOPER_TOOLS).catch(console.error)
  installExtension(REDUX_DEVTOOLS).catch(console.error)
}

function init() {
  app.setName('DevHub')

  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    app.quit()
    return
  }

  app.on('second-instance', (event, argv, _workingDirectory) => {
    const mainWindow = window.getMainWindow()
    if (!mainWindow) return

    helpers.showWindow(mainWindow)

    app.emit('open-url', event, __DEV__ ? argv[2] : argv[1])
  })

  app.on('ready', () => {
    config.store.set('launchCount', config.store.get('launchCount', 0) + 1)

    if (__DEV__ && process.platform === 'win32') {
      app.removeAsDefaultProtocolClient(constants.shared.APP_DEEP_LINK_SCHEMA)
      app.setAsDefaultProtocolClient(
        constants.shared.APP_DEEP_LINK_SCHEMA,
        process.execPath,
        [path.resolve(process.argv[1])],
      )
    } else {
      app.setAsDefaultProtocolClient(constants.shared.APP_DEEP_LINK_SCHEMA)
    }

    tray.createTray()
    window.init()

    if (process.platform === 'darwin') {
      app.setAboutPanelOptions({
        applicationName: 'DevHub',
        applicationVersion: app.getVersion(),
        copyright: 'Copyright 2019',
        credits: 'Bruno Lemos',
      })
    }

    if (__DEV__) {
      setupBrowserExtensions()
    } else {
      updater.init()

      let lastUpdaterMenuItem = menu.getUpdaterMenuItem()
      setInterval(() => {
        const newUpdaterMenuItem = menu.getUpdaterMenuItem()
        if (lastUpdaterMenuItem.label !== newUpdaterMenuItem.label) {
          lastUpdaterMenuItem = newUpdaterMenuItem
          menu.updateMenu()
        }
      }, 5000)
    }
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    window.updateOrRecreateWindow()

    const mainWindow = window.getMainWindow()
    mainWindow.show()
  })

  app.on('web-contents-created', (_event, webContents) => {
    webContents.on(
      'new-window',
      (event, uri, _frameName, _disposition, _options) => {
        if (
          !app.isDefaultProtocolClient(constants.shared.APP_DEEP_LINK_SCHEMA) &&
          `${url.parse(uri).pathname || ''}`.startsWith('/oauth')
        )
          return

        event.preventDefault()
        shell.openExternal(uri)
      },
    )
  })

  app.on('open-url', (_event, uri) => {
    const mainWindow = window.getMainWindow()
    if (!mainWindow) return

    mainWindow.webContents.send('open-url', uri)
    helpers.showWindow(mainWindow)
  })

  ipc.register()

  updater.register()
}

init()
