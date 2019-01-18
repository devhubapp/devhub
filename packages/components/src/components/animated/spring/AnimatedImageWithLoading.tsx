import React from 'react'

import { Omit } from '@devhub/core'
import {
  ImageWithLoading,
  ImageWithLoadingProps,
} from '../../common/ImageWithLoading'

export interface AnimatedImageWithLoadingProps
  extends Omit<ImageWithLoadingProps, 'animated'> {
  style: any
}

export const AnimatedImageWithLoading = (
  props: AnimatedImageWithLoadingProps,
) => <ImageWithLoading {...props} animated />
