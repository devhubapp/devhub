import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import theme from '../../../../styles/themes/light'
import { contentPadding, radius, smallTextSize } from '../../../../styles/variables'

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexGrow: 1,
    marginTop: contentPadding,
  } as ViewStyle,

  mainContentContainer: {
    alignItems: 'center',
    borderColor: theme.base01,
    borderRadius: radius,
    borderWidth: 1,
    flexDirection: 'row',
    flexGrow: 1,
    paddingHorizontal: contentPadding,
    paddingVertical: contentPadding / 2,
  } as ViewStyle,

  ownerText: {
    color: theme.base05,
    fontSize: smallTextSize,
  } as TextStyle,

  repositoryText: {
    color: theme.base04,
  } as TextStyle,
})
