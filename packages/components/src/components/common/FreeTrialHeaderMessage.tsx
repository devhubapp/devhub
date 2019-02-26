import React from 'react'

import { HeaderMessage } from './HeaderMessage'

export function FreeTrialHeaderMessage() {
  return (
    <HeaderMessage
      analyticsLabel="about_free_trial_column"
      onPress={() =>
        alert(
          'Access to private repositories will be a paid feature' +
            ' once DevHub is available on GitHub Marketplace. ' +
            'Price yet to be defined.' +
            '\n' +
            "For now, it's free." +
            '\n' +
            '\n' +
            'If you want DevHub to keep being improved and maintaned, ' +
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
