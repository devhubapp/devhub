import _ from 'lodash'
import { StyleSheet, TextStyle } from 'react-native'

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
export const spacingBetweenLeftAndRightColumn = (contentPadding * 2) / 3

export const cardStyles = StyleSheet.create({
  container: {
    paddingVertical: contentPadding * (2 / 3),
    paddingHorizontal: contentPadding / 2,
    overflow: 'hidden',
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
    height: Math.max(20, smallAvatarSize),
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemFixedMinHeight: {
    minHeight: Math.max(20, smallAvatarSize),
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftColumn: {
    alignSelf: 'flex-start',
    paddingTop: 1,
    marginRight: spacingBetweenLeftAndRightColumn,
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

  usernameText: {
    alignSelf: 'center',
    lineHeight: 20,
  } as TextStyle,

  timestampText: {
    lineHeight: smallerTextSize + 1,
    fontSize: smallerTextSize,
  },

  smallerText: {
    lineHeight: smallerTextSize + 1,
    fontSize: smallerTextSize,
  },

  commentText: {
    lineHeight: 20,
    fontSize: smallTextSize,
  },

  normalText: {
    lineHeight: 20,
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
})
