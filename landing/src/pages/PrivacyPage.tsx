import { LogoHead } from '../components/common/LogoHead'
import LandingLayout from '../components/layouts/LandingLayout'

export interface PrivacyPageProps {}

export default function PrivacyPage(_props: PrivacyPageProps) {
  return (
    <LandingLayout>
      <section id="privacy" className="container">
        <LogoHead />

        <h1>Privacy</h1>
      </section>
    </LandingLayout>
  )
}
