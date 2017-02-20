// @flow

import React from 'react';
import { View } from 'react-native';

import LinearGradient from '../libs/linear-gradient';
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
    case 'top': return { start: { x: 0, y: 1 }, end: { x: 0, y: 0 } };
    case 'bottom': return { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };
    case 'left': return { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } };
    default: return { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } };
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
  const GradientLayerOverlay = ({ from: newFrom }) => (
    <LinearGradient
      colors={[fade(color, 0), color]}
      style={[getStyle(newFrom, size), radius && { borderRadius: radius }, style]}
      {...getProps(newFrom)}
      {...props}
    />
  );

  return (
    <View style={[{ flex: 1, alignSelf: 'stretch' }, containerStyle]}>
      {children}

      {
        (from === 'vertical' || from === 'top') &&
        <GradientLayerOverlay style={style} from="top" />
      }

      {
        (from === 'vertical' || from === 'bottom') &&
        <GradientLayerOverlay style={style} from="bottom" />
      }

      {
        (from === 'horizontal' || from === 'left') &&
        <GradientLayerOverlay style={style} from="left" />
      }

      {
        (from === 'horizontal' || from === 'right') &&
        <GradientLayerOverlay style={style} from="right" />
      }
    </View>
  );
};
