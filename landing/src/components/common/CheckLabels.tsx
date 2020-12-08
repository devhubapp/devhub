import classNames from 'classnames'
import React, { ReactElement } from 'react'

import { CheckLabelProps } from './CheckLabel'

export interface CheckLabelsProps {
  center?: boolean
  className?: string
  children: (ReactElement<CheckLabelProps> | boolean)[]
}

export function CheckLabels(props: CheckLabelsProps) {
  const { center, className, children } = props

  const total = React.Children.count(children)

  return (
    <div
      className={classNames('flex', center && 'items-center m-auto', className)}
    >
      <div
        className={classNames(
          'flex flex-row flex-wrap',
          center && 'items-center justify-center m-auto text-center',
        )}
      >
        {React.Children.map(children, (child, index) => (
          <>
            {child}
            {!!(child && index < total - 1) && <div className="pr-4" />}
          </>
        ))}
      </div>
    </div>
  )
}
