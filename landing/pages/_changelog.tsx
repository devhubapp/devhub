import { NextPage } from 'next'

import ChangelogPage from '../src/pages/ChangelogPage'

export interface ChangelogProps {}

const Changelog: NextPage<ChangelogProps> = () => {
  return <ChangelogPage />
}

export default Changelog
