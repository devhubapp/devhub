import { app, ipcMain } from 'electron'

import * as config from './config'
import * as constants from './constants'
import { getDock } from './dock'
import * as helpers from './helpers'
import * as tray from './tray'
import * as window from './window'

export function register() {
  ipcMain.on('can-open-url', (e: any, uri?: string) => {
    let returnValue = false

    if (!(e && uri && typeof uri === 'string')) returnValue = false
    else if (uri.startsWith('http://') || uri.startsWith('https://'))
      returnValue = true
    else if (uri.startsWith(`${constants.shared.APP_DEEP_LINK_SCHEMA}://`))
      returnValue = helpers.isDefaultAppSchema()

    e.returnValue = returnValue
  })

  ipcMain.on('open-url', (_e: any, uri?: string) => {
    const mainWindow = window.getMainWindow()
    if (!mainWindow) return

    if (
      !(
        uri &&
        typeof uri === 'string' &&
        uri.startsWith(`${constants.shared.APP_DEEP_LINK_SCHEMA}://`)
      )
    )
      return

    mainWindow.webContents.send('open-url', uri)
  })

  ipcMain.on('post-message', (_e: any, data: any) => {
    const mainWindow = window.getMainWindow()
    if (!mainWindow) return

    mainWindow.webContents.send('post-message', data)
  })

  ipcMain.on('exit-full-screen', () => {
    const mainWindow = window.getMainWindow()
    if (!mainWindow) return
    mainWindow.setFullScreen(false)
  })

  ipcMain.on('unread-counter', async (_e: any, unreadCount: number) => {
    tray.updateUnreadState(unreadCount)

    const dock = getDock()

    if (dock) dock.setBadge(unreadCount > 0 ? `${unreadCount}` : '')
  })

  ipcMain.on('get-all-settings', async (e: any) => {
    if (!e) return

    e.returnValue = {
      isMenuBarMode: config.store.get('isMenuBarMode'),
      lockOnCenter: config.store.get('lockOnCenter'),
      openAtLogin: config.store.get('openAtLogin'),
    }
  })

  ipcMain.on(
    'update-settings',
    async (e: any, payload: Parameters<typeof emit>[1]) => {
      const settings = payload && payload.settings
      const value = payload && payload.value

      const mainWindow = window.getMainWindow()

      switch (settings) {
        case 'isMenuBarMode': {
          if (value) {
            config.store.set('isMenuBarMode', true)

            if (mainWindow.isFullScreen()) {
              mainWindow.setFullScreen(false)
              setTimeout(window.updateOrRecreateWindow, 1000)
            } else {
              window.updateOrRecreateWindow()
            }
          } else {
            config.store.set('isMenuBarMode', false)

            if (mainWindow.isFullScreen()) {
              mainWindow.setFullScreen(false)
              setTimeout(window.updateOrRecreateWindow, 1000)
            } else {
              window.updateOrRecreateWindow()
            }
          }
          break
        }

        case 'lockOnCenter': {
          config.store.set('lockOnCenter', value)

          if (value) {
            if (!config.store.get('isMenuBarMode')) {
              mainWindow.setMovable(false)
            }

            window.center(mainWindow)
          } else {
            if (!config.store.get('isMenuBarMode')) {
              mainWindow.setMovable(
                window.getBrowserWindowOptions().movable !== false,
              )
            }
          }
          break
        }

        case 'openAtLogin': {
          const openAtLoginChangeCount =
            ((config.store.get('openAtLoginChangeCount') as number) || 0) + 1

          config.store.set('openAtLoginChangeCount', openAtLoginChangeCount)

          app.setLoginItemSettings({
            openAtLogin: value,
            openAsHidden: openAtLoginChangeCount > 1,
          })
          break
        }
      }

      mainWindow.webContents.send('update-settings', payload)
    },
  )
}

export function emit(
  event: 'update-settings',
  payload: {
    settings: 'isMenuBarMode' | 'lockOnCenter' | 'openAtLogin'
    value: boolean
  },
): void
export function emit(event: string, payload: any): void {
  ipcMain.emit(event, null, payload)
}
