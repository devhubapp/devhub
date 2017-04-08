// @flow

import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';

import Icon from '../libs/icon';

const badgeSize = 16;

const BadgeContainer = styled.View`
  position: absolute;
  right: ${-badgeSize / 2};
  top: -2;
  background-color: ${({ theme }) => theme.red};
  border-radius: ${badgeSize};
  min-width: ${badgeSize};
  height: ${badgeSize};
  justify-content: center;
  align-items: center;
`;

const BadgeText = styled.Text`
  padding-horizontal: 2;
  line-height: ${badgeSize};
  font-size: 10;
  background-color: transparent;
  color: #ffffff;
`;

type Props = { badge?: number, color: string, icon: string, size?: number };
const TabIcon = ({ badge, color, icon, size }: Props) => (
  <View>
    <Icon name={icon} size={size} color={color} />
    {badge > 0 &&
      <BadgeContainer>
        <BadgeText>{badge > 99 ? '99+' : badge}</BadgeText>
      </BadgeContainer>}
  </View>
);

TabIcon.defaultProps = {
  badge: 0,
  size: 22,
};

export default TabIcon;
