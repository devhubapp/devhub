import { PixelRatio } from 'react-native'

// sizes will be multiples of 50 for caching (e.g 50, 100, 150, ...)
export function getSteppedSize(size?: number, sizeSteps = 50) {
  const steppedSize =
    typeof size === 'number' ? sizeSteps * Math.max(1, Math.ceil(size / sizeSteps)) : sizeSteps

  return PixelRatio.getPixelSizeForLayoutSize(steppedSize)
}

export function randomBetween(minNumber: number, maxNumber: number) {
  return Math.floor(Math.random() * maxNumber) + minNumber
}
