import classNames from 'classnames'
import Link from 'next/link'
import React, { AnchorHTMLAttributes } from 'react'

const twClasses = {
  button: 'py-2 px-8 text-black font-semibold rounded-full cursor-pointer',
  button__primary: 'bg-primary text-primaryForeground',
  button__secondary: 'bg-gray-400 text-gray-900',
  button__marginRight: 'mr-4',
}

export interface ButtonProps extends AnchorHTMLAttributes<any> {
  children: React.ReactNode
  type: 'primary' | 'secondary'
  withRightMargin?: boolean
}

export default function Button(props: ButtonProps) {
  const { children, href, type, withRightMargin, ...aProps } = props

  return (
    <Link href={href}>
      <a
        {...aProps}
        className={classNames(
          'btn',
          twClasses.button,
          type === 'primary' && twClasses.button__primary,
          type === 'secondary' && twClasses.button__secondary,
          withRightMargin && twClasses.button__marginRight,
          aProps.className,
        )}
      >
        {children}

        <style jsx>{`
          .btn:hover {
            transform: translateY(-1px);
          }
        `}</style>
      </a>
    </Link>
  )
}
