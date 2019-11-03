import { NextPage } from 'next'

import SubscribedPage from '../src/pages/SubscribedPage'

export interface SubscribedPageProps {}

const Subscribed: NextPage<SubscribedPageProps> = () => {
  return <SubscribedPage />
}

export default Subscribed
