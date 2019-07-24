import classNames from 'classnames'
import Link from 'next/link'
import React, { AnchorHTMLAttributes } from 'react'

const twClasses = {
  button:
    'btn inline-block py-2 px-8 border font-semibold rounded-full cursor-pointer',
  button__primary: 'bg-primary text-primary-foreground border-primary',
  button__secondary: 'bg-default text-primary border-primary',
  button__neutral: 'bg-darker-2 text-default border-bg-darker-2',
}

export interface ButtonProps extends AnchorHTMLAttributes<any> {
  children: React.ReactNode
  type: 'primary' | 'secondary' | 'neutral'
}

export default function Button(props: ButtonProps) {
  const { children: _children, href, type, ...aProps } = props

  const className = classNames(
    twClasses.button,
    (type === 'neutral' && twClasses.button__neutral) ||
      (type === 'secondary' && twClasses.button__secondary) ||
      twClasses.button__primary,
    aProps.className,
  )

  const children =
    typeof _children === 'string' ? (
      <span
        className={className}
        dangerouslySetInnerHTML={{ __html: _children.replace(/ /g, '&nbsp;') }}
      />
    ) : (
      <span className={className}>{_children}</span>
    )

  return (
    <>
      {href && href.startsWith('/') ? (
        <Link href={href}>
          <a {...aProps}>{children}</a>
        </Link>
      ) : (
        <a href={href} {...aProps}>
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
