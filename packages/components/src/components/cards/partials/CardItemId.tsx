import React from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { GitHubIcon } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../hooks/use-css-variables-or-spring--animated-theme'
import { radius } from '../../../styles/variables'
import { fixURL } from '../../../utils/helpers/github/url'
import { SpringAnimatedIcon } from '../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedLink } from '../../animated/spring/SpringAnimatedLink'
import { SpringAnimatedText } from '../../animated/spring/SpringAnimatedText'
import { getCardStylesForTheme } from '../styles'

export interface CardItemIdProps {
  icon?: GitHubIcon
  id: number | string
  isRead: boolean
  style?: StyleProp<ViewStyle>
  url: string
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: radius,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },

  text: {
    backgroundColor: 'transparent',
    fontSize: 12,
    lineHeight: 20,
    opacity: 0.9,
  },
})

export function CardItemId(props: CardItemIdProps) {
  const { icon, id, isRead, style, url } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  if (!id && !icon) return null

  const parsedNumber = parseInt(`${id}`, 10) || id

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
      <SpringAnimatedText style={springAnimatedTextStyles}>
        {icon ? (
          <SpringAnimatedIcon name={icon} style={springAnimatedTextStyles} />
        ) : (
          ''
        )}
        {parsedNumber && icon ? ' ' : ''}
        {typeof parsedNumber === 'number' ? '#' : ''}
        {parsedNumber}
      </SpringAnimatedText>
    </SpringAnimatedLink>
  )
}
