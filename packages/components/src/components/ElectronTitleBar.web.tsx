import React, { useEffect, useState } from 'react'

import { useDesktopOptions } from '../hooks/use-desktop-options'
import { Platform } from '../libs/platform'
import { useTheme } from './context/ThemeContext'
import { getThemeColorOrItself } from './themed/helpers'

export function ElectronTitleBar() {
  const theme = useTheme()

  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(() =>
    window.ipc.sendSync('get-is-maximized'),
  )
  const { isMenuBarMode } = useDesktopOptions()

  useEffect(() => {
    const handler = (_e: any, value: boolean | unknown) => {
      setIsFullScreen(value === true)
    }

    window.ipc.addListener('fullscreen-change', handler)

    return () => {
      window.ipc.removeListener('fullscreen-change', handler)
    }
  }, [])

  useEffect(() => {
    const handler = (_e: any, value: boolean | unknown) => {
      setIsMaximized(value === true)
    }

    window.ipc.addListener('is-maximized-change', handler)

    return () => {
      window.ipc.removeListener('is-maximized-change', handler)
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
          window.ipc.send('toggle-maximize')
        }}
      >
        {Platform.realOS !== 'macos' && (
          <div className="buttons">
            <div
              className="button minimize"
              onClick={() => window.ipc.send('minimize')}
            >
              <svg x="0px" y="0px" viewBox="0 0 10.2 1">
                <rect x="0" y="50%" width="10.2" height="1" />
              </svg>
            </div>

            <div
              className="button maximize"
              onClick={() => window.ipc.send('toggle-maximize')}
            >
              {isMaximized ? (
                <svg viewBox="0 0 10.2 10.1">
                  <path d="M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z" />
                </svg>
              ) : (
                <svg viewBox="0 0 10 10">
                  <path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" />
                </svg>
              )}
            </div>

            <div
              className="button close"
              onClick={() => window.ipc.send('close')}
            >
              <svg viewBox="0 0 10 10">
                <polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
        #title-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: ${height}px;
          background-color: ${
            getThemeColorOrItself(theme, 'backgroundColorDarker1', {
              enableCSSVariable: true,
            }) || ''
          };
          -webkit-app-region: drag;
          z-index: 9999;
        }

        #title-bar > .buttons {
          display: flex;
          position: absolute;
          flex-direction: row;
          top: 0;
          right: 0;
          height: ${height}px;
          -webkit-app-region: no-drag;
        }

        #title-bar > .buttons > .button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${height * 1.5}px;
          height: ${height}px;
          margin-left: 1px;
          -webkit-app-region: no-drag;
        }

        #title-bar > .buttons > .button:hover {
          background-color: ${
            getThemeColorOrItself(
              theme,
              theme.isDark ? 'backgroundColorLess1' : 'backgroundColorLess3',
              { enableCSSVariable: true },
            ) || ''
          };
        }

        #title-bar > .buttons > .button.close:hover {
          background-color: #E90011;
        }

        #title-bar > .buttons > .button > svg {
          max-width: 12px;
          height: 10px;
          fill: ${
            getThemeColorOrItself(theme, 'foregroundColor', {
              enableCSSVariable: true,
            }) || ''
          };
        }

        #title-bar > .buttons > .button.close:hover > svg {
          fill: white;
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
  return 30
}
