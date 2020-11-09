import { ItemPushNotification } from '@devhub/core'
import { app, dialog, ipcMain, Notification } from 'electron'

import * as config from './config'
import * as constants from './constants'
import { getDock } from './dock'
import * as helpers from './helpers'
import * as tray from './tray'
import * as window from './window'

export function register() {
  ipcMain.setMaxListeners(50)

  ipcMain.removeAllListeners('can-open-url')
  ipcMain.addListener('can-open-url', (e: any, uri?: string) => {
    let returnValue = false

    if (!(e && uri && typeof uri === 'string')) returnValue = false
    else if (uri.startsWith('http://') || uri.startsWith('https://'))
      returnValue = true
    else if (uri.startsWith(`${constants.shared.APP_DEEP_LINK_SCHEMA}://`))
      returnValue = helpers.isDefaultAppSchema()

    e.returnValue = returnValue
  })

  ipcMain.removeAllListeners('open-url')
  ipcMain.addListener('open-url', (_e: any, uri?: string) => {
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

  ipcMain.removeAllListeners('post-message')
  ipcMain.addListener('post-message', (_e: any, data: any) => {
    const mainWindow = window.getMainWindow()
    if (!mainWindow) return

    mainWindow.webContents.send('post-message', data)
  })

  ipcMain.removeAllListeners('exit-full-screen')
  ipcMain.addListener('exit-full-screen', () => {
    const mainWindow = window.getMainWindow()
    if (!mainWindow) return
    mainWindow.setFullScreen(false)
  })

  ipcMain.removeAllListeners('toggle-maximize')
  ipcMain.addListener('toggle-maximize', () => {
    const mainWindow = window.getMainWindow()
    if (!mainWindow) return

    if (mainWindow.isMaximized()) {
      const { width, height } = mainWindow.getBounds()
      const lockOnCenter = config.store.get('lockOnCenter')

      config.store.set('lockOnCenter', true)
      mainWindow.setSize(
        Math.round(width * 0.9),
        Math.round(height * 0.9),
        true,
      )
      config.store.set('lockOnCenter', lockOnCenter)

      return
    }

    mainWindow.maximize()
  })

  ipcMain.removeAllListeners('unread-counter')
  ipcMain.addListener('unread-counter', (_e: any, unreadCount: number) => {
    tray.updateUnreadState(unreadCount)
    const dock = getDock()
    if (dock) dock.setBadge(unreadCount > 0 ? `${unreadCount}` : '')
  })

  ipcMain.removeAllListeners('minimize')
  ipcMain.addListener('minimize', () => {
    const mainWindow = window.getMainWindow()
    if (!mainWindow) return
    mainWindow.minimize()
  })

  ipcMain.removeAllListeners('get-all-settings')
  ipcMain.addListener('get-all-settings', (e: any) => {
    if (!e) return

    e.returnValue = {
      enablePushNotifications: config.store.get('enablePushNotifications'),
      enablePushNotificationsSound: config.store.get(
        'enablePushNotificationsSound',
      ),
      isMenuBarMode: config.store.get('isMenuBarMode'),
      lockOnCenter: config.store.get('lockOnCenter'),
      openAtLogin: config.store.get('openAtLogin'),
    }
  })

  ipcMain.removeAllListeners('update-settings')
  ipcMain.addListener(
    'update-settings',
    (_e: any, payload: Parameters<typeof emit>[1]) => {
      const settings = payload && payload.settings
      const value = payload && payload.value

      const mainWindow = window.getMainWindow()

      switch (settings) {
        case 'enablePushNotifications': {
          config.store.set('enablePushNotifications', value)
          if (value && config.store.get('enablePushNotificationsSound'))
            helpers.playNotificationSound()
          break
        }

        case 'enablePushNotificationsSound': {
          config.store.set('enablePushNotificationsSound', value)

          if (value) helpers.playNotificationSound()

          break
        }

        case 'isMenuBarMode': {
          config.store.set('isMenuBarMode', !!value)
          config.store.set('isMenuBarModeChangedAt', Date.now())

          if (mainWindow && mainWindow.isFullScreen()) {
            mainWindow.setFullScreen(false)
            setTimeout(window.updateOrRecreateWindow, 1000)
          } else {
            window.updateOrRecreateWindow()
          }
          break
        }

        case 'lockOnCenter': {
          config.store.set('lockOnCenter', value)

          if (!mainWindow) return

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
            (config.store.get('openAtLoginChangeCount') || 0) + 1

          config.store.set('openAtLoginChangeCount', openAtLoginChangeCount)

          app.setLoginItemSettings({
            openAtLogin: value,
            openAsHidden: openAtLoginChangeCount > 1,
          })
          break
        }
      }

      if (mainWindow) mainWindow.webContents.send('update-settings', payload)
    },
  )

  ipcMain.removeAllListeners('show-notification')
  ipcMain.addListener(
    'show-notification',
    (_e: any, payload: ItemPushNotification) => {
      void (async () => {
        if (!payload) {
          console.error('[show-notification] Invalid payload.', payload)
          return
        }

        if (config.store.get('enablePushNotifications') === false) {
          return
        }

        const { title, subtitle, body, imageURL } = payload

        let icon
        try {
          if (imageURL) icon = await helpers.imageURLToNativeImage(imageURL)
        } catch (error) {
          console.error(error)
          if (window.getMainWindow()) {
            dialog.showMessageBox(window.getMainWindow()!, {
              message: `${error}`,
            })
          }
        }

        const notification = new Notification({
          title,
          subtitle,
          body,
          icon,
          silent: true,
        })

        if (payload.onClickDispatchAction) {
          notification.addListener('click', (e) => {
            e.preventDefault()

            if (window.getMainWindow()) {
              window
                .getMainWindow()!
                .webContents.send('redux', payload.onClickDispatchAction)
            }
          })
        }

        notification.show()

        if (config.store.get('enablePushNotificationsSound') !== false) {
          helpers.playNotificationSound()
        }
      })()
    },
  )

  ipcMain.removeAllListeners('play-notification-sound')
  ipcMain.addListener('play-notification-sound', () => {
    helpers.playNotificationSound()
  })
}

export function emit(
  event: 'update-settings',
  payload: {
    settings:
      | 'enablePushNotifications'
      | 'enablePushNotificationsSound'
      | 'isMenuBarMode'
      | 'lockOnCenter'
      | 'openAtLogin'
    value: boolean
  },
): void
export function emit(event: string, payload: any): void {
  ipcMain.emit(event, null, payload)
}
