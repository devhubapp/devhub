declare module 'electron-timber' {
  export interface Logger {
    log: typeof console.log
    warn: typeof console.warn
    error: typeof console.error
    time: typeof console.time
    timeEnd: typeof console.timeEnd
  }

  declare const logger: Logger

  export default logger
}
