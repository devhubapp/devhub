import { NextPage } from 'next'
import { useRouter } from 'next/router'
import qs from 'qs'
import { useEffect } from 'react'

import SuccessPage from '../src/pages/SuccessPage'

export interface SuccessPageProps {}

const Subscribed: NextPage<SuccessPageProps> = () => {
  const Router = useRouter()

  useEffect(() => {
    Router.replace(
      `/success${qs.stringify(Router.query, { addQueryPrefix: true })}`,
    )
  }, [])

  return <SuccessPage />
}

export default Subscribed
