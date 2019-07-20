import classNames from 'classnames'
import React, { CSSProperties } from 'react'
import Check, { CheckIconProps } from '../svg/CheckIcon'

export interface CheckLabelProps {
  checkProps?: CheckIconProps
  className?: string
  label: string
  style?: CSSProperties
}

export default function CheckLabel(props: CheckLabelProps) {
  const { checkProps, className, label, style } = props

  return (
    <div className={classNames('flex flex-row items-center', className)}>
      <Check
        {...checkProps}
        className={classNames(
          'text-primary',
          checkProps && checkProps.className,
        )}
        containerClassName={classNames(
          'mr-1',
          checkProps && checkProps.containerClassName,
        )}
      />
      <span className="text-sm" style={style}>
        {label}
      </span>
    </div>
  )
}
