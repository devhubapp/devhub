import { NextPage } from 'next'
import { useRouter } from 'next/router'
import qs from 'qs'
import { useEffect } from 'react'

import { usePlans } from '../src/context/PlansContext'
import { getPurchaseOrSubscribeRoute } from '../src/helpers'
import SubscribePage from '../src/pages/SubscribePage'

export interface SubscribePageProps {}

const Buy: NextPage<SubscribePageProps> = () => {
  const Router = useRouter()

  const { plans } = usePlans()

  useEffect(() => {
    const route = getPurchaseOrSubscribeRoute(plans)
    if (route === 'subscribe') return

    Router.replace(
      `/${route}${qs.stringify(Router.query, { addQueryPrefix: true })}`,
    )
  }, [])

  return <SubscribePage />
}

export default Buy
