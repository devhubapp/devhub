import { LogoHead } from '../components/common/LogoHead'
import LandingLayout from '../components/layouts/LandingLayout'

export interface TermsPageProps {}

export default function TermsPage(_props: TermsPageProps) {
  return (
    <LandingLayout>
      <section id="terms" className="container">
        <LogoHead />

        <h1>Terms</h1>
      </section>
    </LandingLayout>
  )
}
