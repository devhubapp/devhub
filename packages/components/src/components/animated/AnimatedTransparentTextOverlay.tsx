import React from 'react'
import { Animated } from 'react-native'

import {
  TransparentTextOverlay,
  TransparentTextOverlayProps,
} from '../common/TransparentTextOverlay'

class TransparentTextOverlayClass extends React.Component<
  TransparentTextOverlayProps
> {
  render() {
    return <TransparentTextOverlay {...this.props} />
  }
}

export const AnimatedTransparentTextOverlay = Animated.createAnimatedComponent(
  TransparentTextOverlayClass,
) as typeof TransparentTextOverlayClass
