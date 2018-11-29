import _ from 'lodash'
import { StyleSheet } from 'react-native'

import { Theme } from 'shared-core/dist/types/themes'
import { contentPadding, smallTextSize } from '../../../../styles/variables'

export const getCardRowStylesForTheme = _.memoize((theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexGrow: 1,
      marginTop: contentPadding,
    },

    mainContentContainer: {
      flex: 1,
      justifyContent: 'center',
    },

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
  })
})
