import {
  app,
  BrowserWindow,
  Menu,
  nativeImage,
  screen,
  shell,
  TouchBar,
  Tray,
} from 'electron'
import Store from 'electron-store'
import path from 'path'

import { __DEV__ } from './libs/electron-is-dev'
import { WindowState, windowStateKeeper } from './libs/electron-window-state'

const config = new Store({
  defaults: {
    isMenuBarMode: false,
    lockOnCenter: false,
  },
})

const dock: Electron.Dock | null = app.dock || null
let mainWindow: Electron.BrowserWindow
let tray: Electron.Tray | null = null

let mainWindowState: WindowState
let menubarWindowState: WindowState

const startURL = __DEV__
  ? `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`
  : `file://${path.join(__dirname, 'web/index.html')}`

function getBrowserWindowOptions() {
  if (!mainWindowState) {
    mainWindowState = windowStateKeeper({
      defaultWidth: screen.getPrimaryDisplay().workAreaSize.width,
      defaultHeight: screen.getPrimaryDisplay().workAreaSize.height,
      file: 'main-window.json',
    })
  }

  if (!menubarWindowState) {
    menubarWindowState = windowStateKeeper({
      defaultWidth: 340,
      defaultHeight: 550,
      file: 'menubar-window.json',
    })
  }

  const options: Electron.BrowserWindowConstructorOptions = {
    minWidth: 320,
    minHeight: 450,
    backgroundColor: '#292c33',
    darkTheme: true,
    fullscreenable: true,
    resizable: true,
    show: true,
    title: 'DevHub',
    webPreferences: {
      affinity: 'main-window',
      backgroundThrottling: false,
      nativeWindowOpen: true,
      nodeIntegration: true,
    },
    ...(config.get('isMenuBarMode')
      ? {
          x: menubarWindowState.x,
          y: menubarWindowState.y,
          width: menubarWindowState.width,
          height: menubarWindowState.height,
          alwaysOnTop: true,
          center: false,
          frame: false,
          maxWidth: screen.getPrimaryDisplay().workAreaSize.width * 0.8,
          maxHeight: screen.getPrimaryDisplay().workAreaSize.height * 0.8,
          movable: false,
          skipTaskbar: true,
        }
      : {
          x: mainWindowState.x,
          y: mainWindowState.y,
          width: mainWindowState.width,
          height: mainWindowState.height,
          alwaysOnTop: false,
          center: true,
          frame: process.platform !== 'darwin',
          maxWidth: undefined,
          maxHeight: undefined,
          movable: !config.get('lockOnCenter'),
          skipTaskbar: false,
        }),
  }

  return options
}

function createWindow() {
  const win = new BrowserWindow(getBrowserWindowOptions())

  win.loadURL(startURL)

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('show', () => {
    updateTrayHightlightMode()
    updateBrowserWindowOptions()
  })

  win.on('hide', () => {
    if (tray) tray.setHighlightMode('selection')
  })

  win.on('closed', () => {
    win.destroy()
  })

  win.on('resize', () => {
    if (config.get('isMenuBarMode')) {
      alignWindowWithTray()
    } else if (config.get('lockOnCenter')) {
      win.center()
    }
  })

  win.on('blur', () => {
    setTimeout(() => {
      if (config.get('isMenuBarMode')) win.hide()
    }, 200)
  })

  win.on('enter-full-screen', () => {
    if (dock) dock.show()
  })

  win.on('leave-full-screen', () => {
    update()
  })

  return win
}

function showTrayContextPopup() {
  tray!.popUpContextMenu(getTrayContextMenu())
}

function createTray() {
  const trayIcon = nativeImage.createFromPath(
    path.join(
      __dirname,
      `../assets/icons/${
        process.platform === 'win32' ? 'trayIconWhite' : 'trayIconTemplate'
      }.png`,
    ),
  )

  if (tray && !tray.isDestroyed()) tray.destroy()

  tray = new Tray(trayIcon)

  tray.on('click', () => {
    if (mainWindow.isFullScreen()) {
      showTrayContextPopup()
      return
    }

    if (mainWindow.isVisible() && !mainWindow.isMinimized()) {
      if (mainWindow.isFocused() || process.platform !== 'darwin') {
        if (config.get('isMenuBarMode')) {
          mainWindow.hide()
        } else {
          showTrayContextPopup()
        }

        return
      }
    }

    mainWindow.show()
  })

  tray.on('right-click', () => {
    showTrayContextPopup()
  })
}

function init() {
  app.setName('DevHub')

  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    app.quit()
    return
  }

  app.on('second-instance', (event, argv, _workingDirectory) => {
    if (!mainWindow) return

    mainWindow.show()

    app.emit('open-url', event, __DEV__ ? argv[2] : argv[1])
  })

  app.on('ready', () => {
    app.removeAsDefaultProtocolClient('devhub')

    if (__DEV__ && process.platform === 'win32') {
      app.setAsDefaultProtocolClient('devhub', process.execPath, [
        path.resolve(process.argv[1]),
      ])
    } else {
      app.setAsDefaultProtocolClient('devhub')
    }

    createTray()
    if (!mainWindow) mainWindow = createWindow()
    update()

    if (process.platform === 'darwin') {
      app.setAboutPanelOptions({
        applicationName: 'DevHub',
        applicationVersion: app.getVersion(),
        copyright: 'Copyright 2018',
        credits: 'devhub',
      })
    }
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (!mainWindow) mainWindow = createWindow()

    mainWindow.show()
  })

  app.on('web-contents-created', (_event, webContents) => {
    webContents.on(
      'new-window',
      (event, uri, _frameName, _disposition, _options) => {
        event.preventDefault()
        shell.openExternal(uri)
      },
    )
  })
}

function getCenterPosition(obj: Electron.BrowserWindow | Electron.Tray) {
  const bounds = obj.getBounds()

  const x = Math.round(bounds.x + bounds.width / 2)
  const y = Math.round(bounds.y + bounds.height / 2)

  return { x, y }
}

function alignWindowWithTray() {
  if (!(tray && !tray.isDestroyed())) return

  const screenSize = screen.getPrimaryDisplay().size
  const workArea = screen.getPrimaryDisplay().workArea
  const windowBounds = mainWindow.getBounds()
  const trayBounds = tray.getBounds()
  const trayCenter = getCenterPosition(tray)

  const top = trayBounds.y < screenSize.height / 3
  const bottom = screenSize.height - trayBounds.y < screenSize.height / 3
  const left = trayBounds.x < screenSize.width / 3
  const right = screenSize.width - trayBounds.x < screenSize.width / 3

  let x: number
  let y: number
  const spacing = 8

  if (top) {
    y = Math.round(trayCenter.y)
  } else if (bottom) {
    y = Math.round(trayCenter.y - windowBounds.height / 2)
  } else {
    y = Math.round(trayCenter.y - windowBounds.height / 2)
  }

  if (left) {
    x = Math.round(trayCenter.x)
  } else if (right) {
    x = Math.round(trayCenter.x - windowBounds.width / 2)
  } else {
    x = Math.round(trayCenter.x - windowBounds.width / 2)
  }

  const fixedX = Math.max(
    workArea.x + spacing,
    Math.min(x, workArea.x + workArea.width - windowBounds.width - spacing),
  )
  const fixedY = Math.max(
    workArea.y + spacing,
    Math.min(y, workArea.y + workArea.height - windowBounds.height - spacing),
  )

  mainWindow.setPosition(fixedX, fixedY)
}

function getModeMenuItems() {
  const isCurrentWindow = mainWindow.isVisible() && !mainWindow.isMinimized()
  const enabled = isCurrentWindow || config.get('isMenuBarMode')

  const menuItems: Electron.MenuItemConstructorOptions[] = [
    {
      type: 'radio',
      label: 'Desktop mode',
      checked: !config.get('isMenuBarMode'),
      enabled,
      click() {
        enableDesktopMode()
      },
    },
    {
      type: 'radio',
      label: 'Menubar mode',
      checked: !!config.get('isMenuBarMode'),
      enabled,
      click() {
        enableMenuBarMode()
      },
    },
  ]

  return menuItems
}
function getOptionsMenuItems() {
  const isCurrentWindow = mainWindow.isVisible() && !mainWindow.isMinimized()
  const enabled = isCurrentWindow || config.get('isMenuBarMode')

  const menuItems: Electron.MenuItemConstructorOptions[] = [
    {
      type: 'checkbox',
      label: 'Lock on center',
      checked: config.get('lockOnCenter'),
      enabled,
      visible: !config.get('isMenuBarMode'),
      click(item) {
        config.set('lockOnCenter', item.checked)

        if (item.checked) {
          if (!config.get('isMenuBarMode')) {
            mainWindow.setMovable(false)
          }

          mainWindow.center()
        } else {
          if (!config.get('isMenuBarMode')) {
            mainWindow.setMovable(getBrowserWindowOptions().movable !== false)
          }
        }
      },
    },
  ]

  return menuItems
}

function getMainMenuItems() {
  const isCurrentWindow = mainWindow.isVisible() && !mainWindow.isMinimized()
  const enabled = isCurrentWindow || config.get('isMenuBarMode')

  const menuItems: Electron.MenuItemConstructorOptions[] = [
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
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click(_, focusedWindow) {
            if (focusedWindow) focusedWindow.reload()
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: __DEV__
            ? process.platform === 'darwin'
              ? 'Alt+Command+I'
              : 'Ctrl+Shift+I'
            : undefined,
          visible: __DEV__,
          click(_, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
          },
        },
        {
          type: 'separator',
          enabled,
        },
        ...getModeMenuItems(),
        {
          type: 'separator',
          enabled,
        },
        ...getOptionsMenuItems(),
      ],
    },
    {
      label: 'Window',
      role: 'window',
      submenu: getWindowMenuItems(),
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
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
  ]

  if (process.platform === 'darwin') {
    const name = app.getName()

    menuItems.unshift({
      label: name,
      submenu: [
        {
          label: `About ${name}`,
          role: 'about',
        },
        {
          label: 'View on GitHub',
          click: () => {
            shell.openExternal('https://github.com/devhubapp/devhub')
          },
        },
        {
          type: 'separator',
        },
        {
          label: `Hide ${name}`,
          accelerator: 'Command+H',
          role: 'hide',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideothers',
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit()
          },
        },
      ],
    })
  }

  return menuItems
}

function getDockMenuItems() {
  return getModeMenuItems()
}

function getWindowMenuItems() {
  const isCurrentWindow = mainWindow.isVisible() && !mainWindow.isMinimized()
  const enabled = isCurrentWindow || config.get('isMenuBarMode')

  const menuItems: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      click() {
        mainWindow.hide()
      },
    },
    {
      label: 'Minimize',
      accelerator: config.get('isMenuBarMode') ? undefined : 'CmdOrCtrl+M',
      role: config.get('isMenuBarMode') ? undefined : 'minimize',
      enabled: enabled && !mainWindow.isMinimized(),
      visible: !config.get('isMenuBarMode'), // && mainWindow.isMinimizable(),
    },
    {
      label: 'Maximize',
      visible: !config.get('isMenuBarMode'), // && mainWindow.isMaximizable(),
      enabled, // && !mainWindow.isMaximized(),
      click() {
        if (!mainWindow.isVisible()) {
          mainWindow.show()
        }

        mainWindow.maximize()
      },
    },
    {
      type: 'checkbox',
      label: 'Full Screen',
      accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
      checked: mainWindow.isFullScreen(),
      enabled: enabled || mainWindow.isFullScreen(),
      click(item) {
        mainWindow.setFullScreen(item.checked)
      },
    },
  ]

  return menuItems
}

function getTrayMenuItems() {
  const isCurrentWindow = mainWindow.isVisible() && !mainWindow.isMinimized()
  const enabled = isCurrentWindow || config.get('isMenuBarMode')

  const menuItems: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Open',
      visible: !isCurrentWindow || config.get('isMenuBarMode'),
      click() {
        mainWindow.show()
      },
    },
    {
      type: 'separator',
      visible: !isCurrentWindow || config.get('isMenuBarMode'),
    },
    ...getModeMenuItems(),
    {
      type: 'separator',
      enabled,
    },
    ...getOptionsMenuItems(),
    {
      type: 'separator',
      enabled,
      visible: !config.get('isMenuBarMode'),
    },
    ...getWindowMenuItems().filter(item => item.label !== 'Close'),
    {
      type: 'separator',
      enabled,
    },
    {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      role: 'quit',
    },
  ]

  return menuItems
}

function getTrayContextMenu() {
  return Menu.buildFromTemplate(getTrayMenuItems())
}

function updateTrayHightlightMode() {
  if (!(tray && !tray.isDestroyed())) return

  tray.setHighlightMode(
    config.get('isMenuBarMode') &&
      mainWindow.isVisible() &&
      mainWindow.isFocused() &&
      !mainWindow.isFullScreen()
      ? 'always'
      : 'selection',
  )
}

function updateBrowserWindowOptions() {
  const options = getBrowserWindowOptions()

  mainWindow.setAlwaysOnTop(options.alwaysOnTop === true)

  mainWindow.setMinimumSize(
    Math.floor(options.minWidth || 0),
    Math.floor(options.minHeight || 0),
  )

  mainWindow.setMaximumSize(
    Math.ceil(
      options.maxWidth ||
        (process.platform === 'darwin'
          ? screen.getPrimaryDisplay().workAreaSize.width
          : 0),
    ),
    Math.ceil(
      options.maxHeight ||
        (process.platform === 'darwin'
          ? screen.getPrimaryDisplay().workAreaSize.height
          : 0),
    ),
  )

  mainWindow.setMovable(options.movable !== false)

  mainWindow.setPosition(options.x || 0, options.y || 0, false)

  mainWindow.setSkipTaskbar(options.skipTaskbar === true)

  mainWindow.setSize(options.width || 500, options.height || 500, false)

  if (dock) {
    if (options.skipTaskbar === true) {
      dock.hide()
    } else {
      dock.show()
    }
  }

  mainWindowState.unmanage()
  menubarWindowState.unmanage()
  if (config.get('isMenuBarMode')) {
    menubarWindowState.manage(mainWindow)
  } else {
    mainWindowState.manage(mainWindow)
  }

  if (config.get('isMenuBarMode')) {
    alignWindowWithTray()
  } else if (config.get('lockOnCenter')) {
    mainWindow.center()
  }
}

function updateMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate(getMainMenuItems()))

  if (process.platform === 'darwin') {
    const touchBar = new TouchBar({
      items: [],
    })

    mainWindow.setTouchBar(touchBar)
  }

  if (dock) dock.setMenu(Menu.buildFromTemplate(getDockMenuItems()))
}

function update() {
  if (mainWindow.isFullScreen()) {
    mainWindow.setFullScreen(false)
    return
  }

  mainWindow.show()

  updateMenu()
  updateTrayHightlightMode()
  updateBrowserWindowOptions()
}

function updateOrRecreateWindow() {
  if (process.platform !== 'darwin') {
    const oldWindow = mainWindow
    mainWindow = createWindow()
    oldWindow.close()
  }

  update()
}

function enableDesktopMode() {
  config.set('isMenuBarMode', false)
  updateOrRecreateWindow()
}

function enableMenuBarMode() {
  config.set('isMenuBarMode', true)
  updateOrRecreateWindow()
}

init()
