import { NextPage } from 'next'

import PricingPage from '../src/pages/PricingPage'

export interface PricingPageProps {}

const Pricing: NextPage<PricingPageProps> = props => {
  return <PricingPage />
}

export default Pricing
