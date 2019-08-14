import React, { ReactElement } from 'react'

import { CheckLabelProps } from './CheckLabel'

export interface CheckLabelsProps {
  children: Array<ReactElement<CheckLabelProps>>
}

export function CheckLabels(props: CheckLabelsProps) {
  const { children } = props

  const total = React.Children.count(children)

  return (
    <div className="flex flex-row flex-wrap">
      {React.Children.map(children, (child, index) => (
        <>
          {child}
          {index < total - 1 && <div className="pr-4" />}
        </>
      ))}
    </div>
  )
}
