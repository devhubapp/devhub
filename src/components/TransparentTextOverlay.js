// @flow

import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View } from 'react-native';

import { fade } from '../utils/helpers/color';

function getStyle(from, size) {
  switch (from) {
    case 'top': return { position: 'absolute', top: 0, left: 0, right: 0, height: size };
    case 'bottom': return { position: 'absolute', bottom: 0, left: 0, right: 0, height: size };
    case 'left': return { position: 'absolute', top: 0, bottom: 0, left: 0, width: size };
    default: return { position: 'absolute', top: 0, bottom: 0, right: 0, width: size };
  }
}

function getProps(from) {
  switch (from) {
    case 'top': return { start: [0, 1], end: [0, 0] };
    case 'bottom': return { start: [0, 0], end: [0, 1] };
    case 'left': return { start: [1, 0], end: [0, 0] };
    default: return { start: [0, 0], end: [1, 0] };
  }
}

type Props = {
  children?: ?React.Element<*>,
  color: string,
  containerStyle?: ?Object,
  from: 'top' | 'bottom' | 'left' | 'right',
  radius?: number,
  size: number,
  style?: ?Object,
};

export default ({
  children, color, containerStyle, from, radius, size, style, ...props
}: Props) => {
  const GradientLayerOverlay = () => (
    <LinearGradient
      colors={[fade(color, 0), color]}
      style={[getStyle(from, size), radius && { borderRadius: radius }, style]}
      {...getProps(from)}
      {...props}
    />
  );

  return (
    <View style={[{ flex: 1, alignSelf: 'stretch' }, containerStyle]}>
      {children}
      <GradientLayerOverlay style={style} />
    </View>
  );
};
