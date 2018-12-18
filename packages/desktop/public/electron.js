const { app, BrowserWindow, TouchBar, Menu, Tray, nativeImage } = require('electron')
const path = require('path')

let mainWindow = null
let trayWindow = null
let tray = null

var template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      },
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function (item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.reload();
        }
      },
      {
        label: 'Toggle Full Screen',
        accelerator: (function () {
          if (process.platform == 'darwin')
            return 'Ctrl+Command+F';
          else
            return 'F11';
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (function () {
          if (process.platform == 'darwin')
            return 'Alt+Command+I';
          else
            return 'Ctrl+Shift+I';
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.toggleDevTools();
        }
      },
    ]
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
    ]
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: function () { require('electron').shell.openExternal('https://devhubapp.com') }
      },
    ]
  },
];

if (process.platform == 'darwin') {
  var name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function () { app.quit(); }
      },
    ]
  });
  // Window menu.
  template[3].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  );
}

function createWindow() {
  // Create a new window
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    // Don't show the window until it ready, this prevents any white flickering
    show: false,
    nodeIntegration: false
  })

  mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // Show window when page is ready
  mainWindow.once('ready-to-show', () => {
  mainWindow.show()
  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
    if (process.platform === 'darwin') {
      const spin = new TouchBar.TouchBarButton({
        label: 'devhub',
      })

      const touchBar = new TouchBar({
        items: [spin],
      })
      mainWindow.setTouchBar(touchBar)
    }
  })
}

function createTrayWindow() {
  trayWindow = new BrowserWindow({
    width: 350,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    webPreferences: {
      backgroundThrottling: false
    }
  })
  trayWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)

  trayWindow.once('ready-to-show', () => {
    const position = getWindowPosition()
    trayWindow.setPosition(position.x, position.y, false)
    trayWindow.show()
    trayWindow.focus()
  })
  // Hide the window when it loses focus
  trayWindow.on('blur', () => {
    trayWindow.hide()
  })
}

function createTray() {
  const trayIcon = nativeImage.createFromPath(`${path.join(__dirname, '../build/static/media/logo.png')}`)
  tray = new Tray(trayIcon.resize({
    width: 22,
    height: 22
  }))

  var trayMenuTemplate = [
    {
      label: 'Devhub',
      click: function () {
        trayWindow.hide()
        toggleMainWindow()
      }
    },
    {
      label: 'Setting',
      click: function () { }
    },
    {
      label: 'Help',
      click: function () { }
    },
    {
      label: 'About',
      click: function () {

      }
    },
    {
      label: 'Quit',
      click: function () {
        app.quit();
      }
    }
  ];
  tray.setToolTip(app.getName())

  tray.on('click', () => {
    toggleWindow()
  })

  tray.on('right-click', () => {
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
    tray.popUpContextMenu(contextMenu)
  })
}

// Wait until the app is ready
app.on('ready', () => {
  createTray()
  createTrayWindow()
  if (process.platform == 'darwin') {
    app.setAboutPanelOptions({
      applicationName: 'devhub',
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
  if (trayWindow === null) {
    createTray()
  }
})

function getWindowPosition() {
  const windowBounds = trayWindow.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return { x: x, y: y }
}

// toggle window
function toggleWindow() {
  if (trayWindow.isVisible()) {
    trayWindow.hide()
  } else {
    showTrayWindow()
  }
}

// toggle main window
function toggleMainWindow() {
  if (mainWindow === null) {
    createWindow()
  } else if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
  }
}

function showTrayWindow() {
  const position = getWindowPosition()
  trayWindow.setPosition(position.x, position.y, false)
  trayWindow.show()
  trayWindow.focus()
}