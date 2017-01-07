// @flow

import React from 'react';
import styled from 'styled-components/native';

import { contentPadding, radius as defaultRadius } from '../styles/variables';

const LabelContainer = styled.View`
  padding-vertical: 2;
  padding-horizontal: ${contentPadding};
  background-color: ${({ color, outline, theme }) => (
    outline ? 'transparent' : (color || theme.base04)
  )};
  border-color: ${({ color, theme }) => color || theme.base04};
  border-width: ${({ borderWidth }) => borderWidth || 0.5};
  border-radius: ${({ radius }) => radius || 0};
`;

const Label = styled.Text`
  color: ${({ color, outline, theme, textColor }) => (
    textColor || (outline ? color || theme.base04 : '') || '#ffffff'
  )};
`;

type Props = {
  children: React.Element,
  color?: ?string,
  containerStyle?: Object,
  containerProps?: Object,
  outline?: boolean,
  radius?: number,
  textColor?: ?string,
};

export default ({
  color,
  children,
  containerStyle,
  containerProps = {},
  outline,
  radius = defaultRadius,
  ...props
}: Props) => (
  <LabelContainer
    color={color}
    outline={outline}
    radius={radius}
    style={containerStyle}
    {...containerProps}
  >
    <Label color={color} outline={outline} {...props}>
      {children}
    </Label>
  </LabelContainer>
);
