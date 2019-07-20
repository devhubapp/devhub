import classNames from 'classnames'
import Link, { LinkProps } from 'next/link'
import React from 'react'

const twClasses = {
  headerLink: 'text-base font-semibold leading-loose text-black',
  headerLink__primary: 'text-primary',
}

export interface HeaderLinkProps extends LinkProps {
  children: React.ReactNode
  className?: string
  type?: 'primary' | 'secondary'
}

export default function HeaderLink(props: HeaderLinkProps) {
  const { children, className, type, ...linkProps } = props

  return (
    <>
      <Link {...linkProps}>
        <a
          className={classNames(
            twClasses.headerLink,
            type === 'primary' && twClasses.headerLink__primary,
            className,
          )}
        >
          {children}
        </a>
      </Link>

      <style jsx>{`
        a {
          opacity: 0.75;
        }

        a:hover {
          opacity: 1;
        }
      `}</style>
    </>
  )
}
