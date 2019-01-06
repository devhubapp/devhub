import _ from 'lodash'
import React, { useState } from 'react'
import { Animated, Clipboard, View } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { ModalColumn } from '../columns/ModalColumn'
import { Button } from '../common/Button'
import { H3 } from '../common/H3'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'

export function EnterpriseSetupModal() {
  const [copied, setCopied] = useState(false)

  const theme = useAnimatedTheme()

  const userId = useReduxState(selectors.currentUserIdSelector)
  const username = useReduxState(selectors.currentUsernameSelector)

  const email = `enterprise${'@'}devhubapp.com`

  return (
    <ModalColumn
      columnId="enterprise-setup-modal"
      iconName="plus"
      title="GitHub Enterprise"
    >
      <View style={{ flex: 1, padding: contentPadding }}>
        <Spacer height={contentPadding} />

        <Animated.Text style={{ lineHeight: 16, color: theme.foregroundColor }}>
          To enable DevHub on your GitHub Enterprise, contact us via e-mail
          below:{' '}
        </Animated.Text>

        <Spacer height={contentPadding} />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <H3>E-mail: </H3>

          <Link
            analyticsLabel={`mailto:${email}`}
            href={`mailto:${email}`}
            openOnNewTab={false}
          >
            <Animated.Text style={{ color: theme.foregroundColor }}>
              {email}
            </Animated.Text>
          </Link>
        </View>

        <Spacer height={contentPadding} />

        <Button
          analyticsCategory="enterprise"
          analyticsAction="copy_email"
          analyticsLabel={username}
          analyticsPayload={{ user_id: userId }}
          onPress={async () => {
            Clipboard.setString(email)
            setCopied(true)
          }}
        >
          {copied ? 'Copied!' : 'Copy e-mail'}
        </Button>
      </View>
    </ModalColumn>
  )
}
