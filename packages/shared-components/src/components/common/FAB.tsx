import React from 'react'
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'

import { GitHubIcon } from 'shared-core/dist/types'
import { Octicons as Icon } from '../../libs/vector-icons'
import * as colors from '../../styles/colors'
import { contentPadding } from '../../styles/variables'
import { ThemeConsumer } from '../context/ThemeContext'

export interface FABProps extends TouchableOpacityProps {
  iconName?: GitHubIcon
  iconStyle?: StyleProp<TextStyle>
  onPress: TouchableOpacityProps['onPress']
  useBrandColor?: boolean
}

export const FAB: React.SFC<FABProps> = ({
  children,
  iconName,
  iconStyle,
  style,
  useBrandColor,
  ...props
}) => (
  <ThemeConsumer>
    {({ theme }) => (
      <TouchableOpacity
        {...props}
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
            width: 48,
            height: 48,
            borderRadius: 48 / 2,
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
              useBrandColor
                ? colors.brandForegroundColor
                : theme.foregroundColor
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
    )}
  </ThemeConsumer>
)
