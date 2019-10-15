import React, { useEffect, useState } from 'react'

import { useDesktopOptions } from '../hooks/use-desktop-options'
import { Platform } from '../libs/platform'

export function ElectronTitleBar() {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const { isMenuBarMode } = useDesktopOptions()

  useEffect(() => {
    const handler = (_e: any, value: boolean | unknown) => {
      setIsFullScreen(value === true)
    }

    // TODO: Fix. Not working.
    window.ipc.addListener('fullscreenchange', handler)

    return () => {
      window.ipc.removeListener('fullscreenchange', handler)
    }
  }, [])

  if (
    !(
      Platform.isElectron && getElectronTitleBarHeight({ isMenuBarMode }) > 0
    ) ||
    isFullScreen
  )
    return null

  const height = getElectronTitleBarHeight({ isMenuBarMode })

  return (
    <>
      <div
        id="title-bar"
        onDoubleClick={() => {
          window.ipc.send('handle-title-bar-double-click')
        }}
      />

      <style>
        {`
        #title-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: ${height}px;
          -webkit-app-region: drag;
          z-index: 9999;
        }
        `}
      </style>
    </>
  )
}

export function getElectronTitleBarHeight({
  isMenuBarMode,
}: {
  isMenuBarMode: boolean
}) {
  if (!Platform.isElectron || isMenuBarMode) return 0
  if (Platform.realOS === 'macos') return 22
  return 0
}
