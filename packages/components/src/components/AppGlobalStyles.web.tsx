import React from 'react'

import { Theme } from '@devhub/core'
import { darken, lighten } from 'polished'
import { themeColorFields } from '../utils/helpers/theme'
import { getSeparatorThemeColor } from './common/Separator'
import { useTheme } from './context/ThemeContext'

function getStyles(params: { theme: Theme }) {
  const t = params.theme

  return `
    ::-webkit-scrollbar-thumb
    {
      background-color:${t[getSeparatorThemeColor(t.backgroundColor)]};
    }

    body {
      ${themeColorFields
        .map(field => `--theme_${field}:${t[field]};`)
        .join('\n')}
      background-color:${t.backgroundColor};
    }

    a:not(.icon):hover, a:not(.icon):hover *:not(.icon) {
      ${
        t.isDark
          ? `color: ${lighten(1, t.foregroundColor)} !important;`
          : `color: ${darken(1, t.foregroundColor)} !important;`
      }
      transition: none 0s !important;
    }
  `
}

export function AppGlobalStyles() {
  const theme = useTheme()

  return <style key="global-styles">{getStyles({ theme })}</style>
}
