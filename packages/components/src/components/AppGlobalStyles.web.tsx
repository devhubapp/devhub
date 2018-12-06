import React from 'react'

import { Theme } from '@devhub/core/src/types'
import { useTheme } from './context/ThemeContext'

function getStyles(params: { theme: Theme }) {
  const t = params.theme
  return `
    ::-webkit-scrollbar-thumb
    {
      background-color:${t.backgroundColorDarker08};
    }

    body {
      --theme_backgroundColor:${t.backgroundColor};
      --theme_backgroundColorDarker08:${t.backgroundColorDarker08};
      --theme_backgroundColorLess08:${t.backgroundColorLess08};
      --theme_backgroundColorLighther08:${t.backgroundColorLighther08};
      --theme_backgroundColorMore08:${t.backgroundColorMore08};
      --theme_backgroundColorTransparent10:${t.backgroundColorTransparent10};
      --theme_foregroundColor:${t.foregroundColor};
      --theme_foregroundColorMuted50:${t.foregroundColorMuted50};
      --theme_foregroundColorTransparent50:${t.foregroundColorTransparent50};
      --theme_foregroundColorTransparent80:${t.foregroundColorTransparent80};
    }
  `
}

export function AppGlobalStyles() {
  const theme = useTheme()

  return <style>{getStyles({ theme })}</style>
}
