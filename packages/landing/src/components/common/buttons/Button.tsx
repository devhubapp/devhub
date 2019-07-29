import classNames from 'classnames'
import Link from 'next/link'
import React, { AnchorHTMLAttributes } from 'react'

const twClasses = {
  button:
    'btn inline-block py-2 px-8 border font-semibold rounded-full cursor-pointer whitespace-no-wrap',
  button__primary: 'bg-primary text-primary-foreground border-primary',
  button__secondary: 'bg-transparent text-primary border-primary',
  button__neutral: 'bg-darker-2 text-default border-bg-darker-2',
}

export interface ButtonProps extends AnchorHTMLAttributes<any> {
  children: React.ReactNode
  type: 'primary' | 'secondary' | 'neutral'
}

function Button(
  props: ButtonProps,
  ref: React.Ref<HTMLAnchorElement> | undefined,
) {
  const { children, href, type, ...aProps } = props

  const className = classNames(
    twClasses.button,
    (type === 'neutral' && twClasses.button__neutral) ||
      (type === 'secondary' && twClasses.button__secondary) ||
      twClasses.button__primary,
    aProps.className,
  )

  return href && href.startsWith('/') ? (
    <Link href={href}>
      <a {...aProps} ref={ref} className={className}>
        {children}
      </a>
    </Link>
  ) : (
    <a {...aProps} ref={ref} href={href} className={className}>
      {children}
    </a>
  )
}

export default React.forwardRef(Button)
