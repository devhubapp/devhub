import classNames from 'classnames'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const twClasses = {
  headerLink:
    'header-link px-2 md:px-3 text-base font-semibold text-center border rounded-full whitespace-no-wrap overflow-hidden',
  headerLink__active: 'bg-less-2 border-bg-less-2 text-default font-extrabold',
  headerLink__inactive:
    'bg-transparent border-transparent text-muted-65 hover:text-default',
}

export interface HeaderLinkProps extends LinkProps {
  children: React.ReactNode
  className?: string
  href: string
  target?: string
  rel?: string
}

export default function HeaderLink(props: HeaderLinkProps) {
  const { children: _children, className, rel, target, ...linkProps } = props

  const route = useRouter()

  const isActive = route.pathname.startsWith(`${linkProps.href || ''}`)

  const baseClass = classNames(
    twClasses.headerLink,
    isActive ? twClasses.headerLink__active : twClasses.headerLink__inactive,
  )

  const lineHeight = '2rem'

  const children = (
    <>
      <span className={baseClass} style={{ lineHeight }}>
        {_children}
      </span>
      <span
        className={classNames(
          baseClass,
          twClasses.headerLink__active,
          'invisible',
        )}
        style={{ lineHeight, marginTop: `-${lineHeight}` }}
      >
        {_children}
      </span>
    </>
  )

  if (linkProps.href && linkProps.href.startsWith('/')) {
    return (
      <Link {...linkProps}>
        <a
          className={classNames('flex flex-col transform-on-hover', className)}
          target={target}
          rel={rel || (target === '_blank' ? 'noopener' : undefined)}
        >
          {children}
        </a>
      </Link>
    )
  }

  return (
    <a
      className={classNames('flex flex-col transform-on-hover', className)}
      href={linkProps.href}
      target={target}
      rel={rel || (target === '_blank' ? 'noopener' : undefined)}
    >
      {children}
    </a>
  )
}
