import { SpringConfig } from 'react-spring/native'

export function getDefaultReactSpringAnimationConfig(
  config?: SpringConfig & { precision?: number },
): SpringConfig {
  return {
    clamp: true,
    friction: 100,
    tension: 1500,
    velocity: 40,
    ...config,
  }
}
