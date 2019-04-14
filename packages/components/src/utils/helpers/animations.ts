import { SpringConfig } from 'react-spring/native'

export function getDefaultReactSpringAnimationConfig(
  config?: SpringConfig,
): SpringConfig {
  return {
    tension: 340,
    friction: 35,
    ...config,
  }
}
