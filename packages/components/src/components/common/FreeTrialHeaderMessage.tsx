import React from 'react'

import { constants } from '@devhub/core'
import { Browser } from '../../libs/browser'
import { HeaderMessage } from './HeaderMessage'

export function FreeTrialHeaderMessage() {
  return (
    <HeaderMessage
      analyticsLabel="about_free_trial_column"
      backgroundColor="primaryBackgroundColor"
      color="primaryForegroundColor"
      onPress={() =>
        Browser.openURLOnNewTab(`${constants.LANDING_BASE_URL}/pricing`)
      }
    >
      Free trial. Learn more.
    </HeaderMessage>
  )
}
