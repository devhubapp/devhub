import LandingLayout from '../components/layouts/LandingLayout'

export interface PricingPageProps {}

export default function PricingPage(_props: PricingPageProps) {
  return (
    <LandingLayout>
      <section id="pricing" className="container">
        <h1>Pricing</h1>
      </section>
    </LandingLayout>
  )
}
