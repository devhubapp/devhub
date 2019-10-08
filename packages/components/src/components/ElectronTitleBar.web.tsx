import React, { useEffect, useState } from 'react'

import { Platform } from '../libs/platform'
import { useTheme } from './context/ThemeContext'
import { getThemeColorOrItself } from './themed/helpers'

export function ElectronTitleBar() {
  const theme = useTheme()

  const [isFullScreen, setIsFullScreen] = useState(false)

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
      Platform.isElectron &&
      Platform.realOS === 'macos' &&
      getElectronTitleBarHeight() > 0
    ) ||
    isFullScreen
  )
    return null

  return (
    <div
      id="title-bar"
      onDoubleClick={() => {
        window.ipc.send('handle-title-bar-double-click')
      }}
      style={{
        width: '100%',
        height: `${getElectronTitleBarHeight()}px`,
        borderBottom: `1px solid ${getThemeColorOrItself(
          theme,
          'backgroundColorDarker2',
          { enableCSSVariable: true },
        )}`,
        backgroundColor: theme.backgroundColorDarker1,
        ['-webkit-app-region' as any]: 'drag',
      }}
    />
  )
}

export function getElectronTitleBarHeight() {
  if (Platform.realOS === 'macos') return 20
  return 0
}
