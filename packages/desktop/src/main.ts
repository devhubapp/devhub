import { app, BrowserWindow, nativeImage, TouchBar } from 'electron'

let mainWindow: any

function createWindow() {
  // Create a new window
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    // Don't show the window until it ready, this prevents any white flickering
    show: false,
  })

  const url = 'https://devhubapp.com'
  mainWindow.loadURL(url)

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

// Wait until the app is ready
app.on('ready', () => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

if (process.platform === 'darwin') {
  app.setAboutPanelOptions({
    applicationName: 'devhub',
    applicationVersion: app.getVersion(),
    copyright: 'Copyright 2018',
    credits: 'devhub',
  })
}
