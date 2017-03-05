// @flow

import React from 'react';
import styled from 'styled-components/native';

import { contentPadding, mutedOpacity, radius as defaultRadius } from '../styles/variables';

const LabelContainer = styled.View`
  padding-vertical: 2px;
  padding-horizontal: ${contentPadding};
  background-color: ${({ color, outline, theme }) => (
    outline ? 'transparent' : (color || theme.base04)
  )};
  border-color: ${({ color, theme }) => color || theme.base04};
  border-width: ${({ borderWidth }) => borderWidth || 1}px;
  border-radius: ${({ radius }) => radius || 0}px;
  opacity: ${({ muted }) => (muted ? mutedOpacity : 1)};
`;

const Label = styled.Text`
  color: ${({ color, muted, outline, theme, textColor }) => (
    textColor || (outline ? color || (muted ? theme.base05 : theme.base04) : '') || '#ffffff'
  )};
`;

type Props = {
  children: React.Element,
  color?: ?string,
  containerStyle?: Object,
  containerProps?: Object,
  muted?: boolean,
  outline?: boolean,
  radius?: number,
  textColor?: ?string,
};

export default ({
  color,
  children,
  containerStyle,
  containerProps = {},
  muted,
  outline,
  radius = defaultRadius,
  ...props
}: Props) => (
  <LabelContainer
    color={color}
    muted={muted}
    outline={outline}
    radius={radius}
    style={containerStyle}
    {...containerProps}
  >
    <Label color={color} outline={outline} muted={muted} {...props}>
      {children}
    </Label>
  </LabelContainer>
);
