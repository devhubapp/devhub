import classNames from 'classnames'
import Link from 'next/link'

import { useAuth } from '../../../context/AuthContext'
import { usePlans } from '../../../context/PlansContext'
import { ThemeSwitcher } from '../../common/ThemeSwitcher'
import HeaderLink from './HeaderLink'

const twClasses = {
  headerLink__rightMargin: 'mr-1',
}

export interface HeaderProps {
  fixed?: boolean
}

export default function Header(props: HeaderProps) {
  const { fixed } = props

  const { freeTrialDays, paidPlans, plans } = usePlans()
  const { authData } = useAuth()

  return (
    <>
      <header
        id="header"
        className={classNames(fixed && 'fixed top-0 left-0 right-0', 'mb-10')}
        style={{
          ...(fixed && {
            minHeight: 70,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 100,
          }),
        }}
      >
        {!!fixed && <div className="absolute inset-0 bg-default opacity-75" />}

        <div className="relative container py-4 overflow-x-visible">
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
                  alt="DevHub Logo"
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
              className={twClasses.headerLink__rightMargin}
              href="https://twitter.com/devhub_app/"
              target="_blank"
              rel="noopener"
            >
              Twitter ↗
            </HeaderLink>

            <HeaderLink
              href="/#features"
              className={twClasses.headerLink__rightMargin}
            >
              Features
            </HeaderLink>

            {paidPlans.length > 1 && (
              <HeaderLink
                href="/pricing"
                className={twClasses.headerLink__rightMargin}
              >
                Pricing
              </HeaderLink>
            )}

            {/* <HeaderLink
              href="/changelog"
              className={twClasses.headerLink__rightMargin}
            >
              Changelog
            </HeaderLink> */}

            {!!(
              (freeTrialDays && plans.some(plan => !plan.amount)) ||
              (authData &&
                authData.appToken &&
                (freeTrialDays || (authData.plan && authData.plan.amount)))
            ) && (
              <HeaderLink
                href="/download"
                className={twClasses.headerLink__rightMargin}
              >
                Download
              </HeaderLink>
            )}

            {authData && authData.appToken ? (
              <HeaderLink
                href="/account"
                className={twClasses.headerLink__rightMargin}
              >
                My account
              </HeaderLink>
            ) : (
              <HeaderLink
                href="/account?autologin"
                className={twClasses.headerLink__rightMargin}
              >
                Login
              </HeaderLink>
            )}

            <span className="pr-2" />

            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {!!fixed && <div className="mb-10" style={{ minHeight: 70 }} />}
    </>
  )
}
