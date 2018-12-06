import _ from 'lodash'
import { StyleSheet } from 'react-native'

import { Theme } from '@devhub/core/src/types/themes'
import { useAnimatedTheme } from '../../../../hooks/use-animated-theme'
import { contentPadding, smallTextSize } from '../../../../styles/variables'

const styles = StyleSheet.create({
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
  (theme: Theme | ReturnType<typeof useAnimatedTheme>) => {
    return {
      ...styles,

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
