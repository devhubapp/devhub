import { ReactType } from 'react'
import { animated } from 'react-spring/native'

export function createSpringAnimatedComponent<T extends ReactType<any>>(
  component: T,
) {
  // TODO: Fix type definition
  return (animated(component) as unknown) as any
}
