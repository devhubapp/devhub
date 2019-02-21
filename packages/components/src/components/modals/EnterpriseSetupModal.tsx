import _ from 'lodash'
import React, { useState } from 'react'
import { Clipboard, View } from 'react-native'

export interface EnterpriseSetupModalProps {
  showBackButton: boolean
}

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { ModalColumn } from '../columns/ModalColumn'
import { Button } from '../common/Button'
import { H3 } from '../common/H3'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'

export function EnterpriseSetupModal(props: EnterpriseSetupModalProps) {
  const { showBackButton } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const [copied, setCopied] = useState(false)

  const userId = useReduxState(selectors.currentUserIdSelector)
  const username = useReduxState(selectors.currentUsernameSelector)

  const email = `enterprise${'@'}devhubapp.com`

  return (
    <ModalColumn
      iconName="plus"
      name="SETUP_GITHUB_ENTERPRISE"
      showBackButton={showBackButton}
      title="GitHub Enterprise"
    >
      <View style={{ flex: 1, padding: contentPadding }}>
        <Spacer height={contentPadding} />

        <SpringAnimatedText
          style={{ lineHeight: 16, color: springAnimatedTheme.foregroundColor }}
        >
          To enable DevHub on your GitHub Enterprise, contact us via e-mail
          below:{' '}
        </SpringAnimatedText>

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
            <SpringAnimatedText
              style={{ color: springAnimatedTheme.foregroundColor }}
            >
              {email}
            </SpringAnimatedText>
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
