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
  },

  boldText: {
    fontWeight: '600',
  },
})

export const getCardStylesForTheme = _.memoize(
  (theme: Theme | ReturnType<typeof useCSSVariablesOrSpringAnimatedTheme>) => {
    return {
      usernameText: {
        alignSelf: 'center',
        lineHeight: 20,
        fontWeight: '500',
        color: theme.foregroundColor,
      } as TextStyle,

      timestampText: {
        alignSelf: 'center',
        lineHeight: smallTextSize + 1,
        fontSize: smallTextSize,
        color: theme.foregroundColorMuted50,
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
            wordWrap: 'break-word',
          },
        }) as any),
      } as TextStyle,

      mutedText: {
        color: theme.foregroundColorMuted50,
      } as TextStyle,

      normalText: {
        lineHeight: 20,
        color: theme.foregroundColor,
        ...Platform.select({
          default: {},
          web: {
            wordWrap: 'break-word',
          },
        }),
      } as TextStyle,

      icon: {
        lineHeight: 20,
        marginRight: 2,
      } as TextStyle,

      descriptionText: {
        fontSize: smallTextSize,
        lineHeight: smallTextSize + 4,
        color: theme.foregroundColorMuted50,
        ...Platform.select({
          default: {},
          web: {
            wordWrap: 'break-word',
          },
        }),
      } as TextStyle,
    }
  },
)
