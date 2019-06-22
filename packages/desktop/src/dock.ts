import { app, Dock } from 'electron'

export function getDock(): Dock | null {
  return app.dock
}
