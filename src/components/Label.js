// @flow

import React from 'react'
import { StyleSheet, Text } from 'react-native'
import styled from 'styled-components/native'

import Icon from '../libs/icon'
import {
  contentPadding,
  mutedOpacity,
  radius as defaultRadius,
} from '../styles/variables'

const LabelContainer = styled.View`
  padding-vertical: 2px;
  padding-horizontal: ${contentPadding};
  background-color: ${({ color, outline, theme }) =>
    outline
      ? 'transparent'
      : (color && (theme[color] || color)) || theme.base04};
  border-color: ${({ borderColor, color, theme }) =>
    (borderColor && (theme[borderColor] || borderColor)) ||
    (color && (theme[color] || color)) ||
    theme.base04};
  border-width: ${({ borderWidth }) =>
    borderWidth || StyleSheet.hairlineWidth}px;
  border-radius: ${({ radius }) => radius || 0}px;
`

const LabelText = styled.Text`
  font-size: 14px;
  color: ${({ color, muted, outline, theme, textColor }) =>
    (textColor && (theme[textColor] || textColor)) ||
    (outline
      ? (color && (theme[color] || color)) ||
        (muted ? theme.base05 : theme.base04)
      : '') ||
    '#ffffff'};
  opacity: ${({ muted }) => (muted ? mutedOpacity : 1)};
`

type Props = {
  children: ReactClass<any>,
  borderColor?: ?string,
  color?: ?string,
  containerStyle?: Object,
  containerProps?: Object,
  muted?: boolean,
  outline?: boolean,
  isPrivate?: boolean,
  radius?: number,
  textColor?: ?string,
}

const Label = ({
  borderColor,
  color,
  children,
  containerStyle,
  containerProps = {},
  muted,
  outline,
  isPrivate,
  radius = defaultRadius,
  ...props
}: Props) => (
  <LabelContainer
    borderColor={borderColor}
    color={color}
    outline={outline}
    radius={radius}
    style={containerStyle}
    {...containerProps}
  >
    <LabelText color={color} outline={outline} muted={muted} {...props}>
      {!!isPrivate && (
        <Text>
          <Icon name="lock" />&nbsp;
        </Text>
      )}
      {children}
    </LabelText>
  </LabelContainer>
)

export default Label
