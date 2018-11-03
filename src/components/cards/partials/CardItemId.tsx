import React, { SFC } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

import { Octicons as Icon } from '../../../libs/vector-icons'
import { radius } from '../../../styles/variables'
import { GitHubIcon } from '../../../types'
import { fixURL } from '../../../utils/helpers/github/url'
import { Link } from '../../common/Link'
import { ThemeConsumer } from '../../context/ThemeContext'
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
  } as ViewStyle,

  text: {
    backgroundColor: 'transparent',
    fontSize: 12,
    lineHeight: 20,
    opacity: 0.9,
  } as TextStyle,
})

export const CardItemId: SFC<CardItemIdProps> = ({
  icon,
  id,
  isRead,
  style,
  url,
}) => {
  if (!id && !icon) return null

  const parsedNumber = parseInt(`${id}`, 10) || id

  return (
    <ThemeConsumer>
      {({ theme }) => (
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
      )}
    </ThemeConsumer>
  )
}
