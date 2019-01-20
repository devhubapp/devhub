import React from 'react'

import { Theme } from '@devhub/core'
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
      --theme_backgroundColor:${t.backgroundColor};
      --theme_backgroundColorDarker1:${t.backgroundColorDarker1};
      --theme_backgroundColorDarker2:${t.backgroundColorDarker2};
      --theme_backgroundColorDarker3:${t.backgroundColorDarker3};
      --theme_backgroundColorLess1:${t.backgroundColorLess1};
      --theme_backgroundColorLess2:${t.backgroundColorLess2};
      --theme_backgroundColorLess3:${t.backgroundColorLess3};
      --theme_backgroundColorLighther1:${t.backgroundColorLighther1};
      --theme_backgroundColorLighther2:${t.backgroundColorLighther2};
      --theme_backgroundColorLighther3:${t.backgroundColorLighther3};
      --theme_backgroundColorMore1:${t.backgroundColorMore1};
      --theme_backgroundColorMore2:${t.backgroundColorMore2};
      --theme_backgroundColorMore3:${t.backgroundColorMore3};
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
