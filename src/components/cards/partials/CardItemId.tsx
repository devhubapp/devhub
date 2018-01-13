import React, { SFC } from 'react'
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'

import { radius } from '../../../styles/variables'
import { IGitHubIcon, ITheme } from '../../../types'
import cardStyles from '../styles'
import { getGithubURLPressHandler } from './rows/helpers'

export interface IProps {
  icon?: IGitHubIcon
  id: number | string
  isRead?: boolean
  style?: ViewStyle
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
    <TouchableOpacity
      onPress={url ? getGithubURLPressHandler(url) : undefined}
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
    </TouchableOpacity>
  )
}
