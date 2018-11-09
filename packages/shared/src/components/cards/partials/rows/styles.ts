import _ from 'lodash'
import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { contentPadding, smallTextSize } from '../../../../styles/variables'
import { Theme } from '../../../../types/themes'

export const getCardRowStylesForTheme = _.memoize((theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexGrow: 1,
      marginTop: contentPadding,
    } as ViewStyle,

    mainContentContainer: {
      flex: 1,
      justifyContent: 'center',
    } as ViewStyle,

    repositoryText: {
      color: theme.foregroundColor,
    } as TextStyle,

    repositorySecondaryText: {
      color: theme.foregroundColorMuted50,
      fontSize: smallTextSize,
    } as TextStyle,

    usernameText: {
      color: theme.foregroundColor,
    } as TextStyle,
  })
})
