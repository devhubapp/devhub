import {
  activePaidPlans,
  constants,
  freePlan,
  freeTrialDays,
} from '@brunolemos/devhub-core'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import CheckLabel from '../components/common/CheckLabel'
import { CheckLabels } from '../components/common/CheckLabels'
import { LogoHead } from '../components/common/LogoHead'
import { ResponsiveImage } from '../components/common/ResponsiveImage'
import LandingLayout from '../components/layouts/LandingLayout'
import CTAButtons from '../components/sections/CTAButtons'
import FeaturesBlock from '../components/sections/features/FeaturesBlock'
import GetStartedBlock from '../components/sections/GetStartedBlock'
import UsedByCompaniesBlock from '../components/sections/UsedByCompaniesBlock'

export interface HomePageProps {}

export default function HomePage(_props: HomePageProps) {
  const Router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const interval = setInterval(() => {
      Router.replace(Router.route, Router.pathname)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [Router.query.features])

  return (
    <LandingLayout>
      <section id="homepage">
        <LogoHead />

        <div className="container flex flex-col lg:flex-row">
          <div className="mb-12 lg:mb-0">
            <div className="flex flex-col lg:w-8/12 items-center m-auto mb-8 text-center">
              <h1 className="text-4xl sm:text-5xl">
                DevHub is like TweetDeck, but&nbsp;for&nbsp;GitHub
              </h1>

              <h2>
                Create columns with filters; Manage Notifications, Issues, Pull
                Requests and Repository Activities; Bookmark things for later;
                Enable Desktop Push Notifications.
              </h2>
            </div>
            <CTAButtons center className="mb-2" />
            <CheckLabels center className="mb-16">
              {!!(freePlan && !freePlan.trialPeriodDays) && (
                <CheckLabel label="Free version" />
              )}
              {!!freeTrialDays &&
                !activePaidPlans.every(plan => !plan.interval) && (
                  <CheckLabel label={`${freeTrialDays}-day free trial`} />
                )}
              {!!(
                activePaidPlans && activePaidPlans.every(plan => !plan.interval)
              ) && <CheckLabel label="One-time payment (no subscription)" />}

              {!constants.GITHUB_APP_HAS_CODE_ACCESS && (
                <CheckLabel label="No code access (granular permissons)" />
              )}

              <CheckLabel label="Cross-platform (desktop & mobile)" />
            </CheckLabels>
            <ResponsiveImage
              alt="DevHub Screenshot with 4 columns: Notifications, Facebook activity, TailwindCSS activity and Filters"
              src="/static/screenshots/dark/devhub-desktop.jpg"
              aspectRatio={1440 / 798}
              enableBorder
              minHeight={500}
            />
            <p className="block sm:hidden mb-4" />
            <small className="block sm:hidden italic text-sm text-muted-65 text-center">
              TIP: You can scroll the images horizontally
            </small>
          </div>

          {/* <div className="lg:w-7/12">
            <div className="block sm:hidden">
              <div className="pb-8" />

              <DeviceFrame>
                <div className="relative w-full h-full m-auto">
                  <img
                    alt="DevHub mobile screenshot"
                    src="/static/screenshots/iphone-notifications-light.jpg"
                    className="visible-light-theme absolute inset-0 object-cover bg-white"
                  />
                  <img
                    alt="DevHub mobile screenshot"
                    src="/static/screenshots/iphone-notifications-dark.jpg"
                    className="visible-dark-theme absolute inset-0 object-cover"
                  />
                </div>
              </DeviceFrame>
            </div>
          </div> */}
        </div>

        <div className="pb-16" />

        <UsedByCompaniesBlock />

        <div className="pb-8" />
        <section id="features">
          <div className="pb-8" />

          <FeaturesBlock />
        </section>

        {/* <div className="pb-8" />
        <section id="pricing">
          <div className="pb-8" />

          <div className="container">
            <h1 className="mb-12">Choose your plan</h1>
          </div>

          <PricingPlans />
        </section> */}

        <div className="pb-16" />

        <GetStartedBlock />
      </section>
    </LandingLayout>
  )
}
