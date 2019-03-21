import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  nativeImage,
  screen,
  shell,
  TouchBar,
  Tray,
} from 'electron'
import Store from 'electron-store'
import { autoUpdater } from 'electron-updater'
import path from 'path'
import url from 'url'

import { __DEV__ } from './libs/electron-is-dev'
import { WindowState, windowStateKeeper } from './libs/electron-window-state'

const FEATURE_FLAGS = {
  LOCK_ON_CENTER: process.platform !== 'linux',
}

const config = new Store({
  defaults: {
    isMenuBarMode: false,
    launchCount: 0,
    lockOnCenter: false,
  },
})

if (!FEATURE_FLAGS.LOCK_ON_CENTER && config.get('lockOnCenter')) {
  config.set('lockOnCenter', false)
}

const frameIsDifferentBetweenModes = process.platform !== 'darwin'

const dock: Electron.Dock | null = app.dock || null
let mainWindow: Electron.BrowserWindow
let tray: Electron.Tray | null = null

let mainWindowState: WindowState
let menubarWindowState: WindowState

let updateInfo: {
  state:
    | 'not-checked'
    | 'error'
    | 'checking-for-update'
    | 'update-not-available'
    | 'update-available'
    | 'downloading'
    | 'update-downloaded'
  date: number
  progress?: number
  lastManuallyCheckedAt?: number
} = {
  state: 'not-checked',
  date: Date.now(),
}

const startURL = __DEV__
  ? 'http://localhost:3000'
  : `file://${path.join(__dirname, 'web/index.html')}`

function setupBrowserExtensions() {
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
  } = require('electron-devtools-installer') // tslint:disable-line no-var-requires

  installExtension(REACT_DEVELOPER_TOOLS).catch(console.error)
  installExtension(REDUX_DEVTOOLS).catch(console.error)
}

function getBrowserWindowOptions() {
  if (!mainWindowState) {
    mainWindowState = windowStateKeeper({
      defaultWidth: screen.getPrimaryDisplay().workAreaSize.width,
      defaultHeight:
        screen.getPrimaryDisplay().workAreaSize.height -
        (process.platform === 'linux' ? 28 : 0),
      file: 'main-window.json',
      fullScreen: false,
    })
  }

  if (!menubarWindowState) {
    menubarWindowState = windowStateKeeper({
      defaultWidth: 380,
      defaultHeight: 600,
      file: 'menubar-window.json',
      fullScreen: false,
    })
  }

  const options: Electron.BrowserWindowConstructorOptions = {
    minWidth: 320,
    minHeight: 450,
    backgroundColor: '#292C33',
    darkTheme: true,
    icon:
      process.platform === 'darwin' || process.platform === 'win32'
        ? undefined
        : path.join(__dirname, '../assets/icons/icon.png'),
    resizable: true,
    show: true,
    title: 'DevHub',
    webPreferences: {
      affinity: 'main-window',
      backgroundThrottling: false,
      contextIsolation: false,
      nativeWindowOpen: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
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
          fullscreenable: false,
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
          frame: frameIsDifferentBetweenModes,
          fullscreenable: true,
          maxWidth: undefined,
          maxHeight: undefined,
          movable: !config.get('lockOnCenter'),
          skipTaskbar: false,
        }),
  }

  return options
}

function showWindow() {
  if (mainWindow.isMinimized()) mainWindow.restore()
  if (mainWindow.isVisible()) mainWindow.focus()
  else mainWindow.show()
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
      if (config.get('isMenuBarMode') && !win.isDestroyed()) win.hide()
    }, 200)
  })

  win.on('enter-full-screen', () => {
    if (dock) dock.show()
  })

  win.on('leave-full-screen', () => {
    if (!mainWindow.isFocused()) return
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
        process.platform === 'darwin' ? 'trayIconTemplate' : 'trayIconWhite'
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

    showWindow()
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

    showWindow()

    app.emit('open-url', event, __DEV__ ? argv[2] : argv[1])
  })

  app.on('ready', () => {
    config.set('launchCount', config.get('launchCount', 0) + 1)

    if (__DEV__ && process.platform === 'win32') {
      app.removeAsDefaultProtocolClient('devhub')
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
        copyright: 'Copyright 2019',
        credits: 'Bruno Lemos',
      })
    }

    if (__DEV__) {
      setupBrowserExtensions()
    } else {
      autoUpdater.autoDownload = true
      autoUpdater.autoInstallOnAppQuit = true
      autoUpdater.checkForUpdatesAndNotify()

      setInterval(() => {
        autoUpdater.checkForUpdatesAndNotify()
      }, 30 * 60000)

      let lastUpdaterMenuItem = getUpdaterMenuItem()
      setInterval(() => {
        const newUpdaterMenuItem = getUpdaterMenuItem()
        if (lastUpdaterMenuItem.label !== newUpdaterMenuItem.label) {
          lastUpdaterMenuItem = newUpdaterMenuItem
          updateMenu()
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
    if (!mainWindow) mainWindow = createWindow()

    mainWindow.show()
  })

  app.on('web-contents-created', (_event, webContents) => {
    webContents.on(
      'new-window',
      (event, uri, _frameName, _disposition, _options) => {
        if (
          !app.isDefaultProtocolClient('devhub') &&
          `${url.parse(uri).pathname || ''}`.startsWith('/oauth')
        )
          return

        event.preventDefault()
        shell.openExternal(uri)
      },
    )
  })

  app.on('open-url', (_event, uri) => {
    if (!mainWindow) return

    mainWindow.webContents.send('open-url', uri)
    showWindow()
  })

  ipcMain.on('can-open-url', (e: any, uri?: string) => {
    let returnValue = false

    if (!(e && uri && typeof uri === 'string')) returnValue = false
    else if (uri.startsWith('http://') || uri.startsWith('https://'))
      returnValue = true
    else if (uri.startsWith('devhub://'))
      returnValue = app.isDefaultProtocolClient('devhub')

    e.returnValue = returnValue
  })

  ipcMain.on('open-url', (_e: any, uri?: string) => {
    if (!mainWindow) return

    if (!(uri && typeof uri === 'string' && uri.startsWith('devhub://'))) return
    mainWindow.webContents.send('open-url', url)
  })

  ipcMain.on('post-message', (_e: any, data: any) => {
    if (!mainWindow) return

    mainWindow.webContents.send('post-message', data)
  })

  ipcMain.on('exit-full-screen', () => {
    if (!mainWindow) return
    mainWindow.setFullScreen(false)
  })

  autoUpdater.on('error', () => {
    updateInfo = { ...updateInfo, state: 'error', date: Date.now() }
    updateMenu()
  })

  autoUpdater.on('checking-for-update', () => {
    updateInfo = {
      ...updateInfo,
      state: 'checking-for-update',
      date: Date.now(),
    }
    updateMenu()
  })

  autoUpdater.on('update-not-available', () => {
    const fromManualCheck =
      updateInfo.lastManuallyCheckedAt &&
      Date.now() - updateInfo.lastManuallyCheckedAt < 10000

    updateInfo = {
      ...updateInfo,
      state: 'update-not-available',
      date: Date.now(),
    }
    updateMenu()

    if (fromManualCheck) {
      dialog.showMessageBox({
        message: 'There are currently no updates available.',
      })
    }
  })

  autoUpdater.on('update-available', () => {
    updateInfo = { ...updateInfo, state: 'update-available', date: Date.now() }
    updateMenu()
  })

  autoUpdater.on('download-progress', e => {
    updateInfo = {
      ...updateInfo,
      state: 'downloading',
      progress: e.percent,
      date: Date.now(),
    }
    updateMenu()
  })

  autoUpdater.on('update-downloaded', () => {
    updateInfo = { ...updateInfo, state: 'update-downloaded', date: Date.now() }
    updateMenu()
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

  const trayBounds = tray.getBounds()
  if (!(trayBounds.width && trayBounds.height)) {
    mainWindow.center()
    return
  }

  const screenSize = screen.getPrimaryDisplay().size
  const workArea = screen.getPrimaryDisplay().workArea
  const windowBounds = mainWindow.getBounds()
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

function getUpdaterMenuItem() {
  let enabled: boolean = !__DEV__
  let label: string

  let click: Electron.MenuItemConstructorOptions['click'] = () => {
    updateInfo.lastManuallyCheckedAt = Date.now()
    autoUpdater.checkForUpdatesAndNotify()
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
      label = autoUpdater.autoDownload
        ? 'Downloading updates...'
        : 'Update available. Please wait.'
      if (Date.now() - updateInfo.date < 10 * 60000) break
    }

    case 'update-downloaded': {
      if (!__DEV__) enabled = true
      label = 'Update downloaded. Click to restart.'

      click = () => {
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

  const menuItem: Electron.MenuItemConstructorOptions = {
    label,
    enabled,
    click,
  }

  return menuItem
}

function getAboutMenuItems() {
  const menuItems: Electron.MenuItemConstructorOptions[] = [
    ...(process.platform === 'darwin'
      ? [
          {
            label: `About ${app.getName()}`,
            role: 'about',
          },
        ]
      : []),
    {
      label: 'View on GitHub',
      click: () => {
        shell.openExternal('https://github.com/devhubapp/devhub')
      },
    },
    {
      type: 'separator',
    },
    getUpdaterMenuItem(),
  ]

  return menuItems
}

function getModeMenuItems() {
  if (
    !(tray && tray.getBounds().width && tray.getBounds().height) &&
    !config.get('isMenuBarMode')
  )
    return []

  const isCurrentWindow =
    mainWindow && mainWindow.isVisible() && !mainWindow.isMinimized()
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

function getWindowOptionsMenuItems() {
  const isCurrentWindow =
    mainWindow && mainWindow.isVisible() && !mainWindow.isMinimized()
  const enabled = isCurrentWindow || config.get('isMenuBarMode')

  const menuItems: Electron.MenuItemConstructorOptions[] = [
    FEATURE_FLAGS.LOCK_ON_CENTER
      ? ({
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
                mainWindow.setMovable(
                  getBrowserWindowOptions().movable !== false,
                )
              }
            }
          },
        } as Electron.MenuItemConstructorOptions)
      : (undefined as any),
  ].filter(Boolean)

  return menuItems
}

function getMainMenuItems() {
  const isCurrentWindow =
    mainWindow && mainWindow.isVisible() && !mainWindow.isMinimized()
  const enabled = isCurrentWindow || config.get('isMenuBarMode')

  const menuItems: Electron.MenuItemConstructorOptions[] = [
    ...(process.platform === 'darwin'
      ? ([
          {
            label: app.getName(),
            submenu: [
              ...getAboutMenuItems(),
              {
                type: 'separator',
              },
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
              {
                type: 'separator',
              },
              {
                label: 'Quit',
                role: 'quit',
                click: () => {
                  app.quit()
                },
              },
            ],
          },
        ] as Electron.MenuItemConstructorOptions[])
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
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click(_, focusedWindow) {
            if (focusedWindow) focusedWindow.reload()
          },
        },
        {
          label: 'Restart',
          click() {
            app.relaunch()
            app.quit()
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
        { type: 'separator', enabled },
        { role: 'resetzoom', enabled },
        { role: 'zoomin', enabled },
        { role: 'zoomout', enabled },
        { type: 'separator', enabled },
        ...getModeMenuItems(),
      ],
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        ...getWindowMenuItems(),
        { type: 'separator', enabled },
        ...getWindowOptionsMenuItems(),
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
              {
                type: 'separator',
              },
            ] as Electron.MenuItemConstructorOptions[])),
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

  return menuItems
}

function getDockMenuItems() {
  return getModeMenuItems()
}

function getWindowMenuItems() {
  const isCurrentWindow =
    mainWindow && mainWindow.isVisible() && !mainWindow.isMinimized()
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
      role: 'minimize',
      visible: !config.get('isMenuBarMode'),
    },
    {
      type: 'checkbox',
      label: 'Maximize',
      visible: !config.get('isMenuBarMode'), // && mainWindow && mainWindow.isMaximizable(),
      enabled,
      checked: mainWindow && mainWindow.isMaximized(),
      click(item) {
        showWindow()

        if (item.checked) mainWindow.maximize()
        else mainWindow.unmaximize()
      },
    },
    {
      visible: !config.get('isMenuBarMode'),
      role: 'togglefullscreen',
    },
  ]

  return menuItems
}

function getTrayMenuItems() {
  const isCurrentWindow =
    mainWindow && mainWindow.isVisible() && !mainWindow.isMinimized()
  const enabled = isCurrentWindow || config.get('isMenuBarMode')

  const menuItems: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Open',
      visible: !isCurrentWindow || config.get('isMenuBarMode'),
      click() {
        showWindow()
      },
    },
    {
      type: 'separator',
      visible: !isCurrentWindow || config.get('isMenuBarMode'),
    },
    ...(getModeMenuItems().length > 0
      ? [
          ...getModeMenuItems(),
          {
            type: 'separator',
            enabled,
          },
        ]
      : []),
    ...(getWindowOptionsMenuItems().length
      ? [
          ...getWindowOptionsMenuItems(),
          {
            type: 'separator',
            enabled,
            visible: !config.get('isMenuBarMode'),
          },
        ]
      : []),
    ...getWindowMenuItems().filter(
      item => item.label !== 'Close' && item.visible !== false,
    ),
    {
      type: 'separator',
      enabled,
    },
    {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      role: 'quit',
    },
  ].filter(Boolean) as Electron.MenuItemConstructorOptions[]

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

  const maximize =
    !config.get('isMenuBarMode') &&
    (mainWindow.isMaximized() ||
      mainWindowState.isMaximized ||
      config.get('launchCount') === 1)

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

  mainWindow.setPosition(
    maximize ? screen.getPrimaryDisplay().workArea.x || 0 : options.x || 0,
    maximize ? screen.getPrimaryDisplay().workArea.y || 0 : options.y || 0,
    false,
  )

  // Note: setSkipTaskbar was causing the app to freeze on linux
  if (process.platform === 'darwin' || process.platform === 'win32') {
    mainWindow.setSkipTaskbar(options.skipTaskbar === true)
  }

  if (maximize) {
    // Node: workAreaSize.heigth is wrong on linux, causing the app content to jump on window open
    if (process.platform !== 'linux') {
      mainWindow.setSize(
        screen.getPrimaryDisplay().workAreaSize.width,
        screen.getPrimaryDisplay().workAreaSize.height,
        false,
      )
    }
  } else {
    mainWindow.setSize(options.width || 500, options.height || 500, false)
  }

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
  } else {
    if (config.get('lockOnCenter')) {
      mainWindow.center()
    }

    if (maximize) {
      mainWindow.maximize()
    }
  }
}

function updateMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate(getMainMenuItems()))

  if (process.platform === 'linux') {
    tray!.setContextMenu(getTrayContextMenu())
  }

  if (process.platform === 'darwin') {
    const touchBar = new TouchBar({
      items: [],
    })

    mainWindow.setTouchBar(touchBar)
  }

  if (dock) dock.setMenu(Menu.buildFromTemplate(getDockMenuItems()))
}

function update() {
  showWindow()
  updateMenu()
  updateTrayHightlightMode()
  updateBrowserWindowOptions()
}

function updateOrRecreateWindow() {
  if (frameIsDifferentBetweenModes) {
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
