import electron from 'electron'

// Communication between webapp and electron main process
// Used on oauth flow
window.ipc = electron.ipcRenderer
