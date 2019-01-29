import _ from 'lodash'
import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { Theme } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../libs/platform'
import {
  avatarSize,
  contentPadding,
  smallAvatarSize,
  smallTextSize,
} from '../../styles/variables'

export const cardStyles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
  } as ViewStyle,

  leftColumn: {
    marginRight: contentPadding,
    width: avatarSize,
  } as ViewStyle,

  leftColumn__small: {
    justifyContent: 'center',
    width: smallAvatarSize,
  } as ViewStyle,

  leftColumn__big: {
    justifyContent: 'flex-start',
    width: avatarSize,
  } as ViewStyle,

  leftColumnAlignTop: {
    alignSelf: 'flex-start',
  } as ViewStyle,

  rightColumn: {
    flex: 1,
  } as ViewStyle,

  avatar: {
    alignSelf: 'flex-end',
  } as ViewStyle,

  smallText: {
    fontSize: smallTextSize,
    lineHeight: smallTextSize + 4,
  } as TextStyle,
})

export const getCardStylesForTheme = _.memoize(
  (theme: Theme | ReturnType<typeof useCSSVariablesOrSpringAnimatedTheme>) => {
    return {
      usernameText: {
        alignSelf: 'center',
        color: theme.foregroundColor,
        fontWeight: '600',
        lineHeight: 20,
      } as TextStyle,

      timestampText: {
        alignSelf: 'center',
        color: theme.foregroundColorMuted50,
        fontSize: smallTextSize,
        lineHeight: smallTextSize + 4,
      } as TextStyle,

      commentText: {
        color: theme.foregroundColor,
        lineHeight: 20,
        ...(Platform.select({
          default: {},
          web: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'pre-line',
            wordWrap: 'normal',
          },
        }) as any),
      } as TextStyle,

      mutedText: {
        color: theme.foregroundColorMuted50,
      } as TextStyle,

      normalText: {
        color: theme.foregroundColor,
        lineHeight: 20,
      } as TextStyle,

      descriptionText: {
        color: theme.foregroundColorMuted50,
        lineHeight: 20,
      } as TextStyle,
    }
  },
)
