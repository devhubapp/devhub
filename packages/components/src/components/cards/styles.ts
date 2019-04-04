import _ from 'lodash'
import { StyleSheet, TextStyle } from 'react-native'

import { Theme } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../libs/platform'
import {
  avatarSize,
  contentPadding,
  smallAvatarSize,
  smallerTextSize,
  smallTextSize,
} from '../../styles/variables'

export const leftColumnSmallSize = smallAvatarSize
export const leftColumnBigSize = avatarSize

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

  container: {
    paddingVertical: contentPadding * (2 / 3),
    paddingHorizontal: contentPadding / 2,
  },

  compactContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: contentPadding * (2 / 3),
    paddingHorizontal: contentPadding / 2,
  },

  compactItemFixedWidth: {
    width: 22,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  compactItemFixedHeight: {
    height: 22,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  compactItemFixedMinHeight: {
    minHeight: 22,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemFixedWidth: {
    width: smallAvatarSize,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemFixedHeight: {
    height: smallAvatarSize,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemFixedMinHeight: {
    minHeight: smallAvatarSize,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftColumn: {
    alignSelf: 'flex-start',
    paddingTop: 1,
    marginRight: contentPadding,
    width: leftColumnBigSize,
  },

  leftColumn__small: {
    justifyContent: 'center',
    width: leftColumnSmallSize,
  },

  leftColumn__big: {
    justifyContent: 'flex-start',
    width: leftColumnBigSize,
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
    fontWeight: '500',
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
        lineHeight: smallerTextSize + 1,
        fontSize: smallerTextSize,
        color: theme.foregroundColorMuted50,
      },

      smallerMutedText: {
        lineHeight: smallerTextSize + 1,
        fontSize: smallerTextSize,
        color: theme.foregroundColorMuted50,
      },

      commentText: {
        color: theme.foregroundColor,
        lineHeight: 20,
        fontSize: smallTextSize,
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

      headerActionText: {
        fontSize: smallTextSize,
        lineHeight: 18,
        color: theme.foregroundColor,
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
