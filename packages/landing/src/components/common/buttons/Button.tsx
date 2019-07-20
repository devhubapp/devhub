import classNames from 'classnames'
import Link from 'next/link'
import React, { AnchorHTMLAttributes } from 'react'

const twClasses = {
  button:
    'py-2 px-8 border text-black font-semibold rounded-full cursor-pointer',
  button__primary: 'border-primary bg-primary text-primaryForeground',
  button__secondary: 'border-primary text-primary',
  button__neutral: 'border-gray-300 bg-gray-300 text-black',
}

export interface ButtonProps extends AnchorHTMLAttributes<any> {
  children: React.ReactNode
  type: 'primary' | 'secondary' | 'neutral'
}

export default function Button(props: ButtonProps) {
  const { children, href, type, ...aProps } = props

  return (
    <Link href={href}>
      <a
        {...aProps}
        className={classNames(
          'btn',
          twClasses.button,
          type === 'primary' && twClasses.button__primary,
          type === 'secondary' && twClasses.button__secondary,
          type === 'neutral' && twClasses.button__neutral,
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
