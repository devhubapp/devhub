import { SpringConfig } from 'react-spring/native'

export function getDefaultReactSpringAnimationConfig(
  config?: SpringConfig,
): SpringConfig {
  return {
    friction: 35,
    tension: 340,
    ...config,
  }
}
