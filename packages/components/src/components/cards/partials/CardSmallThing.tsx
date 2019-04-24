import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { GitHubIcon, ThemeColors } from '@devhub/core'
import { Platform } from '../../../libs/platform'
import { radius } from '../../../styles/variables'
import { fixURL } from '../../../utils/helpers/github/url'
import { Link } from '../../common/Link'
import { ThemedIcon } from '../../themed/ThemedIcon'
import { ThemedText } from '../../themed/ThemedText'
import { cardStyles } from '../styles'

export interface CardSmallThingProps {
  backgroundColorTheme?: keyof ThemeColors
  icon?: GitHubIcon
  isRead: boolean
  style?: StyleProp<ViewStyle>
  text: string | number
  url: string
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
})

export function CardSmallThing(props: CardSmallThingProps) {
  const { backgroundColorTheme, icon, style, text, url } = props

  const hasText = typeof text === 'number' || !!text
  if (!(hasText || icon)) return null

  return (
    <Link
      backgroundThemeColor={backgroundColorTheme}
      // borderThemeColor={backgroundColorTheme}
      href={fixURL(url)}
      style={[
        styles.container,
        backgroundColorTheme && {
          paddingHorizontal: 4,
          borderWidth: 0,
        },
        style,
      ]}
    >
      <View style={styles.innerContainer}>
        {!!icon && (
          <ThemedIcon
            color="foregroundColorMuted50"
            name={icon}
            style={[
              cardStyles.smallerText,
              {
                lineHeight: undefined,
                marginTop: Platform.select({ web: 3, default: 4 }),
              },
              !!hasText && { marginRight: 4 },
            ]}
          />
        )}

        {!!hasText && (
          <ThemedText
            color="foregroundColorMuted50"
            style={cardStyles.smallText}
          >
            {text}
          </ThemedText>
        )}
      </View>
    </Link>
  )
}
