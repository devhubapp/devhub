import React from 'react'

import { Omit } from '@devhub/core'
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from '../common/TouchableOpacity'

export interface AnimatedTouchableOpacityProps
  extends Omit<TouchableOpacityProps, 'animated'> {
  style?: any
}

export const AnimatedTouchableOpacity = (
  props: AnimatedTouchableOpacityProps,
) => <TouchableOpacity {...props} animated />
