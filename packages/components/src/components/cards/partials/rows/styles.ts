import _ from 'lodash'
import { StyleSheet } from 'react-native'

import { Theme } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { contentPadding } from '../../../../styles/variables'

export const innerCardMarginTop = contentPadding / 3

export const cardRowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexGrow: 1,
  },

  container__margin: {
    marginTop: contentPadding * (2 / 3),
  },

  mainContentContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    maxWidth: '100%',
  },
})

export const getCardRowStylesForTheme = _.memoize(
  (theme: Theme | ReturnType<typeof useCSSVariablesOrSpringAnimatedTheme>) => {
    return {
      repositoryText: {
        color: theme.foregroundColor,
      },

      repositorySecondaryText: {
        // lineHeight: undefined,
        // fontSize: smallTextSize,
        color: theme.foregroundColorMuted50,
      },

      usernameText: {
        color: theme.foregroundColor,
      },
    }
  },
)
