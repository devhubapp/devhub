import React from 'react'

export interface ConditionalWrapProps {
  children: React.ReactElement<any>
  condition: boolean
  wrap: (children: React.ReactElement<any>) => React.ReactElement<any>
}

export function ConditionalWrap(props: ConditionalWrapProps) {
  const { children, condition, wrap } = props

  return condition ? wrap(children) : children
}
