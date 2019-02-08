import _ from 'lodash'
import { StyleSheet } from 'react-native'

import { Theme } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { contentPadding, smallTextSize } from '../../../../styles/variables'

export const cardRowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexGrow: 1,
    marginTop: contentPadding,
  },

  mainContentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
})

export const getCardRowStylesForTheme = _.memoize(
  (theme: Theme | ReturnType<typeof useCSSVariablesOrSpringAnimatedTheme>) => {
    return {
      repositoryText: {
        color: theme.foregroundColor,
      },

      repositorySecondaryText: {
        color: theme.foregroundColorMuted50,
        fontSize: smallTextSize,
      },

      usernameText: {
        color: theme.foregroundColor,
      },
    }
  },
)
