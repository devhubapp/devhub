import React from 'react'

import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { HeaderMessage } from './HeaderMessage'

export function FreeTrialHeaderMessage() {
  const username = useReduxState(selectors.currentGitHubUsernameSelector)
  if (username === 'appledevhub') return null

  return (
    <HeaderMessage
      analyticsLabel="about_free_trial_column"
      backgroundColor="primaryBackgroundColor"
      color="primaryForegroundColor"
      onPress={() =>
        alert(
          'Access to private repositories will be a paid feature' +
            ' once DevHub is available on GitHub Marketplace. ' +
            'Price yet to be defined.' +
            '\n' +
            "For now, it's free." +
            '\n' +
            '\n' +
            'If you want DevHub to keep being improved and maintained, ' +
            "consider purchasing the paid plan once it's available.\n" +
            '\n' +
            'Thank you!' +
            '\n' +
            '@brunolemos, creator of DevHub.',
        )
      }
    >
      Free trial. Learn more.
    </HeaderMessage>
  )
}
