import {
  ImageWithLoading,
  ImageWithLoadingProps,
} from '../../common/ImageWithLoading'
import { createSpringAnimatedComponent } from './helpers'

export type SpringAnimatedImageWithLoadingProps = ImageWithLoadingProps

export const SpringAnimatedImageWithLoading = createSpringAnimatedComponent(
  ImageWithLoading,
)
SpringAnimatedImageWithLoading.displayName = 'SpringAnimatedImageWithLoading'
