import Button from '../components/common/buttons/Button'
import CheckLabel from '../components/common/CheckLabel'
import { CheckLabels } from '../components/common/CheckLabels'
import LandingLayout from '../components/layouts/LandingLayout'
import FeaturesBlock from '../components/sections/features/FeaturesBlock'
import GetStartedBlock from '../components/sections/GetStartedBlock'
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
                Issues&nbsp;&amp;&nbsp;Pull&nbsp;Requests; Save custom searches;
                Enable Push&nbsp;Notifications for only what you want.
              </h2>
            </div>

            <div className="flex flex-row flex-wrap mb-4">
              <Button
                type="primary"
                href="/download?auto"
                className="mb-2 mr-2 sm:mr-4"
              >
                Download for macOS ↓
              </Button>

              <Button type="neutral" href="/" className="mb-2">
                Other downloads
              </Button>
            </div>

            <CheckLabels>
              <CheckLabel label="Free version" />
              <CheckLabel label="Free trial on paid features" />
            </CheckLabels>
          </div>

          <div className="lg:w-7/12">
            <div className="p-2 bg-less-1 rounded-lg">
              <div
                className="bg-less-2 rounded"
                style={aspectRatioToStyle(3 / 5)}
              />
            </div>
          </div>
        </div>

        <div className="pb-16" />

        <UsedByCompaniesBlock />

        <FeaturesBlock />

        <div className="pb-16" />

        <GetStartedBlock />
      </section>
    </LandingLayout>
  )
}
