import _ from 'lodash'
import { StyleSheet } from 'react-native'

import { Theme } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { Platform } from '../../libs/platform'
import {
  avatarSize,
  contentPadding,
  smallAvatarSize,
  smallTextSize,
} from '../../styles/variables'

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
  },

  leftColumn: {
    justifyContent: 'center',
    marginRight: contentPadding,
    width: avatarSize,
  },

  leftColumn__small: {
    width: smallAvatarSize,
  },

  leftColumn__big: {
    width: avatarSize,
  },

  leftColumnAlignTop: {
    alignSelf: 'flex-start',
  },

  rightColumn: {
    flex: 1,
    flexDirection: 'row',
  },

  avatar: {
    alignSelf: 'flex-end',
  },

  smallText: {
    fontSize: smallTextSize,
    lineHeight: smallTextSize + 4,
  },
})

export const getCardStylesForTheme = _.memoize(
  (theme: Theme | ReturnType<typeof useAnimatedTheme>) => {
    return {
      ...styles,

      usernameText: {
        alignSelf: 'center',
        color: theme.foregroundColor,
        fontWeight: '500',
        lineHeight: 20,
      },

      timestampText: {
        alignSelf: 'center',
        color: theme.foregroundColorMuted50,
        fontSize: smallTextSize,
        lineHeight: smallTextSize + 4,
      },

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
      },

      mutedText: {
        color: theme.foregroundColorMuted50,
      },

      normalText: {
        color: theme.foregroundColor,
        lineHeight: 20,
      },

      descriptionText: {
        color: theme.foregroundColorMuted50,
        lineHeight: 20,
      },
    }
  },
)
