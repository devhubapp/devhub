import classNames from 'classnames'
import Link, { LinkProps } from 'next/link'
import React from 'react'

const twClasses = {
  headerLink: 'text-base font-semibold leading-loose text-black',
  headerLink__primary: 'text-primary',
  headerLink__rightMargin: 'mr-6 md:mr-12',
}

export interface HeaderLinkProps extends LinkProps {
  children: React.ReactNode
  type?: 'primary' | 'secondary'
  withRightMargin?: boolean
}

export default function HeaderLink(props: HeaderLinkProps) {
  const { children, type, withRightMargin, ...linkProps } = props

  return (
    <>
      <Link {...linkProps}>
        <a
          className={classNames(
            twClasses.headerLink,
            type === 'primary' && twClasses.headerLink__primary,
            withRightMargin && twClasses.headerLink__rightMargin,
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
