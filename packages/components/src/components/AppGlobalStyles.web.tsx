import { darken, getLuminance, lighten } from 'polished'
import React, { useCallback, useMemo } from 'react'

import { ColumnSubscription, Theme } from '@devhub/core'
import { useReduxState } from '../hooks/use-redux-state'
import * as selectors from '../redux/selectors'
import { themeColorFields } from '../utils/helpers/theme'
import { getSeparatorThemeColors } from './common/Separator'
import { useFocusedColumn } from './context/ColumnFocusContext'
import { useTheme } from './context/ThemeContext'

function getStyles(params: { theme: Theme; isLoading: boolean }) {
  const { isLoading, theme: t } = params
  const separatorColor = t[getSeparatorThemeColors(t.backgroundColor)[0]]
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

    body {
      ${themeColorFields
        .map(field => `--theme_${field}:${t[field]};`)
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
  const mainSubscription = useReduxState(
    useCallback(
      state =>
        selectors.columnSubscriptionSelector(state, focusedColumnId || ''),
      [focusedColumnId],
    ),
  ) as ColumnSubscription | undefined

  const isLoading = !!(
    mainSubscription &&
    mainSubscription.data &&
    (mainSubscription.data.loadState === 'loading' ||
      mainSubscription.data.loadState === 'loading_first' ||
      mainSubscription.data.loadState === 'loading_more')
  )
  const styles = getStyles({ theme, isLoading })

  return useMemo(() => <style key="app-global-styles-inner">{styles}</style>, [
    styles,
  ])
})
