import classNames from 'classnames'
import React from 'react'

import { useTheme } from '@devhub/landing/src/context/ThemeContext'

export interface ThemeSwitcherProps {}

export function ThemeSwitcher(props: ThemeSwitcherProps) {
  const {} = props

  const { theme, toggleTheme } = useTheme()

  return (
    <button
      id="theme-switcher"
      type="button"
      className="theme-switcher relative flex-shrink-0 w-10 bg-less-2 rounded-full focus:outline-none"
      onClick={() => {
        toggleTheme()
      }}
      role="button"
      aria-label="Toggle theme"
    >
      <div
        className={classNames(
          'theme-switcher-thumb absolute shadow rounded-full',
          theme.isDark ? 'dark bg-purple' : 'light bg-yellow',
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white opacity-25" />
      </div>

      <style jsx>
        {`
          .theme-switcher {
            height: 1rem;
            margin-left: 0.2rem;
            margin-right: 0.2rem;
          }

          .theme-switcher-thumb {
            top: -0.2rem;
            bottom: -0.2rem;
            width: 1.4rem;
          }

          .theme-switcher-thumb.light {
            left: -0.2rem;
          }

          .theme-switcher-thumb.dark {
            left: 1.3rem;
          }

          .theme-switcher-thumb > div {
            margin: 2px;
          }
        `}
      </style>
    </button>
  )
}
