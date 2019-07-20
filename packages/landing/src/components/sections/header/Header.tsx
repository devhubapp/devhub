import Link from 'next/link'

import HeaderLink from './HeaderLink'

const twClasses = {
  headerLink__rightMargin: 'mr-6 md:mr-12',
}

export default function Header() {
  return (
    <header className="container flex flex-row items-center py-4 mb-6 lg:mb-10">
      <Link href="/">
        <a className="flex flex-row items-center">
          <div className="w-8 h-8 mr-3 bg-primary rounded-full" />
          <span className="text-lg font-semibold text-black">DevHub</span>
        </a>
      </Link>

      <div className="flex-1" />

      <HeaderLink
        prefetch
        href="/pricing"
        className={twClasses.headerLink__rightMargin}
      >
        Pricing
      </HeaderLink>

      <HeaderLink
        href="/changelog"
        className={twClasses.headerLink__rightMargin}
      >
        Changelog
      </HeaderLink>

      <HeaderLink prefetch href="/download" type="primary">
        Download&nbsp;↓
      </HeaderLink>
    </header>
  )
}
