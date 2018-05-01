import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import Platform from '../../libs/platform'
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
    lineHeight: smallTextSize + 4,
  } as TextStyle,

  mutedText: {
    color: theme.base05,
  } as TextStyle,

  normalText: {
    color: theme.base04,
    lineHeight: 20,
  } as TextStyle,

  smallText: {
    fontSize: smallTextSize,
    lineHeight: smallTextSize + 4,
  } as TextStyle,

  descriptionText: {
    color: theme.base05,
    lineHeight: 20,
  } as TextStyle,

  commentText: {
    color: theme.base04,
    lineHeight: 20,
    ...Platform.select({
      default: {},
      web: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'pre-line',
        wordWrap: 'normal',
      },
    }),
  } as TextStyle,
})
