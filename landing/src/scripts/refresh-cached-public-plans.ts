import fs from 'fs'

import { fetchPlansState } from '../helpers/plans'

export async function run() {
  try {
    const state = await fetchPlansState()
    fs.writeFileSync(
      `${__dirname}/out/cached-public-plans.json`,
      JSON.stringify(state, null, 2),
      'utf8',
    )
  } catch (error) {
    console.error('Failed to refresh cached public plans', error)
  }
}

run()
