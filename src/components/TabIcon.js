// @flow

import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';

import Icon from '../libs/icon';
import { radius } from '../styles/variables';

const BadgeContainer = styled.View`
  position: absolute;
  right: -8px;
  top: -2px;
  background-color: ${({ theme }) => theme.red};
  border-radius: ${radius}px;
  justify-content: center;
  align-items: center;
`;

const BadgeText = styled.Text`
  paddingHorizontal: 4px;
  paddingVertical: 2px;
  font-size: 10px;
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
