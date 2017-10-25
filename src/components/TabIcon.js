// @flow

import React from 'react'
import styled from 'styled-components/native'
import { View } from 'react-native'

import Icon from '../libs/icon'
import { radius } from '../styles/variables'

const BadgeContainer = styled.View`
  position: absolute;
  right: -8px;
  top: -2px;
  background-color: ${({ theme }) => theme.red};
  border-radius: ${radius}px;
  justify-content: center;
  align-items: center;
`

const BadgeText = styled.Text`
  padding-horizontal: 4px;
  padding-vertical: 2px;
  font-size: 10px;
  background-color: transparent;
  color: #ffffff;
`

type Props = { badgeCount?: number, color: string, icon: string, size?: number }
const TabIcon = ({ badgeCount, color, icon, size }: Props) => (
  <View>
    <Icon name={icon} size={size} color={color} />
    {badgeCount > 0 && (
      <BadgeContainer>
        <BadgeText>{badgeCount > 99 ? '99+' : badgeCount}</BadgeText>
      </BadgeContainer>
    )}
  </View>
)

TabIcon.defaultProps = {
  badgeCount: 0,
  size: 22,
}

export default TabIcon
