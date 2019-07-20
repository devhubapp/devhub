import Button from '../components/common/buttons/Button'
import LandingLayout from '../components/layouts/LandingLayout'
import { aspectRatioToStyle } from '../helpers'

export interface HomePageProps {}

export default function HomePage(_props: HomePageProps) {
  return (
    <LandingLayout>
      <div className="container flex flex-col lg:flex-row mb-16">
        <div className="lg:w-5/12 lg:mr-12 mb-6">
          <div className="mb-6">
            <h1>GitHub management tool that helps you keep your sanity</h1>
            <h2>
              Manage notifications; Watch only a subset of repository
              activities; Save custom searches; Enable Push&nbsp;Notifications
              only for what you want; Save anything for later.
            </h2>
          </div>

          <div className="flex flex-row mb-6">
            <Button type="primary" href="/" withRightMargin>
              Download for macOS
            </Button>
            <Button type="secondary" href="/">
              Other downloads
            </Button>
          </div>
        </div>

        <div className="lg:w-7/12">
          <div
            className="bg-gray-200 rounded-lg"
            style={aspectRatioToStyle(3 / 5)}
          />
        </div>
      </div>

      <section id="trusted-by" className="bg-gray-200 p-6 mb-16">
        <div className="container text-center">
          <h3 className="uppercase">Loved by</h3>
          <h4>Developers and Managers from these companies:</h4>

          <div className="flex flex-row justify-center mt-3">
            <div className="w-32">
              <div className="bg-gray-400" style={aspectRatioToStyle(1 / 3)} />
            </div>
            <div className="w-32 ml-1 lg:ml-3">
              <div className="bg-gray-400" style={aspectRatioToStyle(1 / 3)} />
            </div>
            <div className="w-32 ml-1 lg:ml-3">
              <div className="bg-gray-400" style={aspectRatioToStyle(1 / 3)} />
            </div>
            <div className="w-32 ml-1 lg:ml-3">
              <div className="bg-gray-400" style={aspectRatioToStyle(1 / 3)} />
            </div>
            <div className="w-32 ml-1 lg:ml-3">
              <div className="bg-gray-400" style={aspectRatioToStyle(1 / 3)} />
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  )
}
