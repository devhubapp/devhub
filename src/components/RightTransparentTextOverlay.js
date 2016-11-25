// @flow

import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View } from 'react-native';

import { fade } from '../utils/helpers/color';

type Props = {
  children: React.Element,
  color: string,
  size: number,
};

export default ({ children, color, size, ...props }: Props) => {
  const GradientLayerOverlay = () => (
    <LinearGradient
      colors={[fade(color, 0), color]}
      start={[0, 0]}
      end={[1, 0]}
      style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: size }}
      {...props}
    />
  );

  return (
    <View style={{ flex: 1, alignSelf: 'stretch' }}>
      {children}
      <GradientLayerOverlay />
    </View>
  );
}
