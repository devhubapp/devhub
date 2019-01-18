import React from 'react'

import { Omit } from '@devhub/core'
import {
  ImageWithLoading,
  ImageWithLoadingProps,
} from '../../common/ImageWithLoading'

export interface SpringAnimatedImageWithLoadingProps
  extends Omit<ImageWithLoadingProps, 'animated'> {
  style: any
}

export const SpringAnimatedImageWithLoading = (
  props: SpringAnimatedImageWithLoadingProps,
) => <ImageWithLoading {...props} animated />
