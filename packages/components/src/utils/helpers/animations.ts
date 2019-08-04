import { SpringConfig } from 'react-spring/native'

export function getDefaultReactSpringAnimationConfig(
  config: SpringConfig & { precision: number },
): SpringConfig {
  return {
    precision: 1,
    friction: 35,
    tension: 340,
    ...config,
  }
}
