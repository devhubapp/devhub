import LandingLayout from '../components/layouts/LandingLayout'
import FeaturesBlock from '../components/sections/features/FeaturesBlock'
import GetStartedBlock from '../components/sections/GetStartedBlock'

export interface FeaturesPageProps {}

export default function FeaturesPage(_props: FeaturesPageProps) {
  return (
    <LandingLayout>
      <section id="features">
        <div className="container">
          <h1>Features</h1>
        </div>

        <FeaturesBlock />

        <div className="pb-16 md:pb-32" />

        <GetStartedBlock />
      </section>
    </LandingLayout>
  )
}
