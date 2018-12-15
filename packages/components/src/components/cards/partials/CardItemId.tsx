import React from 'react'
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { GitHubIcon } from '@devhub/core'
import { useAnimatedTheme } from '../../../hooks/use-animated-theme'
import { radius } from '../../../styles/variables'
import { fixURL } from '../../../utils/helpers/github/url'
import { AnimatedIcon } from '../../animated/AnimatedIcon'
import { AnimatedLink } from '../../animated/AnimatedLink'
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
    borderWidth: StyleSheet.hairlineWidth,
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
  const theme = useAnimatedTheme()

  if (!id && !icon) return null

  const parsedNumber = parseInt(`${id}`, 10) || id

  const textStyles = [
    styles.text,
    {
      color: isRead
        ? theme.foregroundColorTransparent50
        : theme.foregroundColor,
    },
    isRead && getCardStylesForTheme(theme).mutedText,
  ]

  return (
    <AnimatedLink
      href={fixURL(url)}
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundColorLess08,
          borderColor: theme.backgroundColorLess08,
        },
        style,
      ]}
    >
      <Animated.Text style={textStyles}>
        {icon ? <AnimatedIcon name={icon} style={textStyles} /> : ''}
        {parsedNumber && icon ? ' ' : ''}
        {typeof parsedNumber === 'number' ? '#' : ''}
        {parsedNumber}
      </Animated.Text>
    </AnimatedLink>
  )
}
