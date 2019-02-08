import {
  ImageWithLoading,
  ImageWithLoadingProps,
} from '../../common/ImageWithLoading'
import { createSpringAnimatedComponent } from './helpers'

export interface SpringAnimatedImageWithLoadingProps
  extends ImageWithLoadingProps {}

export const SpringAnimatedImageWithLoading = createSpringAnimatedComponent(
  ImageWithLoading,
)
