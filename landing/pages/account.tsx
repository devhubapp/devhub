import { NextPage } from 'next'

import AccountPage from '../src/pages/AccountPage'

export interface AccountPageProps {}

const Account: NextPage<AccountPageProps> = () => {
  return <AccountPage />
}

export default Account
