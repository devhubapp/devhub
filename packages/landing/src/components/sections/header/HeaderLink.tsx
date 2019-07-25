import classNames from 'classnames'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const twClasses = {
  headerLink: 'px-4 text-base font-semibold text-center border rounded-full',
  headerLink__active: 'bg-less-2 border-bg-less-2 text-default font-extrabold',
  headerLink__inactive: 'bg-default border-bg text-muted-60 hover:text-default',
}

export interface HeaderLinkProps extends LinkProps {
  children: React.ReactNode
  className?: string
  target?: string
}

export default function HeaderLink(props: HeaderLinkProps) {
  const { children, className, target, ...linkProps } = props

  const route = useRouter()

  const isActive = route.pathname.startsWith(`${linkProps.href || ''}`)

  const baseClass = classNames(
    twClasses.headerLink,
    isActive ? twClasses.headerLink__active : twClasses.headerLink__inactive,
  )

  const lineHeight = '2rem'

  return (
    <>
      <Link {...linkProps}>
        <a className={classNames('flex flex-col', className)} target={target}>
          <span className={baseClass} style={{ lineHeight }}>
            {children}
          </span>
          <span
            className={classNames(
              baseClass,
              twClasses.headerLink__active,
              'invisible',
            )}
            style={{ lineHeight, marginTop: `-${lineHeight}` }}
          >
            {children}
          </span>
        </a>
      </Link>
    </>
  )
}
