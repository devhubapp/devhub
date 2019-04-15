import React from 'react'

import { Theme } from '@devhub/core'
import { darken, getLuminance, lighten } from 'polished'
import { Platform } from '../libs/platform'
import { themeColorFields } from '../utils/helpers/theme'
import { getSeparatorThemeColor } from './common/Separator'
import { useTheme } from './context/ThemeContext'

function getStyles(params: { theme: Theme }) {
  const t = params.theme
  const separatorColor = t[getSeparatorThemeColor(t.backgroundColor)]
  const separatorColorLuminance = getLuminance(separatorColor)
  const backgroundColorLuminance = getLuminance(t.backgroundColor)

  return `
    ::-webkit-scrollbar-thumb {
      background-color: ${
        separatorColorLuminance > backgroundColorLuminance
          ? lighten(0.025, separatorColor)
          : darken(0.025, separatorColor)
      };
    }

    *:focus {
      outline-color: ${t.primaryBackgroundColor};
    }

    ${
      Platform.realOS === 'web'
        ? `a:hover, a:hover > *:not([class*='touchable']) {
      text-decoration: underline;
    }`
        : ''
    }

    body {
      ${themeColorFields
        .map(field => `--theme_${field}:${t[field]};`)
        .join('\n')}
      background-color:${t.backgroundColor};
      color: ${t.foregroundColor};
    }
  `
}

export const AppGlobalStyles = React.memo(() => {
  const theme = useTheme()

  return <style key="app-global-styles-inner">{getStyles({ theme })}</style>
})
