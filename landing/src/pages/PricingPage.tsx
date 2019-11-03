import LandingLayout from '../components/layouts/LandingLayout'
import { PricingPlans } from '../components/sections/pricing/PricingPlans'

export interface PricingPageProps {}

export default function PricingPage(_props: PricingPageProps) {
  return (
    <LandingLayout>
      <section id="pricing">
        <div className="container">
          <h1>Pricing</h1>

          <PricingPlans />
        </div>
      </section>
    </LandingLayout>
  )
}
