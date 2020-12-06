import { SpringConfig } from '@react-spring/native'

export function getDefaultReactSpringAnimationConfig(
  config?: SpringConfig & { precision?: number },
): SpringConfig {
  return {
    clamp: true,
    frequency: 0.2,
    ...config,
  }
}
