// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/Octicons';

type Props = { color: string, icon: string, size?: number };
const TabIcon = ({ color, icon, size }: Props) => (
  <Icon name={icon} size={size} color={color} />
);

TabIcon.defaultProps = {
  size: 22,
};

export default TabIcon;
