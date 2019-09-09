import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { useReduxState } from '../../hooks/use-redux-state'
import { useSafeArea } from '../../libs/safe-area-view'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { Avatar } from '../common/Avatar'
import { IconButton, IconButtonProps } from '../common/IconButton'
import { Separator } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { ThemedIcon, ThemedIconProps } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'

export function getColumnHeaderThemeColors(): {
  normal: keyof ThemeColors
  hover: keyof ThemeColors
  selected: keyof ThemeColors
} {
  return {
    normal: 'backgroundColor',
    hover: 'backgroundColorLess1',
    selected: 'backgroundColorLess1',
  }
}

export interface ColumnHeaderProps {
  avatar?: { imageURL: string; linkURL: string }
  icon?: ThemedIconProps['name']
  left?: ReactNode
  right?: ReactNode
  style?: StyleProp<ViewStyle>
  subtitle?: string
  title: string
}

export const columnHeaderItemContentSize = 17
export const columnHeaderHeight =
  contentPadding * 2 + columnHeaderItemContentSize

export function ColumnHeader(props: ColumnHeaderProps) {
  const {
    avatar,
    icon,
    left,
    right,
    style,
    subtitle: _subtitle,
    title: _title,
  } = props

  const title = `${_title || ''}`.toLowerCase()
  const subtitle = `${_subtitle || ''}`.toLowerCase()

  const safeAreaInsets = useSafeArea()
  const bannerMessage = useReduxState(selectors.bannerMessageSelector)

  return (
    <ThemedView
      backgroundColor={getColumnHeaderThemeColors().normal}
      style={[
        styles.container,
        {
          paddingTop:
            bannerMessage && bannerMessage.message ? 0 : safeAreaInsets.top,
        },
      ]}
    >
      <View
        style={[
          styles.innerContainer,
          !left && { paddingLeft: (contentPadding * 2) / 3 },
          !right && { paddingRight: (contentPadding * 2) / 3 },
          style,
        ]}
      >
        {!!left && (
          <>
            {left}
            <Spacer width={contentPadding / 2} />
          </>
        )}

        <View style={styles.mainContentContainer}>
          {avatar && avatar.imageURL ? (
            <>
              <Avatar
                avatarUrl={avatar.imageURL}
                linkURL={avatar.linkURL}
                shape="circle"
                size={columnHeaderItemContentSize}
              />
              <Spacer width={contentPadding / 2} />
            </>
          ) : icon ? (
            <>
              <ThemedIcon
                color="foregroundColor"
                name={icon}
                size={columnHeaderItemContentSize}
              />
              <Spacer width={contentPadding / 2} />
            </>
          ) : null}

          {!!title && (
            <>
              <ThemedText color="foregroundColor" style={styles.title}>
                {title}
              </ThemedText>
              <Spacer width={contentPadding / 2} />
            </>
          )}

          {!!subtitle && (
            <>
              <ThemedText
                color="foregroundColorMuted65"
                style={styles.subtitle}
              >
                {subtitle}
              </ThemedText>
              <Spacer width={contentPadding / 2} />
            </>
          )}
        </View>

        {right}
      </View>

      <Separator horizontal />
    </ThemedView>
  )
}

ColumnHeader.Button = IconButton

export type ColumnHeaderButtonProps = IconButtonProps

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    height: 'auto',
  },

  innerContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignContent: 'center',
    alignItems: 'center',
    height: columnHeaderHeight,
  },

  mainContentContainer: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    height: '100%',
  },

  title: {
    lineHeight: columnHeaderItemContentSize,
    fontSize: columnHeaderItemContentSize - 1,
    fontWeight: '800',
  },

  subtitle: {
    fontSize: columnHeaderItemContentSize - 5,
  },
})
