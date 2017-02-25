// @flow

import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

import Icon from '../../libs/icon';
import { contentPadding } from '../../styles/variables';

export const Button = styled.TouchableOpacity`
  height: ${({ horizontal }) => (horizontal ? 44 : 58)};
  background-color: ${({ theme }) => theme.invert().base02};
  border-color: ${({ theme }) => theme.base02};
  border-radius: ${({ radius }) => radius};
  border-width: 1;
`;

export const Content = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const IconWrapper = styled.View`
  align-items: center;
  justify-content: center;
  padding-horizontal: ${contentPadding};
  border-width: 0;
  border-right-width: 0.5;
  border-color: ${({ theme }) => theme.base04};
`;

export const ButtonIcon = styled(Icon) `
  font-size: 20;
  color: ${({ muted, theme }) => (muted ? theme.invert().base05 : theme.invert().base04)};
`;

export const TextWrapper = styled.View`
  flex: 1;
  padding-horizontal: ${contentPadding};
  align-items: ${({ horizontal }) => (horizontal ? 'center' : 'flex-start')};
  justify-content: center;
  ${({ horizontal }) => horizontal && 'flex-direction: row;'}
`;

export const Text = styled.Text`
  line-height: 18;
  font-size: 15;
  font-weight: 500;
  text-align: left;
  color: ${({ muted, theme }) => (muted ? theme.invert().base05 : theme.invert().base04)};
`;

type Props = {
  leftIcon?: string,
  horizontal?: boolean,
  loading?: boolean,
  radius?: number,
  rightIcon?: string,
  title?: string,
  subtitle?: string,
  subtitleProps?: Object,
  textProps?: Object,
};

export default ({
  leftIcon = 'mark-github',
  horizontal,
  loading,
  title,
  radius,
  rightIcon,
  subtitle,
  subtitleProps = {},
  textProps = {},
  ...props
}: Props) => (
  <Button activeOpacity={1} horizontal={horizontal} radius={radius} {...props}>
    <Content>
      {
        leftIcon && (
          <IconWrapper>
            <ButtonIcon name={leftIcon} />
          </IconWrapper>
        )
      }

      <TextWrapper horizontal={horizontal}>
        {!!title && (<Text {...textProps}>{title}</Text>)}
        {!!subtitle && <Text muted {...subtitleProps}>{subtitle}</Text>}
      </TextWrapper>

      {
        (rightIcon || loading) && (
          <IconWrapper>
            {
              loading
              ? <ActivityIndicator />
              : <ButtonIcon name={rightIcon} muted />
            }
          </IconWrapper>
        )
      }
    </Content>
  </Button>
);
