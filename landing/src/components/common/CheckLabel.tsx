import classNames from 'classnames'
import React, { CSSProperties } from 'react'
import Check, { CheckIconProps } from '../svg/CheckIcon'

export interface CheckLabelProps {
  checkProps?: CheckIconProps
  className?: string
  containerClassName?: string
  label: string
  style?: CSSProperties
}

export default function CheckLabel(props: CheckLabelProps) {
  const { style, containerClassName, label, className, checkProps } = props

  return (
    <div
      className={classNames('flex flex-row items-center', containerClassName)}
    >
      <span
        className={classNames('text-sm text-default', className)}
        style={style}
      >
        <Check
          {...checkProps}
          className={classNames(
            checkProps && checkProps.className
              ? checkProps.className
              : 'text-primary',
          )}
          containerClassName={classNames(
            'mr-1 self-start',
            checkProps && checkProps.containerClassName,
          )}
        />
        {label}
      </span>
    </div>
  )
}
