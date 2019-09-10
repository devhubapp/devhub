import React, { useMemo } from 'react'

import { Theme, themeColorFields } from '@devhub/core/dist'
import { useTheme } from '../../context/ThemeContext'
import { toKebabCase } from '../../helpers'

function getStyles(params: { theme: Theme }) {
  const { theme: t } = params

  const invertedTheme = t.invert()

  return `
    *:focus {
      outline-color: ${t.primaryBackgroundColor};
    }

    body {
      ${themeColorFields
        .map(field => `--theme-${toKebabCase(field)}:${t[field]};`)
        .join('\n')}
      ${themeColorFields
        .map(
          field =>
            `--theme-inverted-${toKebabCase(field)}:${invertedTheme[field]};`,
        )
        .join('\n')}
    }
  `
}

export const AppGlobalStyles = React.memo(() => {
  const { theme } = useTheme()

  const styles = getStyles({ theme })

  return useMemo(() => <style key="app-global-styles-inner">{styles}</style>, [
    styles,
  ])
})

AppGlobalStyles.displayName = 'AppGlobalStyles'
