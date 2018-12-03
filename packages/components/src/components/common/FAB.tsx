import React from 'react'
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'

import { GitHubIcon } from '@devhub/core/src/types'
import { Octicons as Icon } from '../../libs/vector-icons'
import * as colors from '../../styles/colors'
import { contentPadding } from '../../styles/variables'
import { useTheme } from '../context/ThemeContext'

export const fabSize = 48

export interface FABProps extends TouchableOpacityProps {
  children?: string | React.ReactElement<any>
  iconName?: GitHubIcon
  iconStyle?: StyleProp<TextStyle>
  onPress: TouchableOpacityProps['onPress']
  useBrandColor?: boolean
}

export function FAB(props: FABProps) {
  const theme = useTheme()

  const {
    children,
    iconName,
    iconStyle,
    style,
    useBrandColor,
    ...otherProps
  } = props

  return (
    <TouchableOpacity
      {...otherProps}
      hitSlop={{
        top: contentPadding / 2,
        bottom: contentPadding / 2,
        left: contentPadding,
        right: contentPadding,
      }}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          width: fabSize,
          height: fabSize,
          borderRadius: fabSize / 2,
          backgroundColor: useBrandColor
            ? colors.brandBackgroundColor
            : theme.backgroundColorMore08,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          zIndex: 1,
        },
        style,
      ]}
    >
      {typeof iconName === 'string' ? (
        <Icon
          color={
            useBrandColor ? colors.brandForegroundColor : theme.foregroundColor
          }
          name={iconName}
          style={[{ fontSize: 20 }, iconStyle]}
        />
      ) : typeof children === 'string' ? (
        <Text
          style={{
            fontWeight: '500',
            color: useBrandColor
              ? colors.brandForegroundColor
              : theme.foregroundColor,
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
}
