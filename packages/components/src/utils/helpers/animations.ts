import { SpringConfig } from 'react-spring/native'

export function getDefaultReactSpringAnimationConfig(
  config?: SpringConfig & { precision?: number },
): SpringConfig {
  return {
    friction: 35,
    tension: 340,
    ...config,
  }
}
