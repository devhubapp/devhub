import { NextPage } from 'next'

import AccountPage from '@devhub/landing/src/pages/AccountPage'

export interface AccountPageProps {}

const Account: NextPage<AccountPageProps> = () => {
  return <AccountPage />
}

export default Account
