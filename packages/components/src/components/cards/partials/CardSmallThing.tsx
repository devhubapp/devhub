import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { GitHubIcon, ThemeColors } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../../libs/platform'
import { radius } from '../../../styles/variables'
import { fixURL } from '../../../utils/helpers/github/url'
import { SpringAnimatedIcon } from '../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedLink } from '../../animated/spring/SpringAnimatedLink'
import { SpringAnimatedText } from '../../animated/spring/SpringAnimatedText'
import { getCardStylesForTheme } from '../styles'

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

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const hasText = typeof text === 'number' || !!text
  if (!(hasText || icon)) return null

  const springAnimatedTextStyles = [
    getCardStylesForTheme(springAnimatedTheme).smallerMutedText,
  ]

  return (
    <SpringAnimatedLink
      href={fixURL(url)}
      style={[
        styles.container,
        backgroundColorTheme && {
          paddingHorizontal: 4,
          backgroundColor: springAnimatedTheme[backgroundColorTheme],
          borderColor: springAnimatedTheme[backgroundColorTheme],
        },
        style,
      ]}
    >
      <View style={styles.innerContainer}>
        {!!icon && (
          <SpringAnimatedIcon
            name={icon}
            style={[
              springAnimatedTextStyles,
              {
                lineHeight: undefined,
                marginTop: Platform.select({ web: 3, default: 4 }),
              },
              !!hasText && { marginRight: 4 },
            ]}
          />
        )}

        {!!hasText && (
          <SpringAnimatedText style={springAnimatedTextStyles}>
            {text}
          </SpringAnimatedText>
        )}
      </View>
    </SpringAnimatedLink>
  )
}
