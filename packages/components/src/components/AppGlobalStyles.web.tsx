import { darken, getLuminance, lighten } from 'polished'
import React, { useMemo } from 'react'

import { Theme } from '@devhub/core'
import { useColumnData } from '../hooks/use-column-data'
import { themeColorFields } from '../utils/helpers/theme'
import { getSeparatorThemeColors } from './common/Separator'
import { useFocusedColumn } from './context/ColumnFocusContext'
import { useTheme } from './context/ThemeContext'

function getStyles(params: { theme: Theme; isLoading: boolean }) {
  const { isLoading, theme: t } = params
  const separatorColor = t[getSeparatorThemeColors(t.backgroundColor)[0]]
  const separatorColorLuminance = getLuminance(separatorColor)
  const backgroundColorLuminance = getLuminance(t.backgroundColor)

  const invertedTheme = t.invert()

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

    body {
      ${themeColorFields
        .map(field => `--theme_${field}:${t[field]};`)
        .join('\n')}
      ${themeColorFields
        .map(field => `--theme_inverted_${field}:${invertedTheme[field]};`)
        .join('\n')}
      background-color:${t.backgroundColor};
      color: ${t.foregroundColor};
      cursor: ${isLoading ? 'progress' : 'default'};
    }
  `
}

export const AppGlobalStyles = React.memo(() => {
  const theme = useTheme()

  const { focusedColumnId } = useFocusedColumn()
  const { loadState } = useColumnData(focusedColumnId || '')

  const isLoading = !!(
    loadState === 'loading' ||
    loadState === 'loading_first' ||
    loadState === 'loading_more'
  )

  const styles = getStyles({ theme, isLoading })

  return useMemo(() => <style key="app-global-styles-inner">{styles}</style>, [
    styles,
  ])
})
