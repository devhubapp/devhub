import classNames from 'classnames'
import Link from 'next/link'
import React, { AnchorHTMLAttributes, Fragment } from 'react'

const twClasses = {
  button:
    'btn inline-block py-2 px-8 border text-black font-semibold rounded-full cursor-pointer',
  button__primary: 'border-primary bg-primary text-primaryForeground',
  button__secondary: 'border-primary text-primary',
  button__neutral: 'border-gray-300 bg-gray-300 text-black',
}

export interface ButtonProps extends AnchorHTMLAttributes<any> {
  children: React.ReactNode
  type: 'primary' | 'secondary' | 'neutral'
}

export default function Button(props: ButtonProps) {
  const { children: _children, href, type, ...aProps } = props

  const className = classNames(
    twClasses.button,
    type === 'primary' && twClasses.button__primary,
    type === 'secondary' && twClasses.button__secondary,
    type === 'neutral' && twClasses.button__neutral,
    aProps.className,
  )

  const children =
    typeof _children === 'string' ? (
      <span
        dangerouslySetInnerHTML={{ __html: _children.replace(/ /g, '&nbsp;') }}
      />
    ) : (
      _children
    )

  return (
    <>
      {href && href.startsWith('/') ? (
        <Link href={href}>
          <a {...aProps} className={className}>
            {children}
          </a>
        </Link>
      ) : (
        <a href={href} {...aProps} className={className}>
          {children}
        </a>
      )}

      <style jsx>{`
        .btn:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </>
  )
}
