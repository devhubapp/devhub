import LandingLayout from '../components/layouts/LandingLayout'
import GetStartedBlock from '../components/sections/GetStartedBlock'

export interface FeaturesPageProps {}

export default function FeaturesPage(_props: FeaturesPageProps) {
  return (
    <LandingLayout>
      <section id="features">
        <div className="container">
          <h1>Features</h1>
        </div>

        <div className="pb-16" />

        <GetStartedBlock />
      </section>
    </LandingLayout>
  )
}
