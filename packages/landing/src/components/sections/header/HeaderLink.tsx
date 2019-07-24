import classNames from 'classnames'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const twClasses = {
  headerLink: 'text-base font-semibold leading-loose',
  headerLink__active: 'font-extrabold opacity-1',
  headerLink__inactive: 'opacity-75',
  headerLink__primary: 'text-primary',
  headerLink__secondary: 'text-default',
}

export interface HeaderLinkProps extends LinkProps {
  children: React.ReactNode
  className?: string
  type?: 'primary' | 'secondary'
}

export default function HeaderLink(props: HeaderLinkProps) {
  const { children, className, type, ...linkProps } = props

  const route = useRouter()

  return (
    <>
      <Link {...linkProps}>
        <a
          className={classNames(
            twClasses.headerLink,
            route.pathname.startsWith(`${linkProps.href || ''}`)
              ? twClasses.headerLink__active
              : twClasses.headerLink__inactive,
            type === 'primary'
              ? twClasses.headerLink__primary
              : twClasses.headerLink__secondary,
            className,
          )}
        >
          {children}
        </a>
      </Link>

      <style jsx>{`
        a:hover {
          opacity: 1;
        }
      `}</style>
    </>
  )
}
