import React, { SFC } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

import { Octicons as Icon } from '../../../libs/vector-icons'
import { radius } from '../../../styles/variables'
import { IGitHubIcon, ITheme } from '../../../types'
import { fixURL } from '../../../utils/helpers/github/url'
import { Link } from '../../common/Link'
import cardStyles from '../styles'

export interface IProps {
  icon?: IGitHubIcon
  id: number | string
  isRead: boolean
  style?: StyleProp<ViewStyle>
  theme: ITheme
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
    fontWeight: 'bold',
    lineHeight: 20,
    opacity: 0.9,
  } as TextStyle,
})

export const CardItemId: SFC<IProps> = ({
  icon,
  id,
  isRead,
  style,
  theme,
  url,
}) => {
  if (!id && !icon) return null

  const parsedNumber = parseInt(`${id}`, 10) || id

  return (
    <Link
      href={fixURL(url)}
      style={[
        styles.container,
        {
          backgroundColor: theme.base03,
          borderColor: theme.base03,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: isRead ? theme.base05 : theme.base04 },
          isRead && cardStyles.mutedText,
          isRead && { fontWeight: 'normal' },
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
