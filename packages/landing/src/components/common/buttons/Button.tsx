import classNames from 'classnames'
import Link from 'next/link'
import React, { AnchorHTMLAttributes } from 'react'
import { Loader } from '../Loader'

const twClasses = {
  button:
    'btn flex items-center justify-center py-2 px-8 border font-semibold rounded-full cursor-pointer whitespace-no-wrap',
  button__primary: 'bg-primary text-primary-foreground border-primary',
  // button__secondary: 'bg-transparent text-primary border-primary',
  button__neutral: 'bg-less-2 text-default border-bg-darker-2',
  button__disabled: 'btn-disabled',
  loader__primary: 'text-primary-foreground',
  // loader__secondary: 'text-primary',
  loader__neutral: 'text-default',
}

export interface ButtonProps extends AnchorHTMLAttributes<any> {
  children: React.ReactNode
  disabled?: boolean
  loading?: boolean
  type: 'primary' | 'neutral' // | 'secondary'
}

function Button(
  props: ButtonProps,
  ref: React.Ref<HTMLAnchorElement> | undefined,
) {
  const {
    children,
    disabled,
    href: _href,
    loading,
    onClick: _onClick,
    type,
    ...aProps
  } = props

  const href = disabled || loading ? 'javascript:void(0)' : _href
  const onClick = disabled || loading ? undefined : _onClick

  const className = classNames(
    twClasses.button,
    (type === 'neutral' && twClasses.button__neutral) ||
      // (type === 'secondary' && twClasses.button__secondary) ||
      twClasses.button__primary,
    disabled && twClasses.button__disabled,
    aProps.className,
  )

  if (loading) {
    return (
      <a ref={ref} href={href} className={classNames(className, 'relative')}>
        <span className="opacity-0">{children}</span>
        <span
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: -24 / 2,
            marginTop: -24 / 2,
          }}
        >
          <Loader
            className={
              (type === 'neutral' && twClasses.loader__neutral) ||
              // (type === 'secondary' && twClasses.loader__secondary) ||
              twClasses.loader__primary
            }
            size={24}
          />
        </span>
      </a>
    )
  }

  return href && href.startsWith('/') ? (
    <Link href={href}>
      <a {...aProps} ref={ref} className={className} onClick={onClick}>
        {children}
      </a>
    </Link>
  ) : (
    <a
      {...aProps}
      ref={ref}
      className={className}
      href={href}
      onClick={onClick}
      rel={aProps.target === '_blank' ? 'noopener' : undefined}
    >
      {children}
    </a>
  )
}

export default React.forwardRef(Button)
