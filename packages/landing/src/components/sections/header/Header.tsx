import classNames from 'classnames'
import Link from 'next/link'

import { ThemeSwitcher } from '../../common/ThemeSwitcher'
import HeaderLink from './HeaderLink'

const twClasses = {
  headerLink__rightMargin: 'mr-1',
}

export default function Header() {
  return (
    <header id="header" className="container mb-10 py-4 overflow-x-visible">
      <div className="flex flex-row items-center overflow-x-auto">
        <Link href="/">
          <a
            className={classNames(
              'transform-on-hover flex flex-row items-center',
              twClasses.headerLink__rightMargin,
            )}
            style={{ display: 'contents' }}
          >
            <img
              className="w-8 h-8 mr-6 sm:mr-3 bg-primary rounded-full"
              src="/static/logo.png"
            />

            <span className="text-lg text-default font-semibold hidden sm:inline-block">
              DevHub
            </span>
          </a>
        </Link>

        <div className="flex-1" />

        <HeaderLink
          href="https://twitter.com/devhub_app/"
          className={twClasses.headerLink__rightMargin}
          target="_blank"
        >
          Twitter
        </HeaderLink>

        {/* <HeaderLink
          href="/features"
          className={twClasses.headerLink__rightMargin}
        >
          Features
        </HeaderLink> */}

        <HeaderLink
          href="/pricing"
          className={twClasses.headerLink__rightMargin}
        >
          Pricing
        </HeaderLink>

        {/* <HeaderLink
          href="/changelog"
          className={twClasses.headerLink__rightMargin}
        >
          Changelog
        </HeaderLink> */}

        <HeaderLink
          href="/download"
          className={twClasses.headerLink__rightMargin}
        >
          Download
        </HeaderLink>

        <span className="pr-2" />

        <ThemeSwitcher />
      </div>
    </header>
  )
}
