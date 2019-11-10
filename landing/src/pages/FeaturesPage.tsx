import { LogoHead } from '../components/common/LogoHead'
import LandingLayout from '../components/layouts/LandingLayout'
import FeaturesBlock from '../components/sections/features/FeaturesBlock'

export interface FeaturesPageProps {}

export default function FeaturesPage(_props: FeaturesPageProps) {
  return (
    <LandingLayout>
      <section id="features">
        <LogoHead />

        <div className="container">
          <h1>Features</h1>
        </div>

        <FeaturesBlock />

        <div className="pb-16 md:pb-32" />
      </section>
    </LandingLayout>
  )
}
