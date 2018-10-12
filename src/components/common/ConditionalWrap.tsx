import React from 'react'

export interface ConditionalWrapProps {
  children: React.ReactElement<any>
  condition: boolean
  wrap: (children: React.ReactElement<any>) => React.ReactElement<any>
}

export const ConditionalWrap: React.SFC<ConditionalWrapProps> = ({ children, condition, wrap }) =>
  condition ? wrap(children) : children
