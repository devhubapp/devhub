import { NextPage } from 'next'

import { setPublicPlansCache } from '../src/context/PlansContext'
import PricingPage from '../src/pages/PricingPage'

export interface PricingPageProps {}

const Pricing: NextPage<PricingPageProps> = props => {
  console.log('xxx pricing page', props)
  return <PricingPage />
}

export default Pricing

export function unstable_getStaticProps() {
  setPublicPlansCache(value => ({
    ...value,
    freeTrialDays: 1234,
  }))

  return {
    props: {
      test: 1234,
    },
  }
}
