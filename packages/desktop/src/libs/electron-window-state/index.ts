// Modified version of: https://github.com/mawie81/electron-window-state

import electron from 'electron'
import jsonfile from 'jsonfile'
import mkdirp from 'mkdirp'
import path from 'path'

export interface WindowStateOptions {
  /** The height that should be returned if no file exists yet. Defaults to `600`. */
  defaultHeight?: number
  /** The width that should be returned if no file exists yet. Defaults to `800`. */
  defaultWidth?: number
  /** Should we automatically restore the window to full screen, if it was last closed full screen. Defaults to `true`. */
  fullScreen?: boolean
  /** The path where the state file should be written to. Defaults to `app.getPath('userData')`. */
  path?: string
  /** The name of file. Defaults to `window-state.json`. */
  file?: string
  /** Should we automatically maximize the window, if it was last closed maximized. Defaults to `true`. */
  maximize?: boolean
}

export interface WindowInternalState {
  displayBounds: {
    height: number
    width: number
  }
  /** The saved height of loaded state. `defaultHeight` if the state has not been saved yet. */
  height: number
  /** true if the window state was saved while the window was in full screen mode. `undefined` if the state has not been saved yet. */
  isFullScreen: boolean
  /** `true` if the window state was saved while the window was maximized. `undefined` if the state has not been saved yet. */
  isMaximized: boolean
  /** The saved width of loaded state. `defaultWidth` if the state has not been saved yet. */
  width: number
  /** The saved x coordinate of the loaded state. `undefined` if the state has not been saved yet. */
  x: number
  /** The saved y coordinate of the loaded state. `undefined` if the state has not been saved yet. */
  y: number
}

export interface WindowState extends WindowInternalState {
  /** Register listeners on the given `BrowserWindow` for events that are related to size or position changes (resize, move). It will also restore the window's maximized or full screen state. When the window is closed we automatically remove the listeners and save the state. */
  manage: (window: Electron.BrowserWindow) => void
  /** Removes all listeners of the managed `BrowserWindow` in case it does not need to be managed anymore. */
  unmanage: () => void
}

export function windowStateKeeper(options: WindowStateOptions): WindowState {
  const app = electron.app || electron.remote.app
  const screen = electron.screen || electron.remote.screen

  let state: WindowInternalState
  let winRef: Electron.BrowserWindow | null = null
  let updateStateTimer: number
  let saveStateTimer: number

  const updateStateDelay = 100
  const saveStateDelay = 500

  const config = Object.assign(
    {
      file: 'window-state.json',
      path: app.getPath('userData'),
      maximize: true,
      fullScreen: true,
    },
    options,
  )

  const fullStoreFileName = path.join(config.path, config.file)

  function isNormal(win: Electron.BrowserWindow) {
    return !win.isMaximized() && !win.isMinimized() && !win.isFullScreen()
  }

  function hasBounds() {
    return (
      state &&
      Number.isInteger(state.x) &&
      Number.isInteger(state.y) &&
      Number.isInteger(state.width) &&
      state.width > 0 &&
      Number.isInteger(state.height) &&
      state.height > 0
    )
  }

  function resetStateToDefault() {
    const displayBounds = screen.getPrimaryDisplay().bounds

    // Reset state to default values on the primary display
    state = {
      displayBounds,
      x: 0,
      y: 0,
      width: config.defaultWidth || 800,
      height: config.defaultHeight || 600,
      isFullScreen: false,
      isMaximized: false,
    }
  }

  function windowWithinBounds(bounds: Electron.Rectangle) {
    return (
      state.x >= bounds.x &&
      state.y >= bounds.y &&
      state.x + state.width <= bounds.x + bounds.width &&
      state.y + state.height <= bounds.y + bounds.height
    )
  }

  function ensureWindowVisibleOnSomeDisplay() {
    const visible = screen.getAllDisplays().some(display => {
      return windowWithinBounds(display.bounds)
    })

    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetStateToDefault()
    }
  }

  function validateState() {
    const isValid =
      state && (hasBounds() || state.isMaximized || state.isFullScreen)

    if (!isValid) {
      resetStateToDefault()
      return
    }

    if (hasBounds() && state.displayBounds) {
      ensureWindowVisibleOnSomeDisplay()
    }
  }

  function updateState(_win?: Electron.BrowserWindow) {
    const win = _win || winRef

    if (!win) {
      return
    }

    // Don't throw an error when window was closed
    try {
      const winBounds = win.getBounds()

      if (isNormal(win)) {
        state.x = winBounds.x
        state.y = winBounds.y
        state.width = winBounds.width
        state.height = winBounds.height
      }

      state.isMaximized = win.isMaximized()
      state.isFullScreen = win.isFullScreen()
      state.displayBounds = screen.getDisplayMatching(winBounds).bounds
    } catch (err) {
      //
    }
  }

  function saveState(win?: Electron.BrowserWindow) {
    // Update window state only if it was provided
    if (win) {
      updateState(win)
    }

    // Save state
    try {
      mkdirp.sync(path.dirname(fullStoreFileName))
      jsonfile.writeFileSync(fullStoreFileName, state)
    } catch (err) {
      //
    }
  }

  function stateChangeHandler() {
    // Handles both 'resize' and 'move'
    clearTimeout(updateStateTimer)
    clearTimeout(saveStateTimer)

    updateStateTimer = setTimeout(updateState, updateStateDelay)
    saveStateTimer = setTimeout(saveState, saveStateDelay)
  }

  function closeHandler() {
    updateState()
  }

  function closedHandler() {
    // Unregister listeners and save state
    unmanage()
    saveState()
  }

  function manage(win: Electron.BrowserWindow) {
    winRef = win

    if (config.maximize && state.isMaximized) {
      win.maximize()
    }

    if (config.fullScreen && state.isFullScreen) {
      win.setFullScreen(true)
    }

    win.on('resize', stateChangeHandler)
    win.on('move', stateChangeHandler)
    win.on('close', closeHandler)
    win.on('closed', closedHandler)
  }

  function unmanage() {
    if (winRef) {
      clearTimeout(updateStateTimer)
      winRef.removeListener('resize', stateChangeHandler)
      winRef.removeListener('move', stateChangeHandler)
      winRef.removeListener('close', closeHandler)
      winRef.removeListener('closed', closedHandler)
      winRef = null
    }
  }

  // Load previous state
  try {
    state = jsonfile.readFileSync(fullStoreFileName)
  } catch (err) {
    //
  }

  // Check state validity
  validateState()

  // Set state fallback values
  state = Object.assign(
    {
      width: config.defaultWidth || 800,
      height: config.defaultHeight || 600,
    },
    state!,
  )

  return {
    get x() {
      return state.x
    },
    get y() {
      return state.y
    },
    get width() {
      return state.width
    },
    get height() {
      return state.height
    },
    get displayBounds() {
      return state.displayBounds
    },
    get isMaximized() {
      return state.isMaximized
    },
    get isFullScreen() {
      return state.isFullScreen
    },
    manage,
    unmanage,
  }
}
