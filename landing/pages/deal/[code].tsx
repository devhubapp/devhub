import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { LogoHead } from '../../src/components/common/LogoHead'
import LandingLayout from '../../src/components/layouts/LandingLayout'
import { usePlans } from '../../src/context/PlansContext'

export interface DealPageProps {}

const Deal: NextPage<DealPageProps> = () => {
  const router = useRouter()
  const query: { dealCode?: string } = router.query || {}
  const { dealCode } = query

  const { trySetDealCode } = usePlans()

  useEffect(() => {
    trySetDealCode(dealCode)
  }, [dealCode])

  return (
    <LandingLayout>
      <section id="deal">
        <LogoHead />

        <div className="container">
          <h1>Applying deal...</h1>
        </div>
      </section>
    </LandingLayout>
  )
}

export default Deal
