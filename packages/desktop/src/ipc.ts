import { app, ipcMain } from 'electron'

import * as constants from './constants'
import * as tray from './tray'
import * as window from './window'

export function register() {
  ipcMain.on('can-open-url', (e: any, uri?: string) => {
    let returnValue = false

    if (!(e && uri && typeof uri === 'string')) returnValue = false
    else if (uri.startsWith('http://') || uri.startsWith('https://'))
      returnValue = true
    else if (uri.startsWith(`${constants.shared.APP_DEEP_LINK_SCHEMA}://`))
      returnValue = app.isDefaultProtocolClient(
        constants.shared.APP_DEEP_LINK_SCHEMA,
      )

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

  ipcMain.on('unread-counter', (_e: any, unreadCount: any) => {
    tray.updateIconState(unreadCount)
  })
}
