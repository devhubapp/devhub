import { activePaidPlans } from '@brunolemos/devhub-core'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import qs from 'qs'
import { useEffect } from 'react'

import SubscribePage from '../src/pages/SubscribePage'

export interface SubscribePageProps {}

const Buy: NextPage<SubscribePageProps> = () => {
  const Router = useRouter()

  useEffect(() => {
    if (activePaidPlans.some(p => !!p.interval)) return

    Router.replace(
      `/purchase${qs.stringify(Router.query, { addQueryPrefix: true })}`,
    )
  }, [])

  return <SubscribePage />
}

export default Buy
