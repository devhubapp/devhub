import React from 'react'
import { StyleProp, StyleSheet, Text, ViewStyle } from 'react-native'

import { GitHubIcon } from '@devhub/core/dist/types'
import { Octicons as Icon } from '../../../libs/vector-icons'
import { radius } from '../../../styles/variables'
import { fixURL } from '../../../utils/helpers/github/url'
import { Link } from '../../common/Link'
import { useTheme } from '../../context/ThemeContext'
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
  const theme = useTheme()

  if (!id && !icon) return null

  const parsedNumber = parseInt(`${id}`, 10) || id

  return (
    <Link
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
      <Text
        style={[
          styles.text,
          {
            color: isRead
              ? theme.foregroundColorTransparent50
              : theme.foregroundColor,
          },
          isRead && getCardStylesForTheme(theme).mutedText,
        ]}
      >
        {icon ? <Icon name={icon} /> : ''}
        {parsedNumber && icon ? ' ' : ''}
        {typeof parsedNumber === 'number' ? '#' : ''}
        {parsedNumber}
      </Text>
    </Link>
  )
}
