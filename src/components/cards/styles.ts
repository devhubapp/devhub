import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import theme from '../../styles/themes/dark'
import { avatarSize, contentPadding, smallTextSize } from '../../styles/variables'

export default StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
  } as ViewStyle,

  leftColumn: {
    justifyContent: 'center',
    marginRight: contentPadding,
    width: avatarSize,
  } as ViewStyle,

  avatar: {
    alignSelf: 'flex-end',
  } as ImageStyle,

  rightColumn: {
    flex: 1,
  } as ViewStyle,

  usernameText: {
    alignSelf: 'center',
    color: theme.base04,
    fontWeight: 'bold',
    lineHeight: 20,
  } as TextStyle,

  timestampText: {
    alignSelf: 'center',
    color: theme.base05,
    fontSize: smallTextSize,
  } as TextStyle,

  mutedText: {
    color: theme.base05,
  } as TextStyle,

  descriptionText: {
    color: theme.base05,
    lineHeight: 20,
  } as TextStyle,
})
