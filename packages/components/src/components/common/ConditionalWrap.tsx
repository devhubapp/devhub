import React from 'react'

export interface ConditionalWrapProps {
  children: any
  condition: boolean
  wrap: (children: React.ReactElement<any>) => React.ReactNode
}

export function ConditionalWrap(props: ConditionalWrapProps) {
  const { children, condition, wrap } = props

  return condition ? wrap(children) : children
}
