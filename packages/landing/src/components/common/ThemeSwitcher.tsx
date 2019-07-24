import classNames from 'classnames'
import React from 'react'

import { useTheme } from '@devhub/landing/src/context/ThemeContext'

export interface ThemeSwitcherProps {}

export function ThemeSwitcher(props: ThemeSwitcherProps) {
  const {} = props

  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      className={classNames(
        'theme-switcher relative w-10 rounded-full focus:outline-none',
        theme.isDark ? 'bg-primary' : 'bg-less-4',
      )}
      onClick={() => {
        toggleTheme()
      }}
      style={{ height: '1rem' }}
    >
      <div
        className={classNames(
          'theme-switcher-thumb absolute bg-white shadow rounded-full',
          theme.isDark ? 'dark' : 'light',
        )}
      />

      <style jsx>
        {`
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
        `}
      </style>
    </button>
  )
}
