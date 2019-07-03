import { BrowserWindow, screen } from 'electron'

export function getDisplayFromCursor() {
  return screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
}

export function getDisplayFromWindow(win: BrowserWindow) {
  const windowBounds = win.getBounds()
  return screen.getDisplayNearestPoint({
    x: windowBounds.x,
    y: windowBounds.y,
  })
}
