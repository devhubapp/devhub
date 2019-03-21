import electron from 'electron'

window.devhub = true

// Communication between webapp and electron main process
// Used on oauth flow
window.ipc = electron.ipcRenderer

if (window.ipc) {
  window.ipc.on('post-message', (_e: any, message: any) => {
    window.postMessage(message, '*')
  })
}
