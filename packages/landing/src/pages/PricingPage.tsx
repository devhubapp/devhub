import LandingLayout from '../components/layouts/LandingLayout'
import { PricingPlanBlock } from '../components/sections/pricing/PricingPlanBlock'
import { PricingPlans } from '../components/sections/pricing/PricingPlans'

export interface PricingPageProps {}

export default function PricingPage(_props: PricingPageProps) {
  return (
    <LandingLayout>
      <section id="pricing">
        <div className="container">
          <h1>Pricing</h1>

          <PricingPlans>
            <PricingPlanBlock
              banner
              buttonLink="/download?plan=free"
              buttonLabel="Download"
              plan={{
                name: 'Free',
                description: 'Limited set of features, up to 5 columns',
                price: 0,
                period: 'month',
                features: [
                  { label: 'Up to 5 columns', available: true },
                  { label: 'All filters', available: true },
                  { label: 'Sync between devices', available: false },
                  { label: 'Private repositorites', available: false },
                  { label: 'Push Notifications', available: false },
                  { label: 'More than 5 columns', available: false },
                ],
              }}
            />

            <PricingPlanBlock
              banner
              buttonLink="/subscribe?plan=starter"
              plan={{
                name: 'Starter',
                description: 'All paid features, up to 10 columns',
                price: 10,
                period: 'month',
                features: [
                  { label: 'Up to 10 columns', available: true },
                  { label: 'All filters', available: true },
                  { label: 'Sync between devices', available: true },
                  { label: 'Private repositorites', available: true },
                  { label: 'Push Notifications', available: true },
                  { label: 'More than 10 columns', available: false },
                ],
              }}
            />

            <PricingPlanBlock
              banner="Best value"
              buttonLink="/subscribe?plan=starter"
              plan={{
                name: 'Pro',
                description: 'All paid features, up to 20 columns',
                price: 15,
                period: 'month',
                features: [
                  { label: 'Up to 20 columns', available: true },
                  { label: 'All filters', available: true },
                  { label: 'Sync between devices', available: true },
                  { label: 'Private repositorites', available: true },
                  { label: 'Push Notifications', available: true },
                ],
              }}
            />
            <PricingPlanBlock
              banner
              buttonLink="/subscribe?plan=sponsor"
              plan={{
                name: 'Sponsor',
                description:
                  'All Pro features, plus your company logo on our page',
                price: 1000,
                period: 'month',
                features: [
                  { label: 'All Pro features', available: true },
                  {
                    label: 'Your company logo on our page',
                    available: true,
                  },
                  { label: 'Priority support', available: true },
                ],
              }}
            />
          </PricingPlans>
        </div>
      </section>
    </LandingLayout>
  )
}
