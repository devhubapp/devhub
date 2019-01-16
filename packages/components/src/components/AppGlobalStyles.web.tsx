import React from 'react'

import { Theme } from '@devhub/core'
import { getSeparatorColor } from './common/Separator'
import { useTheme } from './context/ThemeContext'

function getStyles(params: { theme: Theme }) {
  const t = params.theme

  return `
    ::-webkit-scrollbar-thumb
    {
      background-color:${getSeparatorColor(t.backgroundColor, t)};
    }

    body {
      --theme_backgroundColor:${t.backgroundColor};
      --theme_backgroundColorDarker08:${t.backgroundColorDarker08};
      --theme_backgroundColorDarker16:${t.backgroundColorDarker16};
      --theme_backgroundColorLess08:${t.backgroundColorLess08};
      --theme_backgroundColorLess16:${t.backgroundColorLess16};
      --theme_backgroundColorLighther08:${t.backgroundColorLighther08};
      --theme_backgroundColorLighther16:${t.backgroundColorLighther16};
      --theme_backgroundColorMore08:${t.backgroundColorMore08};
      --theme_backgroundColorMore16:${t.backgroundColorMore16};
      --theme_backgroundColorTransparent10:${t.backgroundColorTransparent10};
      --theme_foregroundColor:${t.foregroundColor};
      --theme_foregroundColorMuted50:${t.foregroundColorMuted50};
      background-color:${t.backgroundColor};
    }
  `
}

export function AppGlobalStyles() {
  const theme = useTheme()

  return <style key="global-styles">{getStyles({ theme })}</style>
}
