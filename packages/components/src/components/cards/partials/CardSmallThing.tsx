import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { GitHubIcon } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../../libs/platform'
import { radius } from '../../../styles/variables'
import { fixURL } from '../../../utils/helpers/github/url'
import { SpringAnimatedIcon } from '../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedLink } from '../../animated/spring/SpringAnimatedLink'
import { SpringAnimatedText } from '../../animated/spring/SpringAnimatedText'
import { getCardStylesForTheme } from '../styles'

export interface CardSmallThingProps {
  icon?: GitHubIcon
  isRead: boolean
  style?: StyleProp<ViewStyle>
  text: string | number
  url: string
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    borderRadius: radius,
    borderWidth: 1,
  },

  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },

  text: {
    backgroundColor: 'transparent',
    fontSize: 12,
    lineHeight: 20,
    opacity: 0.9,
  },
})

export function CardSmallThing(props: CardSmallThingProps) {
  const { icon, isRead, style, text, url } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const hasText = typeof text === 'number' || !!text
  if (!(hasText || icon)) return null

  const springAnimatedTextStyles = [
    styles.text,
    {
      color: isRead
        ? springAnimatedTheme.foregroundColorMuted50
        : springAnimatedTheme.foregroundColor,
    },
    isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
  ]

  return (
    <SpringAnimatedLink
      href={fixURL(url)}
      style={[
        styles.container,
        {
          backgroundColor: springAnimatedTheme.backgroundColorLess1,
          borderColor: springAnimatedTheme.backgroundColorLess1,
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
                marginTop: Platform.select({ web: 2, default: 3 }),
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
