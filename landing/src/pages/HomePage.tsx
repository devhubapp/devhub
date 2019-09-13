import CheckLabel from '../components/common/CheckLabel'
import { CheckLabels } from '../components/common/CheckLabels'
import { DeviceFrame } from '../components/common/DeviceFrame'
import LandingLayout from '../components/layouts/LandingLayout'
import DownloadButtons from '../components/sections/download/DownloadButtons'
import UsedByCompaniesBlock from '../components/sections/UsedByCompaniesBlock'
import { aspectRatioToStyle } from '../helpers'

export interface HomePageProps {}

export default function HomePage(_props: HomePageProps) {
  return (
    <LandingLayout>
      <section id="homepage">
        <div className="container flex flex-col lg:flex-row">
          <div className="lg:w-5/12 lg:mr-12 mb-12 lg:mb-0">
            <div className="mb-8">
              <h1 className="text-5xl font-bold">
                GitHub management tool to help you keep your sanity
              </h1>

              <h2>
                Manage notifications; Filter repository activities; Filter
                Issues &amp; Pull Requests; Save custom searches; Enable Push
                Notifications for only what you want.
              </h2>
            </div>

            <DownloadButtons />

            <CheckLabels>
              <CheckLabel label="Free version" />
              <CheckLabel label="Free trial on paid features" />
              <CheckLabel label="No code access" />
            </CheckLabels>
          </div>

          <div className="lg:w-7/12">
            <div className="p-2 bg-less-1 rounded-lg">
              <div
                className="relative bg-less-2 rounded"
                style={aspectRatioToStyle(2880 / 1596)}
              >
                <img
                  alt="DevHub desktop screenshot"
                  src="/static/screenshots/devhub-desktop-zoomed-light.jpg"
                  className="visible-light-theme absolute inset-0 object-cover rounded"
                />
                <img
                  alt="DevHub desktop screenshot"
                  src="/static/screenshots/devhub-desktop-zoomed-dark.jpg"
                  className="visible-dark-theme absolute inset-0 object-cover rounded"
                />
              </div>
            </div>

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
          </div>
        </div>

        <div className="pb-16" />

        <UsedByCompaniesBlock />
      </section>
    </LandingLayout>
  )
}
