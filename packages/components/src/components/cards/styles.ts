import _ from 'lodash'
import { StyleSheet } from 'react-native'

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
  flex: {
    flex: 1,
  },

  horizontal: {
    flexDirection: 'row',
  },

  horizontalAndVerticallyAligned: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },

  leftColumn: {
    alignSelf: 'flex-start',
    paddingTop: 1,
    marginRight: contentPadding,
    width: avatarSize,
  },

  leftColumn__small: {
    justifyContent: 'center',
    width: smallAvatarSize,
  },

  leftColumn__big: {
    justifyContent: 'flex-start',
    width: avatarSize,
  },

  rightColumn: {
    flex: 1,
  },

  avatar: {
    alignSelf: 'flex-end',
  },

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
      },

      timestampText: {
        lineHeight: smallTextSize + 1,
        fontSize: smallTextSize,
        color: theme.foregroundColorMuted50,
      },

      commentText: {
        flex: 1,
        color: theme.foregroundColor,
        lineHeight: 20,
      },

      mutedText: {
        color: theme.foregroundColorMuted50,
      },

      normalText: {
        lineHeight: 20,
        color: theme.foregroundColor,
        ...Platform.select({
          default: {},
          web: {
            wordWrap: 'break-word',
          },
        }),
      },

      icon: {
        lineHeight: 20,
        marginRight: 2,
      },

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
      },
    }
  },
)
