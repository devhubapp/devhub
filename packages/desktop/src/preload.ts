import { ipcRenderer } from 'electron'

window.devhub = true

// Communication between webapp and electron main process
window.ipc = ipcRenderer

if (window.ipc) {
  window.ipc.on('post-message', (_e: any, message: any) => {
    window.postMessage(message, '*')
  })
}
