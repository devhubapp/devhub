import Link from 'next/link'
import Button from '../components/common/buttons/Button'
import CheckLabel from '../components/common/CheckLabel'
import LandingLayout from '../components/layouts/LandingLayout'
import FeatureBlock from '../components/sections/FeatureBlock'
import UsedByCompaniesBlock from '../components/sections/UsedByCompaniesBlock'
import { aspectRatioToStyle } from '../helpers'

export interface HomePageProps {}

export default function HomePage(_props: HomePageProps) {
  return (
    <LandingLayout>
      <section id="homepage">
        <div className="container flex flex-col lg:flex-row xl:items-center mb-16">
          <div className="lg:w-5/12 lg:mr-12 mb-12 lg:mb-0">
            <div className="mb-8">
              <h1 className="text-5xl">
                GitHub management tool to help you keep your sanity
              </h1>

              <h2>
                Manage notifications; Filter repository activities; Filter
                Issues&nbsp;&amp;&nbsp;Pull&nbsp;Requests; Save custom searches;
                Enable Push&nbsp;Notifications for only what you want.
              </h2>
            </div>

            <div className="flex flex-row mb-4">
              <Button
                type="primary"
                href="/download?auto"
                className="mr-2 sm:mr-4"
              >
                Download&nbsp;for&nbsp;macOS&nbsp;↓
              </Button>

              <Button type="neutral" href="/">
                Go&nbsp;to&nbsp;web&nbsp;version
              </Button>
            </div>

            <div className="flex flex-row">
              <a
                href="https://itunes.apple.com/us/app/devhub-for-github/id1191864199?l=en&mt=8&utm_source=devhub_landing_page"
                target="_blank"
                className="mr-4"
              >
                <CheckLabel label="iOS" />
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.devhubapp&utm_source=devhub_landing_page"
                target="_blank"
                className="mr-4"
              >
                <CheckLabel label="Android" />
              </a>

              <Link href="/download?os=macos">
                <a className="mr-4">
                  <CheckLabel label="macOS" />
                </a>
              </Link>

              <Link href="/download?os=windows">
                <a className="mr-4">
                  <CheckLabel label="Windows" />
                </a>
              </Link>

              <Link href="/download?os=linux">
                <a className="mr-4">
                  <CheckLabel label="Linux" />
                </a>
              </Link>
            </div>
          </div>

          <div className="lg:w-7/12">
            <div className="p-2 bg-gray-100 rounded-lg">
              <div
                className="bg-gray-300 rounded"
                style={aspectRatioToStyle(3 / 5)}
              />
            </div>
          </div>
        </div>

        <UsedByCompaniesBlock />

        <section id="features">
          <FeatureBlock
            title="Manage Notifications"
            subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          />

          <FeatureBlock
            inverted
            title="Filter repository activities"
            subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          />

          <FeatureBlock
            title="Cross Platform"
            subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          />
        </section>
      </section>
    </LandingLayout>
  )
}