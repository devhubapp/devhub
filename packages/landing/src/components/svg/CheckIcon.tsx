import classNames from 'classnames'
import React, { CSSProperties } from 'react'

export interface CheckIconProps {
  className?: string
  color?: string
  containerClassName?: string
  size?: number
  style?: CSSProperties
}

export default function CheckIcon(props: CheckIconProps) {
  const { containerClassName, className, size = 20, style } = props

  return (
    <svg
      className={classNames('inline', containerClassName)}
      clip-rule="evenodd"
      fill-rule="evenodd"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={classNames('fill-current', className)}
        style={style}
        d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z"
      />
    </svg>
  )
}
