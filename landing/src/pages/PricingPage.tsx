import { LogoHead } from '../components/common/LogoHead'
import LandingLayout from '../components/layouts/LandingLayout'
import { PricingPlans } from '../components/sections/pricing/PricingPlans'
import { usePlans } from '../context/PlansContext'

export interface PricingPageProps {}

export default function PricingPage(_props: PricingPageProps) {
  const { dealCode, paidPlans } = usePlans()

  return (
    <LandingLayout>
      <section id="pricing">
        <LogoHead />

        <div className="container">
          <h1>
            {dealCode
              ? 'Your Deal Pricing'
              : paidPlans.length === 1
              ? 'Simple pricing'
              : 'Choose your plan'}
          </h1>
        </div>

        <PricingPlans />
      </section>
    </LandingLayout>
  )
}
