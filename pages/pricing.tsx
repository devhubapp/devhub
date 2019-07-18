import { NextPage } from 'next'

import LandingLayout from '@devhub/landing/src/components/layouts/LandingLayout'

export interface PricingProps {
  shows: Array<{ id: string; name: string }>
}

const Pricing: NextPage<PricingProps> = () => {
  return (
    <LandingLayout>
      <p>This is the pricing page.</p>
    </LandingLayout>
  )
}

export default Pricing
