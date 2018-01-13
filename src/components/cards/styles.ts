import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import theme from '../../styles/themes/dark'
import {
  avatarSize,
  contentPadding,
  smallTextSize,
} from '../../styles/variables'

export default StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
  } as ViewStyle,

  leftColumn: {
    justifyContent: 'center',
    marginRight: contentPadding,
    width: avatarSize,
  } as ViewStyle,

  leftColumnAlignTop: {
    alignSelf: 'flex-start',
  } as ViewStyle,

  rightColumn: {
    flex: 1,
    flexDirection: 'row',
  } as ViewStyle,

  avatar: {
    alignSelf: 'flex-end',
  } as ImageStyle,

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

  normalText: {
    color: theme.base04,
  } as TextStyle,

  smallText: {
    fontSize: smallTextSize,
  } as TextStyle,

  descriptionText: {
    color: theme.base05,
    lineHeight: 20,
  } as TextStyle,
})
