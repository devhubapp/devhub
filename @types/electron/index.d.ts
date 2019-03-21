/// <reference path="../../node_modules/electron/electron.d.ts" />

interface Window {
  devhub?: boolean
  eval: never
  ipc: Electron.IpcRenderer
  process?: {
    type?: string
  }
  require: NodeRequireFunction
}

declare namespace NodeJS {
  interface ProcessVersions {
    electron?: boolean
  }
}
