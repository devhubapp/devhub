import {
  app,
  Menu,
  MenuItemConstructorOptions,
  shell,
  TouchBar,
} from 'electron'

import * as config from './config'
import * as constants from './constants'
import * as dock from './dock'
import * as helpers from './helpers'
import * as ipc from './ipc'
import { __DEV__ } from './libs/electron-is-dev'
import * as tray from './tray'
import * as updater from './updater'
import * as window from './window'

export function getAboutMenuItems() {
  const menuItems: MenuItemConstructorOptions[] = [
    ...(process.platform === 'darwin'
      ? [
          {
            label: 'About',
            role: 'about',
          } as MenuItemConstructorOptions,
        ]
      : []),
    {
      label: 'Open GitHub Repository',
      click: () => {
        shell.openExternal('https://github.com/devhubapp/devhub')
      },
    },
    { type: 'separator' },
    ...(getOpenAtLoginMenuItem()
      ? ([
          getOpenAtLoginMenuItem(),
          { type: 'separator' },
        ] as MenuItemConstructorOptions[])
      : []),
    getUpdaterMenuItem(),
  ]

  return menuItems
}

export function getOptionsMenuItems() {
  const menuItems: MenuItemConstructorOptions[] = [
    ...getModeMenuItems(),
    ...(getWindowOptionsMenuItems().length
      ? ([
          { type: 'separator' },
          ...getWindowOptionsMenuItems(),
        ] as MenuItemConstructorOptions[])
      : []),
  ]

  return menuItems
}

export function getOpenAtLoginMenuItem() {
  if (!constants.FEATURE_FLAGS.OPEN_AT_LOGIN) return null

  const menuItem: MenuItemConstructorOptions = {
    type: 'checkbox',
    label: 'Open at Login',
    checked: app.getLoginItemSettings().openAtLogin,
    enabled: true,
    visible: true,
    click(item) {
      ipc.emit('update-settings', {
        settings: 'openAtLogin',
        value: item.checked,
      })
    },
  }

  return menuItem
}

export function getUpdaterMenuItem() {
  let enabled: boolean = !__DEV__
  let label: string

  const updateInfo = updater.getUpdateInfo()

  let click: MenuItemConstructorOptions['click'] = () => {
    updateInfo.lastManuallyCheckedAt = Date.now()
    updater.checkForUpdatesAndNotify()
  }

  switch (updateInfo.state) {
    case 'checking-for-update': {
      enabled = false
      label = 'Checking for updates...'
      if (Date.now() - updateInfo.date < 60000) break
    }

    case 'downloading': {
      enabled = false
      label =
        updateInfo.progress && updateInfo.progress > 0
          ? `Downloading update... (${parseFloat(
              `${updateInfo.progress}`,
            ).toFixed(2)}%)`
          : 'Downloading update...'
      if (Date.now() - updateInfo.date < 10 * 60000) break
    }

    case 'error': {
      if (!__DEV__) enabled = true
      label = 'Failed to download update.'
      if (Date.now() - updateInfo.date < 60000) break
    }

    case 'update-available': {
      enabled = false
      label = updater.getAutoUpdater().autoDownload
        ? 'Downloading updates...'
        : 'Update available. Please wait.'
      if (Date.now() - updateInfo.date < 10 * 60000) break
    }

    case 'update-downloaded': {
      if (!__DEV__) enabled = true
      label = 'Update downloaded. Click to restart.'

      click = () => {
        updater.getAutoUpdater().autoInstallOnAppQuit = true
        app.relaunch()
        app.quit()
      }

      break
    }

    case 'update-not-available': {
      enabled = false
      label = 'No updates available.'
      if (Date.now() - updateInfo.date < 30000) break
    }

    default: {
      if (!__DEV__) enabled = true
      label = 'Check for updates...'
    }
  }

  const menuItem: MenuItemConstructorOptions = {
    label,
    enabled,
    click,
  }

  return menuItem
}

export function getDeveloperMenuItems() {
  const menuItems: Array<MenuItemConstructorOptions | undefined> = [
    {
      label: 'Toggle Developer Tools',
      accelerator: __DEV__
        ? process.platform === 'darwin'
          ? 'Alt+Command+I'
          : 'Ctrl+Shift+I'
        : undefined,
      visible: __DEV__,
      click(_: any, focusedWindow: any) {
        if (focusedWindow) focusedWindow.webContents.toggleDevTools()
      },
    },
  ]

  return menuItems.filter(Boolean) as MenuItemConstructorOptions[]
}

export function getRestartMenuItem() {
  const menuItem: MenuItemConstructorOptions = {
    label: 'Restart',
    accelerator: 'CmdOrCtrl+R',
    click() {
      app.relaunch()
      app.quit()
    },
  }

  return menuItem
}

export function getModeMenuItems() {
  const _mainWindow = window.getMainWindow()
  const _tray = tray.getTray()
  if (
    !(_tray && _tray.getBounds().width && _tray.getBounds().height) &&
    !config.store.get('isMenuBarMode')
  )
    return []

  const isCurrentWindow =
    _mainWindow && _mainWindow.isVisible() && !_mainWindow.isMinimized()
  const enabled = isCurrentWindow || !!config.store.get('isMenuBarMode')

  const menuItems: MenuItemConstructorOptions[] = [
    {
      type: 'radio',
      label: 'Desktop mode',
      checked: !config.store.get('isMenuBarMode'),
      enabled,
      click() {
        ipc.emit('update-settings', {
          settings: 'isMenuBarMode',
          value: false,
        })
      },
    },
    {
      type: 'radio',
      label: 'Menubar mode',
      checked: !!config.store.get('isMenuBarMode'),
      enabled, // : enabled && !_mainWindow.isFullScreen(),
      click() {
        ipc.emit('update-settings', {
          settings: 'isMenuBarMode',
          value: true,
        })
      },
    },
  ]

  return menuItems
}

export function getWindowOptionsMenuItems() {
  const _mainWindow = window.getMainWindow()
  const isCurrentWindow =
    _mainWindow && _mainWindow.isVisible() && !_mainWindow.isMinimized()
  const enabled = isCurrentWindow || !!config.store.get('isMenuBarMode')

  const menuItems: MenuItemConstructorOptions[] = [
    constants.FEATURE_FLAGS.LOCK_ON_CENTER
      ? ({
          type: 'checkbox',
          label: 'Lock on center',
          checked: config.store.get('lockOnCenter'),
          enabled,
          visible: !config.store.get('isMenuBarMode'),
          click(item) {
            ipc.emit('update-settings', {
              settings: 'lockOnCenter',
              value: item.checked,
            })
          },
        } as MenuItemConstructorOptions)
      : (undefined as any),
  ].filter(Boolean)

  return menuItems
}

export function getMainMenuItems() {
  const _mainWindow = window.getMainWindow()
  const isCurrentWindow =
    _mainWindow && _mainWindow.isVisible() && !_mainWindow.isMinimized()
  const enabled = isCurrentWindow || !!config.store.get('isMenuBarMode')

  const menuItems: Array<MenuItemConstructorOptions | undefined> = [
    ...(process.platform === 'darwin'
      ? ([
          {
            label: app.getName(),
            submenu: [
              ...getAboutMenuItems(),
              { type: 'separator' },
              {
                label: `Hide ${app.getName()}`,
                accelerator: 'Command+H',
                role: 'hide',
              },
              {
                label: 'Hide Others',
                accelerator: 'Command+Alt+H',
                role: 'hideothers',
              },
              { type: 'separator' },
              {
                label: 'Quit',
                role: 'quit',
                click: () => {
                  app.quit()
                },
              },
            ],
          },
        ] as MenuItemConstructorOptions[])
      : []),
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut',
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy',
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste',
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        getRestartMenuItem(),
        ...(__DEV__ ? getDeveloperMenuItems() : []),
        { type: 'separator' },
        { role: 'resetzoom', enabled },
        { role: 'zoomin', enabled },
        { role: 'zoomout', enabled },
      ],
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        ...getOptionsMenuItems(),
        { type: 'separator' },
        ...getWindowMenuItems(),
      ],
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        ...(process.platform === 'darwin'
          ? []
          : ([
              ...getAboutMenuItems(),
              { type: 'separator' },
            ] as MenuItemConstructorOptions[])),
        {
          label: 'Report bug',
          click: () => {
            shell.openExternal('https://github.com/devhubapp/devhub/issues/new')
          },
        },
        {
          label: 'Send feedback',
          click: () => {
            shell.openExternal('https://github.com/devhubapp/devhub/issues/new')
          },
        },
      ],
    },
  ].filter(Boolean) as MenuItemConstructorOptions[]

  return menuItems as MenuItemConstructorOptions[]
}

export function getDockMenuItems() {
  return getOptionsMenuItems()
}

export function getWindowMenuItems() {
  const _mainWindow = window.getMainWindow()
  const isCurrentWindow =
    _mainWindow && _mainWindow.isVisible() && !_mainWindow.isMinimized()
  const enabled = isCurrentWindow || !!config.store.get('isMenuBarMode')

  const menuItems: MenuItemConstructorOptions[] = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      click() {
        const mainWindow = window.getMainWindow()
        if (!mainWindow) return
        mainWindow.hide()
      },
    },
    {
      role: 'minimize',
      visible: !config.store.get('isMenuBarMode'),
    },
    {
      type: 'checkbox',
      label: 'Maximize',
      visible: !config.store.get('isMenuBarMode'), // && _mainWindow && _mainWindow.isMaximizable(),
      enabled,
      checked: _mainWindow && _mainWindow.isMaximized(),
      click(item) {
        const mainWindow = window.getMainWindow()
        if (!mainWindow) return

        helpers.showWindow(mainWindow)

        if (item.checked) mainWindow.maximize()
        else mainWindow.unmaximize()
      },
    },
    {
      visible:
        !config.store.get('isMenuBarMode') ||
        (_mainWindow && _mainWindow.isFullScreen()),
      role: 'togglefullscreen',
    },
  ]

  return menuItems
}

export function getTrayMenuItems() {
  const _mainWindow = window.getMainWindow()
  const isCurrentWindow =
    _mainWindow && _mainWindow.isVisible() && !_mainWindow.isMinimized()
  const enabled = isCurrentWindow || !!config.store.get('isMenuBarMode')

  const menuItems: MenuItemConstructorOptions[] = [
    {
      label: 'Open',
      visible: !isCurrentWindow,
      click() {
        const mainWindow = window.getMainWindow()
        if (!mainWindow) return
        helpers.showWindow(mainWindow)
      },
    },
    {
      type: 'separator',
      visible: !isCurrentWindow,
    },
    ...(getOpenAtLoginMenuItem()
      ? ([
          getOpenAtLoginMenuItem(),
          { type: 'separator' },
        ] as MenuItemConstructorOptions[])
      : []),
    ...getOptionsMenuItems(),
    { type: 'separator' },
    getUpdaterMenuItem(),
    {
      type: 'separator',
      enabled,
      visible: !config.store.get('isMenuBarMode'),
    },
    ...getWindowMenuItems().filter(
      item => item.label !== 'Close' && item.visible !== false,
    ),
    {
      type: 'separator',
      enabled,
    },
    getRestartMenuItem(),
    {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      role: 'quit',
    },
  ].filter(Boolean) as MenuItemConstructorOptions[]

  return menuItems
}

export function getTrayContextMenu() {
  return Menu.buildFromTemplate(getTrayMenuItems())
}

export function updateMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate(getMainMenuItems()))

  if (process.platform === 'linux') {
    const _tray = tray.getTray()
    if (_tray) _tray.setContextMenu(getTrayContextMenu())
  }

  if (process.platform === 'darwin') {
    const touchBar = new TouchBar({
      items: [],
    })

    const mainWindow = window.getMainWindow()
    if (mainWindow) mainWindow.setTouchBar(touchBar)
  }

  const _dock = dock.getDock()
  if (_dock) {
    _dock.setMenu(Menu.buildFromTemplate(getDockMenuItems()))
  }
}
