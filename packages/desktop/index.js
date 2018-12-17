const { app, BrowserWindow } = require('electron') // http://electron.atom.io/docs/api

let mainWindow = null

function createWindow() {
    // Create a new window
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        // Don't show the window until it ready, this prevents any white flickering
        show: false
    })

    // URL is argument to npm start
    const url = 'https://devhubapp.com'
    mainWindow.loadURL(url)

    mainWindow.on('closed', () => mainWindow = null)

    // Show window when page is ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
}

// Wait until the app is ready
app.on('ready', () => createWindow())

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
